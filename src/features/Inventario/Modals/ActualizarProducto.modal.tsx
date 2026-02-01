import { Bounce, toast, ToastContainer } from "react-toastify";
import Modal from "../../../components/modales/Modal";
import { useInventario } from "../../../hooks/useInventario";
import { useForm } from "../../../hooks/useForm";
import style from "../container.module.css";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import uploadIcon from "../../../assets/upload.svg";

export interface ProductoRepository {
  id_existencia: number;
  id_inst: number;
  id_producto: number;
  cantidad: number;
  cantidad_minima: number;
  precio_venta: number;
  costo: number;
  estado: number;
  codigo: string;
  nombre: string;
  categoria_id: number;
  marca_id: number;
  unidad_medida_id: number;
  impuesto_id: number; // si en backend es multiple, cámbialo a number[] o string[]
  proveedor_id: number;
  foto_url: string;
}

interface CreateProductoModalProps {
  editProduct: boolean;
  selectedProduct: ProductoRepository | null;
  setEditProduct: (isOpen: boolean) => void;
  setSelectedProduct: (product: any) => void;
}

const initialFormState = {
  codigo: "",
  nombre: "",
  categoria: "",       // aquí guardamos el ID como string (ej "3")
  costoUnitario: "",
  precioVenta: "",
  cantidadActual: "",
  cantidadMinima: "",
  marca: "",
  unidadMedida: "",
  impuesto: [] as string[],
  proveedor: "",
};

const ActualizarProductoModal = ({
  editProduct,
  setEditProduct,
  setSelectedProduct,
  selectedProduct,
}: CreateProductoModalProps) => {
  const { usuario } = useAuth();

  // Idealmente tengas updateProducto en tu hook
  const {
    categoriasQuery,
    marcasQuery,
    proveedoresQuery,
    unidadesMedidaQuery,
    updateProducto, // <-- crea este en tu hook; si no existe, abajo te digo qué hacer
  } = useInventario();

  const categorias = categoriasQuery?.data || [];
  const marcas = marcasQuery?.data?.marcas || [];
  const proveedores = proveedoresQuery?.data?.proveedores || [];
  const unidadesMedida = unidadesMedidaQuery?.data?.unidades_medida || [];

  const formRef = useRef<HTMLFormElement>(null);
  const { form, onChangeGeneral, setState } = useForm(initialFormState);
  const [progress, setProgress] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  // ---- helpers impuestos (AJUSTA según tu backend) ----
  const impuestoNumberToArray = (impuesto_id?: number) => {
    // ejemplo (cámbialo por tu lógica real)
    if (!impuesto_id) return [];
    if (impuesto_id === 1) return ["IVA"];
    if (impuesto_id === 2) return ["RETENCION"];
    if (impuesto_id === 3) return ["IVA", "RETENCION"];
    return [];
  };

  const impuestoArrayToBackend = (arr: string[]) => {
    // si tu backend espera array, retorna arr.
    // si espera un number, conviértelo aquí (ejemplo):
    if (arr.includes("IVA") && arr.includes("RETENCION")) return 3;
    if (arr.includes("IVA")) return 1;
    if (arr.includes("RETENCION")) return 2;
    return 0;
  };

  // ---- 1) Cargar info del selectedProduct al abrir el modal ----
  useEffect(() => {
    if (!editProduct || !selectedProduct) return;

    setState({
      codigo: selectedProduct.codigo ?? "",
      nombre: selectedProduct.nombre ?? "",
      categoria: String(selectedProduct.categoria_id ?? ""),
      costoUnitario: String(selectedProduct.costo ?? ""),
      precioVenta: String(selectedProduct.precio_venta ?? ""),
      cantidadActual: String(selectedProduct.cantidad ?? ""),
      cantidadMinima: String(selectedProduct.cantidad_minima ?? ""),
      marca: String(selectedProduct.marca_id ?? ""),
      unidadMedida: String(selectedProduct.unidad_medida_id ?? ""),
      proveedor: String(selectedProduct.proveedor_id ?? ""),
      impuesto: impuestoNumberToArray(selectedProduct.impuesto_id),
    });

    // preview de foto existente
    setImagePreview(selectedProduct.foto_url || undefined);
    setImageFile(null);
    setProgress(null);
  }, [editProduct, selectedProduct, setState]);

  const handleClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen");
      return;
    }
    if (file.size > 70000) {
      toast.error("La imagen no pueden superar los 70KB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setState((prev: typeof initialFormState) => {
      const impuestos = prev.impuesto;
      return {
        ...prev,
        impuesto: checked ? [...impuestos, name] : impuestos.filter((imp) => imp !== name),
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedProduct) {
      toast.error("No hay producto seleccionado");
      return;
    }

    // Validar campos obligatorios (no obligues foto)
    const requiredKeys = [
      "codigo",
      "nombre",
      "categoria",
      "costoUnitario",
      "precioVenta",
      "cantidadActual",
      "cantidadMinima",
      "marca",
      "unidadMedida",
      "proveedor",
    ] as const;

    for (const key of requiredKeys) {
      const value = (form as any)[key];
      if (!value) {
        toast.error(`Faltan campos obligatorios: ${key}`);
        return;
      }
    }
    if (!form.impuesto || form.impuesto.length === 0) {
      toast.error("Faltan campos obligatorios: impuesto");
      return;
    }

    const producto = {
      // IDs para actualizar (clave)
      id_producto: selectedProduct.id_producto,
      id_inst: selectedProduct.id_inst,
      id_existencia: selectedProduct.id_existencia, // si tu backend lo usa

      // campos
      codigo: form.codigo,
      nombre: form.nombre,
      categoria_id: Number(form.categoria),
      costo: Number(form.costoUnitario),
      precio_venta: Number(form.precioVenta),
      cantidad: Number(form.cantidadActual),
      cantidad_minima: Number(form.cantidadMinima),
      marca_id: Number(form.marca),
      unidad_medida_id: Number(form.unidadMedida),
      proveedor_id: Number(form.proveedor),

      // Si tu backend espera array, manda form.impuesto.
      // Si espera number, manda impuestoArrayToBackend(form.impuesto).
      impuesto_id: impuestoArrayToBackend(form.impuesto),
    };

    const formData = new FormData();
    formData.append("producto", JSON.stringify(producto));
    formData.append("id_empresa", String(usuario?.id_empresa ?? ""));
    // Si no cambias la foto, NO mandes string vacío; manda nada.
    if (imageFile) formData.append("img_producto", imageFile);

    try {
      await updateProducto(formData, setProgress);
      toast.success("Producto actualizado exitosamente");
      setEditProduct(false);
      setSelectedProduct(null);
    } catch (error: any) {
      toast.error(error.response?.data?.details ?? "Error actualizando producto");
      setProgress(null);
    }
  };


  return (
    <Modal
      title="Actualizar Producto"
      isOpen={editProduct}
      onClose={() => setEditProduct(false)}
      size="md"
      footer={
        <div className={style.modal_footer_actions}>
          <button className="btn btn_secondary" onClick={() => setEditProduct(false)}>
            Cancelar
          </button>
          <button className="btn btn_primary" onClick={handleSubmit} disabled={progress !== null}>
            {progress !== null ? `Actualizando Producto... ${progress}%` : "Actualizar Producto"}
          </button>
        </div>
      }
    >
      <form className={style.create_product_form} ref={formRef} onSubmit={handleSubmit}>
        <div style={{ display: "flex", margin: "10px 0" }}>
          <div style={{ width: "30%", marginRight: "10px" }} onClick={handleClick}>
            <div className={style.upload_container}>
              <input
                type="file"
                name="foto"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              {!imagePreview ? (
                <img src={imagePreview} alt="Preview" className={style.image_preview} />
              ) : (
                <div className={style.upload_content}>
                  <span className={style.upload_icon}>
                    <img src={uploadIcon} />
                  </span>
                  <p>Presione aquí para subir una imagen</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ width: "70%" }}>
            {renderInput("Código", "codigo", "text", "Ej: PROD-001")}
            {renderInput("Nombre", "nombre", "text", "Ej: Producto 1")}
          </div>
        </div>

        {/* 2) Selects usando IDs reales */}
        {renderSelectObj("Categoria", "categoria", categorias.map((c: any) => ({ label: c.nombre, value: String(c.id_categoria ?? c.id) })), form.categoria)}
        {renderInput("Costo unitario", "costoUnitario", "number", "Ej: 5000")}
        {renderInput("Precio de venta", "precioVenta", "number", "Ej: 10000")}
        {renderInput("Cantidad actual", "cantidadActual", "number", "Ej: 50")}
        {renderInput("Cantidad mínima", "cantidadMinima", "number", "Ej: 10")}
        {renderSelectObj("Marca", "marca", marcas.map((m: any) => ({ label: m.nombre_marca, value: String(m.id_marca ?? m.id) })), form.marca)}
        {renderSelectObj("Unidad de medida", "unidadMedida", unidadesMedida.map((u: any) => ({ label: u.nombre_unidad, value: String(u.id_unidad_medida ?? u.id) })))}
        {renderSelectObj("Proveedor", "proveedor", proveedores.map((p: any) => ({ label: p.nombre_proveedor, value: String(p.id_proveedor ?? p.id) })))}

        <div className={style.form_control}>
          <label>Impuestos *</label>
          <div className={style.checkbox_group}>
            <label>
              <input
                type="checkbox"
                name="IVA"
                checked={form.impuesto.includes("IVA")}
                onChange={handleCheckboxChange}
              />
              <span>IVA 19%</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="RETENCION"
                checked={form.impuesto.includes("RETENCION")}
                onChange={handleCheckboxChange}
              />
              <span>Retención en la fuente</span>
            </label>
          </div>
        </div>
      </form>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Modal>
  );

  // 3) Inputs controlados (value)
  function renderInput(label: string, name: keyof typeof initialFormState, type: string, placeholder: string) {
    return (
      <div className={style.form_control}>
        <label>{label} *</label>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={(form as any)[name] ?? ""}
          onChange={(e) => onChangeGeneral(e, name)}
          required
        />
      </div>
    );
  }

  // 4) Select controlado + values correctos
  function renderSelectObj(
  label: string,
  name: keyof typeof initialFormState,
  options: { label: string; value: string }[],
  preloadValue?: string // <- el valor a precargar (si existe)
) {
  const selected = preloadValue ?? (form as any)[name] ?? ""; // lo que tengas
  const selectKey = `${name}-${selected}`; // <- fuerza remount si cambia
  console.log({ preloadValue });
  return (
    <div className={style.form_control}>
      <label>{label} *</label>

      <select
        key={selectKey}
        name={name}
        defaultValue={selected}
        onChange={(e) => onChangeGeneral(e, name)}
        required
      >
        <option value="" disabled>
          Seleccionar {label.toLowerCase()}
        </option>

        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

};

export default ActualizarProductoModal;
