import Modal from "../../../components/modales/Modal";
import SkeletonTable from "../../../components/skeleton/SkeletonTable";
import Table from "../../../components/tables/Table";
import { useInventario } from "../../../hooks/useInventario";
import type { MovimientoInventarioRepository } from "../../../models/MovimientoInventario.repository";
import type { ProductoRepository } from "../../../models/Producto.repository";
import style from "../container.module.css"

interface KardexModalProps {
    isKardexModalOpen: boolean;
    setIsKardexModalOpen: (isOpen: boolean) => void;
    selectedProduct: ProductoRepository;
    openAdjustStockModal: () => void;
}

const KardexModal = ({
    isKardexModalOpen,
    setIsKardexModalOpen,
    selectedProduct,
    openAdjustStockModal
}: KardexModalProps) => {
    const { movimientosInventarioQuery } = useInventario(String(selectedProduct?.id_producto));
    const movimientos: MovimientoInventarioRepository[] = movimientosInventarioQuery?.data?.movimientos || [];


    return (
        <Modal
            title={`Kardex - ${selectedProduct.nombre}`}
            isOpen={isKardexModalOpen}
            onClose={() => setIsKardexModalOpen(false)}
            size="lg"
            footer={
                <div className={style.modal_footer_actions}>
                    <button className="btn">Exportar Excel</button>
                    <button className="btn">Imprimir</button>
                    <button className="btn" onClick={openAdjustStockModal}>
                        Ajustar stock
                    </button>
                </div>
            }
        >
            <div className={style.kardex__sumary}>
                <p><b>Stock actual:</b> {selectedProduct.cantidad} unidades</p>
                <p><b>Última entrada: </b>
                    {
                        (() => {
                            const entrada = movimientos?.find((mov: MovimientoInventarioRepository) => mov.tipo_movimiento === "ENTRADA");
                            return entrada && entrada.createdAt
                                ? `${new Date(entrada.createdAt).toLocaleDateString()} (+${entrada.cantidad})`
                                : "N/A";
                        })()
                    }
                </p>
                <p><b>Última salida: </b>
                    {
                        (() => {
                            const salida = movimientos?.find((mov: MovimientoInventarioRepository) => mov.tipo_movimiento === "SALIDA");
                            return salida && salida.createdAt
                                ? `${new Date(salida.createdAt).toLocaleDateString()} (-${salida.cantidad})`
                                : "N/A";
                        })()
                    }
                </p>
            </div>

            <div className={style.control__kardex}>
                <div>
                    <span>Ver:</span>
                    <select>
                        <option>Últimos 7 días</option>
                        <option>Últimos 30 días</option>
                        <option>Todos los movimientos</option>
                    </select>
                </div>
                <div>
                    <span>Ordenar por:</span>
                    <select>
                        <option>Más reciente</option>
                        <option>Entradas primero</option>
                        <option>Salidas primero</option>
                    </select>
                </div>
            </div>
            {
                movimientosInventarioQuery.isLoading ? (
                    <SkeletonTable cols={5} rows={5} />
                ) : (
                    <Table
                        headers={["Movimiento", "Motivo", "Cantidad", "Costo", "Usuario"]}
                        data={movimientos}
                        defaultRowsPerPage={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        renderRow={(row) => {
                            const rowValues = [
                                row.tipo_movimiento,
                                row.motivo,
                                row.cantidad,
                                row.costo_unitario,
                                row.usuario,
                            ];
                            return (
                                <>
                                    {rowValues.map((cell, i) => (
                                        <td key={i}>{cell}</td>
                                    ))}
                                </>
                            );
                        }}
                    />
                )
            }

        </Modal>
    );
}

export default KardexModal;