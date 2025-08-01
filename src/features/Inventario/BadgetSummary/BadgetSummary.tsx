import style from "../container.module.css";

interface BadgetSummaryProps {
    valorInventarioFisico: number;
    gananciaEstimada: number;
    productosAgotados: number;
}

const BadgetSummary = ({ valorInventarioFisico, gananciaEstimada, productosAgotados }: BadgetSummaryProps) => {
    return (
        <div className={style.container__badget}>
            <div className={style.badget}>
                <b>Inversión total:</b>
                <p>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(valorInventarioFisico)}</p>
            </div>
            <div className={style.badget}>
                <b>Ganancia estimada:</b>
                <p>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(gananciaEstimada)}</p>
            </div>
            <div className={style.badget}>
                <b>Productos agotados:</b>
                <p>{new Intl.NumberFormat("es-CO", { style: "decimal", notation: "standard" }).format(productosAgotados)}</p>
            </div>
        </div>
    );
}

export default BadgetSummary;