import { useMemo, useState } from "react";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import Table from "../../components/tables/Table";
import { useForm } from "../../hooks/useForm";
import { routes } from "../../utils/routes";
import style from "./container.module.css"
import OffcanvasCliente from "../../components/offcanvas/OffcanvasCliente";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Clientes", href: routes.clientes },
];

const Container = () => {
    const { form, onChangeGeneral } = useForm({
        query: "",
    });

    const [showPanel, setShowPanel] = useState(false);

    const header_items = [
        "Cédula",
        "Nombre",
        "Teléfono",
        "Deuda Actual",
        "Cupo disponible",
        "Última compra",
        "Estado de crédito",
        "Acciones",
    ];

    const originalRows = [
        ["1012345678", "Pedro Gómez", "3001234567", "$80.000", "$120.000", "13/07/2025", "Activo", "Acciones"],
        ["1023456789", "Ana María Torres", "3014567890", "$0", "$150.000", "10/07/2025", "Activo", "Acciones"],
        ["1034567890", "Carlos Ruiz", "3129876543", "$180.000", "$200.000", "01/07/2025", "En mora", "Acciones"],
        ["1045678901", "Laura Romero", "3112233445", "$40.000", "$60.000", "11/07/2025", "Bloqueado", "Acciones"],
        ["1056789012", "Andrés Mejía", "3009988776", "$20.000", "$80.000", "12/07/2025", "Activo", "Acciones"],
        ["1067890123", "Camila García", "3136677889", "$0", "$100.000", "09/07/2025", "Activo", "Acciones"],
        ["1078901234", "Jorge Castillo", "3013344556", "$350.000", "$400.000", "28/06/2025", "En mora", "Acciones"],
        ["1089012345", "Tatiana López", "3022233441", "$15.000", "$35.000", "13/07/2025", "Activo", "Acciones"],
        ["1090123456", "Luis Herrera", "3147788990", "$0", "$50.000", "13/07/2025", "Activo", "Acciones"],
        ["1101234567", "Sofía Martínez", "3005566778", "$220.000", "$250.000", "02/07/2025", "Bloqueado", "Acciones"],
    ];


    const filteredRows = useMemo(() => {
        const query = form.query.toLowerCase();
        if (!query) return originalRows;
        return originalRows.filter((row) =>
            row.some((cell) => cell.toLowerCase().includes(query))
        );
    }, [form.query]);

    return (
        <div className="container">
            <Breadcrumb items={items} />
            <div className={style.msg__welcome}>
                <h1>Clientes</h1>
            </div>
            <div className={style.content}>
                <div className={style.header__container}>
                    <button className="btn btn_primary">Crear cliente</button>
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
                        header_items={header_items}
                        row_items={filteredRows}
                        rowsPerPageOptions={[5, 10, 20]}
                        defaultRowsPerPage={5}
                        actions={() => {
                            setShowPanel(true)
                        }}
                    />
                    <OffcanvasCliente isOpen={showPanel} onClose={() => setShowPanel(false)} />
                    <div className={style.shortcut_guide}>
                        <h3>Atajos de teclado</h3>
                        <ul>
                            <li><strong>V:</strong> Ir a la sección de Vender</li>
                            <li><strong>C:</strong> Ir a la sección de Clientes</li>
                            <li><strong>I:</strong> Ir a Inventario</li>
                            <li><strong>F:</strong> Ir a Fiados</li>
                            <li><strong>E:</strong> Ir a Estadísticas</li>
                            <li><strong>A:</strong> Ir a Ajustes</li>
                            <li><strong>Ctrl + N:</strong> Crear nuevo usuario</li>
                            <li><strong>Esc:</strong> Volver atrás</li>
                            <li><strong>B:</strong> Enfocar campo de búsqueda</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Container;