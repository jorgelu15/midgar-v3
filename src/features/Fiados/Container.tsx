import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { routes } from "../../utils/routes";
import style from "./container.module.css";
import borrar from "../../assets/borrar.svg";
import volver from "../../assets/volver.svg";
import status from "../../assets/status.svg";
import { useMemo, useState } from "react";
import { useForm } from "../../hooks/useForm";
import Table from "../../components/tables/Table";
import Modal from "../../components/modales/Modal";
import { useShortcuts } from "../../hooks/useShortcodes";
import { useNavigate } from "react-router-dom";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "InventarioFisico", href: routes.InventarioFisico },
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
];

const Container = () => {
    const navigate = useNavigate();
    const { form, onChangeGeneral } = useForm({ query: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
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

    const originalRows = [
        ["Pedro Gómez", "1012345678", "$200.000", "$60.000", "Activo"],
        ["Ana María Torres", "1023456789", "$150.000", "$0", "Activo"],
        ["Carlos Ruiz", "1034567890", "$180.000", "$180.000", "En mora"],
        ["Laura Romero", "1045678901", "$100.000", "$40.000", "Bloqueado"],
        ["Andrés Mejía", "1056789012", "$120.000", "$20.000", "Activo"],
        ["Camila García", "1067890123", "$100.000", "$0", "Activo"],
        ["Jorge Castillo", "1078901234", "$400.000", "$350.000", "En mora"],
        ["Tatiana López", "1089012345", "$35.000", "$15.000", "Activo"],
        ["Luis Herrera", "1090123456", "$50.000", "$0", "Activo"],
        ["Sofía Martínez", "1101234567", "$250.000", "$220.000", "Bloqueado"],
    ];

    const filteredRows = useMemo(() => {
        const query = form.query.toLowerCase();
        if (!query) return originalRows;
        return originalRows.filter((row) =>
            row.some((cell) => String(cell).toLowerCase().includes(query))
        );
    }, [form.query]);

    const openModal = (clientName: string) => {
        setSelectedClient(clientName);
        setIsModalOpen(true);
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
                    <Table
                        headers={headers}
                        data={filteredRows}
                        defaultRowsPerPage={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        renderRow={(row) => (
                            <>
                                {row.map((cell, i) => (
                                    <td key={i}>{cell}</td>
                                ))}
                                <td>
                                    <img
                                        src={status}
                                        onClick={() => openModal(row[0])}
                                        style={{ cursor: "pointer" }}
                                        alt="Estado de cuenta"
                                    />
                                    <img src={borrar} />
                                </td>
                            </>
                        )}
                    />
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
        </div>
    );
};

export default Container;
