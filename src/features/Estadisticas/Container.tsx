import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import CardStat from "../../components/cards/CardStat";
import { useShortcuts } from "../../hooks/useShortcodes";
import { routes } from "../../utils/routes";
import style from "./container.module.css"
import volver from "../../assets/volver.svg";
import LineChartCustom from "../../components/Charts/LineChartCustom";
import LineChartCustomMultiple from "../../components/Charts/LineChartCustomMultiple";
import VentasPorPeriodo from "./VentasPeriodo/VentasPorPeriodo";
import ProductosMasVendidos from "./ProductosMasVendidos/ProductosMasVendidos";
import VentasPorMetodoPago from "./VentasPorMetodoPago/VentasPorMetodoPago";
import { IngresosCostosPerdidas } from "./IngresosCostosPerdidas/IngresosCostosPerdidas";
import { GananciaNetaMensual } from "./GanaciaNetaMensual/GananciaNetaMensual";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Estadísticas", href: routes.estadisticas },
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
];

const Container = () => {
    const navigate = useNavigate();
    // Atajos
    const shortcuts = menuItems.reduce((map, item) => {
        map[item.shortcode] = () => navigate(item.destiny);
        return map;
    }, {} as Record<string, () => void>);
    useShortcuts(shortcuts);

    const data = [
        { hora: "08:00 AM", venta: 45000 },
        { hora: "09:00 AM", venta: 90000 },
        { hora: "10:00 AM", venta: 130000 },
        { hora: "11:00 AM", venta: 180000 },
        { hora: "12:00 PM", venta: 250000 },
        { hora: "01:00 PM", venta: 320000 },
        { hora: "02:00 PM", venta: 400000 },
        { hora: "03:00 PM", venta: 450000 },
    ];

    const dataPrevNext = [
        { dia: "01", actual: 100000, anterior: 80000 },
        { dia: "02", actual: 120000, anterior: 110000 },
        { dia: "03", actual: 90000, anterior: 95000 },
        { dia: "04", actual: 140000, anterior: 100000 },
        { dia: "05", actual: 130000, anterior: 120000 },
        { dia: "06", actual: 150000, anterior: 130000 },
        { dia: "07", actual: 170000, anterior: 160000 },
    ];
    return (
        <div className="container">
            <Breadcrumb items={items} />
            <div className={style.msg__welcome}>
                <h1>Estadísticas</h1>
            </div>
            <div className={style.container__cardstats}>
                <CardStat title="Balance del día" size="1/4">
                    <p style={{ fontSize: 32 }}><b>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(25000000)}</b></p>
                </CardStat>
                <CardStat title="Venta promedio" size="1/4">
                    <p style={{ fontSize: 32 }}><b>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(25000)}</b></p>
                </CardStat>
                <CardStat title="Número de ventas" size="1/4">
                    <p style={{ fontSize: 32 }}>
                        <b>{new Intl.NumberFormat("es-CO", { style: "decimal" }).format(302)}</b>
                    </p>
                </CardStat>
                <CardStat title="Número de domicilios" size="1/4">
                    <p style={{ fontSize: 32 }}>
                        <b>{new Intl.NumberFormat("es-CO", { style: "decimal" }).format(40)}</b>
                    </p>
                </CardStat>
                <CardStat title="Ventas del día" size="1/2">
                    <LineChartCustom
                        data={data}
                        dataKey="venta"
                        labelKey="hora"
                    />
                </CardStat>
                <CardStat title="Comparativa con el mes anterior" size="1/2">
                    <LineChartCustomMultiple
                        data={dataPrevNext}
                        labelKey="dia"
                        lines={[
                            { dataKey: "actual", stroke: "var(--primary)", label: "Mes Actual" },
                            { dataKey: "anterior", stroke: "var(--info)", label: "Mes Anterior" },
                        ]}
                    />
                </CardStat>
                <CardStat title="Total de ventas" size="1/2">
                    <VentasPorPeriodo />
                </CardStat>
                <CardStat title="Ventas por método de pago" size="1/2">
                    <VentasPorMetodoPago
                        data={[
                            { nombre: "Efectivo", monto: 120000 },
                            { nombre: "Nequi", monto: 500000 },
                            { nombre: "Bancolombia", monto: 800000 },
                            { nombre: "Davivienda", monto: 65000 },
                            { nombre: "Daviplata", monto: 6000 },
                            { nombre: "Av Villas", monto: 20000 },
                            { nombre: "Banco de occidente", monto: 20000 }
                        ]}
                    />
                </CardStat>
                <CardStat title="Productos más vendidos" size="1/2">
                    <ProductosMasVendidos data={[
                        { nombre: "Arroz Diana", ventas: 120 },
                        { nombre: "Aceite Premier", ventas: 95 },
                        { nombre: "Leche Alquería", ventas: 80 },
                        { nombre: "Pan Bimbo", ventas: 65 },
                        { nombre: "Huevos", ventas: 60 },
                    ]} />
                </CardStat>
                <CardStat title="Proveedores más utilizados" size="1/2">
                    <ProductosMasVendidos data={[
                        { nombre: "Coca cola", ventas: 120 },
                        { nombre: "Postobón", ventas: 95 },
                        { nombre: "Alpina", ventas: 80 },
                        { nombre: "Nutresa", ventas: 65 },
                        { nombre: "Bavaria", ventas: 60 },
                    ]} />
                </CardStat>
                <CardStat title="Cartera total fiada" size="1/4">
                    <p style={{ fontSize: 32 }}><b>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(25000000)}</b></p>
                </CardStat>
                <CardStat title="Cartera vencida" size="1/4">
                    <p style={{ fontSize: 32 }}><b>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(25000)}</b></p>
                </CardStat>
                <CardStat title="Pagos totales realizados" size="1/4">
                    <p style={{ fontSize: 32 }}>
                        <b>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(300002)}</b>
                    </p>
                </CardStat>
                <CardStat title="Ingresos por mora o cuotas" size="1/4">
                    <p style={{ fontSize: 32 }}>
                        <b>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(400000)}</b>
                    </p>
                </CardStat>
                <CardStat title="Ingresos - Costos - Perdidas" size="1/2">
                    <IngresosCostosPerdidas />
                </CardStat>
                <CardStat title="Ganancia neta mensual" size="1/2">
                    <GananciaNetaMensual />
                </CardStat>
            </div>
        </div>
    );
}

export default Container;