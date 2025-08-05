import { Bounce, toast, ToastContainer } from "react-toastify";
import Modal from "../../../components/modales/Modal";
import { useInventario } from "../../../hooks/useInventario";
import { useForm } from "../../../hooks/useForm";
import style from "../container.module.css";
import { useRef, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import uploadIcon from "../../../assets/upload.svg";

interface CreateProductoModalProps {
    isCreateProductModalOpen: boolean;
    setIsCreateProductModalOpen: (isOpen: boolean) => void;
}

const initialFormState = {
    codigo: "",
    nombre: "",
    categoria: "",
    costoUnitario: "",
    precioVenta: "",
    cantidadActual: "",
    cantidadMinima: "",
    marca: "",
    unidadMedida: "",
    impuesto: [] as string[],
    proveedor: "",
};

const CreateProductoModal = ({
    isCreateProductModalOpen,
    setIsCreateProductModalOpen,
}: CreateProductoModalProps) => {
    const { usuario } = useAuth()
    const { createProducto } = useInventario();
    const formRef = useRef<HTMLFormElement>(null);
    const { form, onChangeGeneral, setState } = useForm(initialFormState);
    const [progress, setProgress] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>();
    const [imagePreview, setImagePreview] = useState<string | undefined>();
    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("El archivo debe ser una imagen");
            return;
        }

        if (file.size > 50000) {
            toast.error("La imagen no pueden superar los 50KB");
            return;
        }

        setImageFile(file);

        setImagePreview(URL.createObjectURL(file));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setState((prevForm: typeof initialFormState) => {
            const impuestos = prevForm.impuesto;
            return {
                ...prevForm,
                impuesto: checked
                    ? [...impuestos, name]
                    : impuestos.filter((imp) => imp !== name),
            };
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validar campos obligatorios (excepto foto)
        const requiredFields = { ...form }; // 'foto' se ignora en la validación
        for (const [key, value] of Object.entries(requiredFields)) {
            if (
                (Array.isArray(value) && value.length === 0) ||
                (!Array.isArray(value) && !value)
            ) {
                toast.error(`Faltan campos obligatorios: ${key}`);
                return;
            }
        }

        // if (!imageFile) {
        //     toast.error("Debes seleccionar una imagen del producto.");
        //     return;
        // }

        // Crear objeto producto
        const producto = {
            codigo: form.codigo,
            nombre: form.nombre,
            categoria: form.categoria,
            costo: parseFloat(form.costoUnitario),
            precio_venta: parseFloat(form.precioVenta),
            cantidad: parseInt(form.cantidadActual, 10),
            cantidad_minima: parseInt(form.cantidadMinima, 10),
            marca_id: form.marca,
            unidad_medida_id: form.unidadMedida,
            proveedor_id: form.proveedor,
            impuesto_id: form.impuesto, // array
        };

        const formData = new FormData();
        formData.append("producto", JSON.stringify(producto));  // producto serializado
        formData.append("id_inst", usuario?.id_inst);           // id_inst
        formData.append("img_producto", imageFile ? imageFile : "");             // archivo

        createProducto(formData, setProgress).then((response: any) => {
            toast.success(response.data.message);
            setIsCreateProductModalOpen(false);
        }).catch((error: any) => {
            toast.error(error.error);
            setProgress(null);
        });

    };

    return (
        <Modal
            title="Crear Producto"
            isOpen={isCreateProductModalOpen}
            onClose={() => setIsCreateProductModalOpen(false)}
            size="md"
            footer={
                <div className={style.modal_footer_actions}>
                    <button
                        className="btn btn_secondary"
                        onClick={() => setIsCreateProductModalOpen(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn btn_primary"
                        onClick={handleSubmit}
                        disabled={progress !== null}
                    >
                        {progress !== null
                            ? `Creando Producto... ${progress}%`
                            : "Crear Producto"}
                    </button>
                </div>
            }
        >
            <form className={style.create_product_form} ref={formRef}>
                <div style={{ display: "flex", margin: "10px 0" }}>
                    <div style={{ width: "30%", marginRight: "10px" }} onClick={handleClick}>
                        <div className={style.upload_container}>
                            <input
                                type="file"
                                name="foto"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={(e) => handleImageChange(e)}
                            />

                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className={style.image_preview} />
                            ) : (
                                <div className={style.upload_content}>
                                    <span className={style.upload_icon}><img src={uploadIcon}/></span>
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

                {renderSelect("Categoría", "categoria", ["Categoría 1", "Categoría 2", "Categoría 3"])}
                {renderInput("Costo unitario", "costoUnitario", "number", "Ej: 5000")}
                {renderInput("Precio de venta", "precioVenta", "number", "Ej: 10000")}
                {renderInput("Cantidad actual", "cantidadActual", "number", "Ej: 50")}
                {renderInput("Cantidad mínima", "cantidadMinima", "number", "Ej: 10")}
                {renderSelect("Marca", "marca", ["Marca 1", "Marca 2", "Marca 3"])}
                {renderSelect("Unidad de medida", "unidadMedida", ["Unidad 1", "Unidad 2", "Unidad 3"])}
                {renderSelect("Proveedor", "proveedor", ["Proveedor 1", "Proveedor 2", "Proveedor 3"])}

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

    function renderInput(label: string, name: string, type: string, placeholder: string) {
        return (
            <div className={style.form_control}>
                <label>{label} *</label>
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={(e) => onChangeGeneral(e, name)}
                    required
                />
            </div>
        );
    }

    function renderSelect(label: string, name: string, options: string[]) {
        return (
            <div className={style.form_control}>
                <label>{label} *</label>
                <select
                    name={name}
                    onChange={(e) => onChangeGeneral(e, name)}
                    defaultValue=""
                    required
                >
                    <option value="" disabled>
                        Seleccionar {label.toLowerCase()}
                    </option>
                    {options.map((opt, idx) => (
                        <option key={idx} value={idx + 1}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
};

export default CreateProductoModal;
