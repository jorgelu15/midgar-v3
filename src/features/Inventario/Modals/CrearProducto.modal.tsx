import { Bounce, toast, ToastContainer } from "react-toastify";
import Modal from "../../../components/modales/Modal";
import { useInventario } from "../../../hooks/useInventario";
import { useForm } from "../../../hooks/useForm";
import style from "../container.module.css";
import { useRef, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

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
    foto: null,
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
        const requiredFields = { ...form, foto: "ok" }; // 'foto' se ignora en la validación
        for (const [key, value] of Object.entries(requiredFields)) {
            if (
                (Array.isArray(value) && value.length === 0) ||
                (!Array.isArray(value) && !value)
            ) {
                toast.error(`Faltan campos obligatorios: ${key}`);
                return;
            }
        }

        const formData = new FormData(formRef.current!);

        const producto = {
            codigo: formData.get("codigo") as string,
            nombre: formData.get("nombre") as string,
            categoria: formData.get("categoria") as string,
            costo: parseFloat(formData.get("costoUnitario") as string),
            precio_venta: parseFloat(formData.get("precioVenta") as string),
            cantidad: parseInt(formData.get("cantidadActual") as string, 10),
            cantidad_minima: parseInt(formData.get("cantidadMinima") as string, 10),
            marca_id: formData.get("marca") as string,
            unidad_medida_id: formData.get("unidadMedida") as string,
            proveedor_id: formData.get("proveedor") as string,
            impuesto_id: form.impuesto, // array
            foto: formData.get("foto") as File | null,
        };

        createProducto(producto, usuario?.id_inst, setProgress).then((response: any) => {
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
                {renderInput("Código", "codigo", "text", "Ej: PROD-001")}
                {renderInput("Nombre", "nombre", "text", "Ej: Producto 1")}
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

                <div className={style.form_control}>
                    <label>Foto</label>
                    <input
                        type="file"
                        name="foto"
                        accept="image/*"
                        onChange={(e) => onChangeGeneral(e, "foto")}
                    />
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
