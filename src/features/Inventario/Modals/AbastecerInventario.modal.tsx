import React, { useState } from "react";
import Modal from "../../../components/modales/Modal";
import style from "../container.module.css";
import { useForm } from "../../../hooks/useForm";
import SelectSearch from "../../../components/selects/SelectSearch";
import TableCompras from "../../../components/tables/TableCompras";
import { useInventario } from "../../../hooks/useInventario";
import { useUserInfo } from "../../../hooks/useUserInfo";
interface AbastecerInventarioModalProps {
    isAbastecerInventarioModalOpen: boolean;
    setIsAbastecerInventarioModalOpen: (isOpen: boolean) => void;
}

const AbastecerInventarioModal = ({
    isAbastecerInventarioModalOpen,
    setIsAbastecerInventarioModalOpen
}: AbastecerInventarioModalProps) => {
    const [progress, setProgress] = useState<number | null>(null);
    const [selected, setSelected] = useState<{ label: string; value: string } | null>(null);

    const { form, onChangeGeneral } = useForm({
        nfactura: "",
        fechaVencimiento: "",
        proveedor: "",
        identificacion: "",
        telefono: "",
        moneda: "COP",
        bodega: "",
    });

    const [productos, setProductos] = useState<any[]>([]);

    const { updateProducto } = useInventario();
    const { usuarioQuery } = useUserInfo();


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // setProgress(0)
        productos.map((producto) => {
            const productoUpdate = {
                cantidad: producto.cantidad,
            };
            updateProducto(producto.id, productoUpdate, usuarioQuery.data?.cliente.id_cliente, setProgress);
        })
    }

    const opciones = [
        { label: "Marca 1", value: "1" },
        { label: "Marca 2", value: "2" },
        { label: "Marca 3", value: "3" },
    ];
    return (
        <Modal
            title="Abastecer inventario"
            isOpen={isAbastecerInventarioModalOpen}
            onClose={() => setIsAbastecerInventarioModalOpen(false)}
            size="lg"
            footer={
                <div className={style.modal_footer_actions}>
                    <button
                        className="btn btn_secondary"
                        onClick={() => setIsAbastecerInventarioModalOpen(false)}
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
                            : "Abastecer"}
                    </button>
                </div>
            }
        >
            <form className={style.adjust_stock_form}>
                <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
                    <div className={style.form_control}>
                        <label>Factura de compra N° *</label>
                        <input
                            type="number"
                            value={form.nfactura}
                            onChange={(e) => onChangeGeneral(e, "nfactura")}
                            placeholder="Seleccionar"
                            required
                        />
                    </div>
                    <div className={style.form_control}>
                        <label>Fecha</label>
                        <input type="text" value={new Date().toLocaleString("es-CO")} disabled />
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
                    <div className={style.form_control}>
                        <label>Proveedor *</label>
                        <SelectSearch
                            options={opciones}
                            value={selected}
                            onSelect={(opt: any) => setSelected(opt)}
                        />
                    </div>
                    <div className={style.form_control}>
                        <label>Identificación *</label>
                        <input
                            type="text"
                            value={ form.identificacion}
                            onChange={(e) => onChangeGeneral(e, "identificacion")}
                            placeholder="Ingrese identificación del proveedor"
                            required
                        />
                    </div>
                    <div className={style.form_control}>
                        <label>Teléfono *</label>
                        <input
                            type="text"
                            value={form.telefono}
                            onChange={(e) => onChangeGeneral(e, "telefono")}
                            placeholder="Ingrese el teléfono del proveedor"
                            required
                        />
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
                    <div className={style.form_control}>
                        <label>Moneda *</label>
                        <input
                            type="text"
                            value={"COP"}
                            placeholder="Ingrese la moneda local"
                            required
                            disabled
                        />
                    </div>
                    <div className={style.form_control}>
                        <label>Fecha vencimiento *</label>
                        <input
                            type="date"
                            value={form.fechaVencimiento}
                            onChange={(e) => onChangeGeneral(e, "fechaVencimiento")}
                            placeholder="Ingrese la cantidad a ajustar"
                            required
                        />
                    </div>
                    <div className={style.form_control}>
                        <label>Bodega *</label>
                        <SelectSearch
                            options={opciones}
                            value={selected}
                            onSelect={(opt: any) => setSelected(opt)}
                        />
                    </div>
                </div>

                <div className={style.form_control} style={{maxWidth: "100%"}}>
                    <label>Productos comprados *</label>
                    <TableCompras productos={productos} setProductos={setProductos}/>
                </div>
            </form>
        </Modal>
    );
}

export default AbastecerInventarioModal;