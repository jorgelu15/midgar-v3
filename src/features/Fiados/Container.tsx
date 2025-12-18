import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import stringSimilarity from "string-similarity";
import { routes } from "../../utils/routes";
import style from "./container.module.css";
import borrar from "../../assets/borrar.svg";
import volver from "../../assets/volver.svg";
import add_card from "../../assets/add_card.svg";
import { useMemo, useState } from "react";
import { useForm } from "../../hooks/useForm";
import Table from "../../components/tables/Table";
import Modal from "../../components/modales/Modal";
import { useShortcuts } from "../../hooks/useShortcodes";
import { useNavigate } from "react-router-dom";
import { useGestionDeCreditos } from "../../hooks/useGestionDeCreditos";
import type { CuentaCreditoDTO } from "../../models/dtos/cuenta-credito.dto";
import SkeletonTable from "../../components/skeleton/SkeletonTable";
import { Bounce, toast, ToastContainer } from "react-toastify";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "InventarioFisico", href: routes.InventarioFisico },
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
];

const Container = () => {
    
    const { cuentaCreditoQuery, createCreditoMutation } = useGestionDeCreditos();



    const cuentasCredito: CuentaCreditoDTO[] = cuentaCreditoQuery.data || [];

    const navigate = useNavigate();
    const { form, onChangeGeneral, setState } = useForm({
        query: "",
        cupo_maximo: "",
        deuda_actual: "",
        dia_corte: "15",
        cuotas_predeterminadas: "3",
        tasa_interes_mensual: "2",
        cobra_intereses: false,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<CuentaCreditoDTO | null>(null);
    const [showCupoModal, setShowCupoModal] = useState(false);

    const onOpenAsignarCupo = (cliente: CuentaCreditoDTO) => {
        setSelectedClient(cliente);
        setState((prev: any) => ({
            ...prev,
            cedula: cliente?.clientes?.cedula || "",
            nombre: cliente?.clientes?.nombre || ""
        }));
        setShowCupoModal(true);
    };

    // Construir los atajos a partir de menuItems
    const shortcuts = menuItems.reduce((map, item) => {
        map[item.shortcode] = () => navigate(item.destiny);
        return map;
    }, {} as Record<string, () => void>);

    useShortcuts(shortcuts);

    const headers = [
        "Cliente",
        "Cédula",
        "Cupo",
        "Deuda",
        "Estado",
        "Acciones",
    ];

    const filteredRows = useMemo(() => {
        const query = form?.query.toLowerCase();
        if (!query) return cuentasCredito;

        return cuentasCredito.filter((row: CuentaCreditoDTO) => {
            return Object.values(row).some(value => {
                const text = String(value).toLowerCase();

                if (text.includes(query)) return true;

                const similarity = stringSimilarity.compareTwoStrings(text, query);
                return similarity > 0.8;
            });
        });
    }, [form.query, cuentasCredito]);

    const onAsignarCupo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(selectedClient);
        if(selectedClient === null || selectedClient?.clientes?.id_cliente === null) {
            toast.error("Debe seleleccionar un cliente para realizar esta acción");
            return;
        }
        createCreditoMutation.mutate({
            id_cliente: selectedClient?.clientes?.id_cliente,
            id_inst: selectedClient?.clientes?.id_empresa,
            cupo_maximo: form.cupo_maximo,
            deuda_actual: form.deuda_actual,
            dia_corte: form.dia_corte,
            cuotas_predeterminadas: form.cuotas_predeterminadas,
            tasa_interes_mensual: form.tasa_interes_mensual,
            cobra_intereses: form.cobra_intereses,
        }, {
            onSuccess: () => {
                setShowCupoModal(false);
            }
        });

    };

    return (
        <div className="container">
            <Breadcrumb items={items} />
            <div className={style.msg__welcome}>
                <h1>Créditos</h1>
            </div>
            <div className={style.container__badget}>
                <div className={style.badget}>
                    <b>Créditos totales:</b>
                    <p>
                        {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                        }).format(80000)}
                    </p>
                </div>
                <div className={style.badget}>
                    <b>Tarjetas activas:</b>
                    <p>
                        {new Intl.NumberFormat("es-CO", {
                            style: "decimal",
                            notation: "compact",
                        }).format(60)}
                    </p>
                </div>
                <div className={style.badget}>
                    <b>Tarjetas en uso:</b>
                    <p>
                        {new Intl.NumberFormat("es-CO", {
                            style: "decimal",
                            notation: "compact",
                        }).format(40)}
                    </p>
                </div>
            </div>

            <div className={style.content}>
                <div className={style.header__container}>
                    <div className={style.form_control}>
                        <input
                            type="search"
                            placeholder="Buscar un cliente"
                            value={form.query}
                            onChange={(e) => onChangeGeneral(e, "query")}
                        />
                    </div>
                </div>

                <div className={style.table_container}>
                    {
                        cuentaCreditoQuery.isLoading ? (
                            <SkeletonTable cols={9} rows={5} />
                        ) :
                            <Table
                                headers={headers}
                                data={filteredRows}
                                defaultRowsPerPage={5}
                                rowsPerPageOptions={[5, 10, 20]}
                                renderRow={(row: CuentaCreditoDTO) => {
                                    const rowValues = [
                                        row.clientes?.nombre,
                                        row.clientes?.cedula,
                                        new Intl.NumberFormat("es-CO", {
                                            style: "currency",
                                            currency: "COP",
                                        }).format(row?.cupo_maximo || 0),
                                        new Intl.NumberFormat("es-CO", {
                                            style: "currency",
                                            currency: "COP",
                                        }).format((row?.cupo_maximo || 0) - (row?.cupo_disponible || 0) ),
                                        row.clientes?.estado ? "Inactivo" : "Activo",
                                    ];
                                    return (
                                        <>
                                            {rowValues.map((cell, i) => (
                                                <td key={i}>{cell}</td>
                                            ))}
                                            <td>
                                                <img src={add_card} onClick={() => onOpenAsignarCupo(row)} />
                                                <img src={borrar} />
                                            </td>
                                        </>
                                    );
                                }}
                            />
                    }
                </div>
            </div>

            {/* Modal Estado de Cuenta */}
            {isModalOpen && (
                <Modal
                    title={`Estado de Cuenta - ${selectedClient}`}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    size="md"
                    footer={
                        <div className={style.modal_footer_actions}>
                            <button className="btn">📄 Generar Extracto</button>
                            <button className="btn">🖨️ Imprimir</button>
                        </div>
                    }
                >
                    <div className={style.card_estado_cuenta}>
                        <div className={style.card_main_info}>
                            <div>
                                <span>Cupo Total</span>
                                <strong>$200.000</strong>
                            </div>
                            <div>
                                <span>Cupo Disponible</span>
                                <strong>$60.000</strong>
                            </div>
                            <div>
                                <span>Deuda Actual</span>
                                <strong>$140.000</strong>
                            </div>
                        </div>

                        <div className={style.card_details}>
                            <div><b>Fecha de Corte:</b> 15 de cada mes</div>
                            <div><b>Pago Mínimo:</b> $30.000</div>
                            <div><b>Último Pago:</b> $50.000</div>
                            <div><b>Estado:</b> Vigente</div>
                        </div>
                    </div>
                </Modal>

            )}
            {/* Modal Asignar Cupo */}
            {showCupoModal && selectedClient && (
                <Modal
                    title={`Asignar tarjeta a: ${selectedClient?.clientes?.nombre}`}
                    isOpen={showCupoModal}
                    onClose={() => setShowCupoModal(false)}
                    size="md"
                    footer={
                        <div className={style.modal_footer_actions}>
                            <button className="btn" onClick={() => setShowCupoModal(false)}>Cancelar</button>
                            <button className="btn btn_primary" onClick={onAsignarCupo}>Asignar cupo</button>
                        </div>
                    }
                >
                    <div className={style.form_cliente}>
                        <div className={style.form_control}>
                            <p><b>Número de tarjeta:</b> {selectedClient?.clientes?.cedula}</p>
                        </div>

                        <div className={style.form_control}>
                            <label>Cupo total a asignar</label>
                            <input type="text" placeholder="$200.000" value={form.cupo_maximo} onChange={(e) => onChangeGeneral(e, "cupo_maximo")} />
                        </div>
                        <div className={style.form_control}>
                            <label>Deuda actual:</label>
                            <input type="text" placeholder="$60.000" value={form.deuda_actual} onChange={(e) => onChangeGeneral(e, "deuda_actual")} />
                        </div>

                        <div className={style.form_control}>
                            <label>Fecha de corte</label>
                            <select value={form.dia_corte} onChange={(e) => onChangeGeneral(e, "dia_corte")}>
                                {[...Array(28)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div className={style.form_control}>
                            <label>Cuotas predeterminadas</label>
                            <select value={form.cuotas_predeterminadas} onChange={(e) => onChangeGeneral(e, "cuotas_predeterminadas")}>
                                <option value="1">1 cuota</option>
                                <option value="2">2 cuotas</option>
                                <option value="3">3 cuotas</option>
                                <option value="6">6 cuotas</option>
                            </select>
                        </div>

                        <div className={style.form_control}>
                            <label>Aplica interés mensual</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <input
                                    type="checkbox"
                                    checked={form.cobra_intereses}
                                    onChange={(e) => onChangeGeneral(e, "cobra_intereses")}
                                />
                                <span>Sí</span>
                                <input
                                    type="text"
                                    style={{ width: "80px" }}
                                    value={form.tasa_interes_mensual}
                                    onChange={(e) => onChangeGeneral(e, "tasa_interes_mensual")}
                                />
                                <span>%</span>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick={false}
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    );
};

export default Container;
