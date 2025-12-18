import type React from "react";
import Modal from "../../../components/modales/Modal";
import { useInventario } from "../../../hooks/useInventario";
import style from "../container.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { useForm } from "../../../hooks/useForm";
import { Bounce, toast, ToastContainer } from "react-toastify";
import type { ProductoRepository } from "../../../models/Producto.repository";
import { useQueryClient } from "@tanstack/react-query";

interface AjustarStockModalProps {
    isAdjustStockModalOpen: boolean;
    setIsAdjustStockModalOpen: (isOpen: boolean) => void;
    selectedProduct: ProductoRepository | null
}

const AjustarStockModal = ({
    isAdjustStockModalOpen,
    setIsAdjustStockModalOpen,
    selectedProduct
}: AjustarStockModalProps) => {
    const { usuario } = useAuth();
    const { createMovimientoInventarioFisico } = useInventario();
    const queryClient = useQueryClient();

    const { form, onChangeGeneral, setForm } = useForm({
        movimiento: "",
        motivo: -1,
        cantidad: 0,
        saldo: 0,
        costo: 0,
    });


    const handleCreateMovimientoInventarioFisico = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            form.movimiento === "" ||
            form.motivo < 0 ||
            isNaN(form.cantidad) || form.cantidad === 0 ||
            isNaN(form.saldo) || form.saldo === 0 ||
            isNaN(form.costo) || form.costo === 0
        ) {
            toast.error("Por favor complete todos los campos obligatorios.");
            return;
        }


        const movimiento: any = {
            id_producto: Number(selectedProduct?.id_producto),
            tipo_movimiento: form.movimiento,
            motivo: form.motivo,
            cantidad: form.cantidad,
            saldo: form.saldo,
            costo: form.costo,
            id_usuario: usuario?.id_usuario,
            id_inst: usuario?.id_inst,
            updatedAt: new Date(),
            createdAt: new Date(),
        };


        createMovimientoInventarioFisico(movimiento, usuario?.id_inst)
            .then((data: any) => {
                console.log(data)
                toast.success("Movimiento registrado con éxito");
                if (selectedProduct) {
                    queryClient.invalidateQueries({ queryKey: ['movimientos_inventario', selectedProduct.id_producto] });
                }
                setIsAdjustStockModalOpen(false);
                setForm({
                    movimiento: "",
                    motivo: -1,
                    cantidad: 0,
                    saldo: 0,
                    costo: 0,
                });
            })
            .catch((error: any) => {
                toast.error(error.message);
            });
    };

    return (
        <Modal
            title="Ajustar Stock"
            isOpen={isAdjustStockModalOpen}
            onClose={() => setIsAdjustStockModalOpen(false)}
            size="md"
            footer={
                <div className={style.modal_footer_actions}>
                    <button
                        className="btn btn_secondary"
                        onClick={() => setIsAdjustStockModalOpen(false)}
                    >
                        Cancelar
                    </button>
                    <button className="btn btn_primary" onClick={handleCreateMovimientoInventarioFisico}>
                        Confirmar ajuste
                    </button>
                </div>
            }
        >
            <form className={style.adjust_stock_form}>
                <div className={style.form_control}>
                    <label>Cantidad a ajustar *</label>
                    <input
                        type="number"
                        value={form.cantidad}
                        onChange={(e) => onChangeGeneral(e, "cantidad")}
                        placeholder="Ingrese la cantidad a ajustar"
                        required
                    />
                </div>

                <div className={style.form_control}>
                    <label>Tipo de movimiento *</label>
                    <select
                        value={form.movimiento}
                        onChange={(e) =>
                            onChangeGeneral({ target: { value: e.target.value } }, "movimiento")
                        }
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="ENTRADA">Entrada</option>
                        <option value="SALIDA">Salida</option>
                    </select>
                </div>

                <div className={style.form_control}>
                    <label>Motivo del ajuste *</label>
                    <select
                        value={form.motivo}
                        onChange={(e) =>
                            onChangeGeneral({ target: { value: Number(e.target.value) } }, "motivo")
                        }
                        required
                    >
                        <option value="-1">Seleccionar motivo</option>
                        <option value="0">Conteo físico</option>
                        <option value="1">Producto dañado</option>
                        <option value="2">Error de sistema</option>
                    </select>
                </div>

                <div className={style.form_control}>
                    <label>Saldo actual *</label>
                    <input
                        type="number"
                        value={form.saldo}
                        onChange={(e) => onChangeGeneral(e, "saldo")}
                        required
                    />
                </div>

                <div className={style.form_control}>
                    <label>Costo por unidad *</label>
                    <input
                        type="number"
                        value={form.costo}
                        onChange={(e) => onChangeGeneral(e, "costo")}
                        required
                    />
                </div>

                <div className={style.form_control}>
                    <label>Usuario</label>
                    <input type="text" value={usuario?.nombre} disabled />
                </div>

                <div className={style.form_control}>
                    <label>Fecha</label>
                    <input type="text" value={new Date().toLocaleString("es-CO")} disabled />
                </div>
            </form>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </Modal>
    );
};

export default AjustarStockModal;
