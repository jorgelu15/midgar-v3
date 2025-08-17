import style from "./cardcuentalavado.module.css";
import wash from "../../assets/wash.svg"
interface Producto {
    nombre: string;
    precio_venta: number;
    descuento: number;
    cantidad: number;
}

interface CuentaLavadoProps {
    nombreCliente: string;
    placa: string;
    lavador: string;
    sala: string;
    productos: Producto[];
    ingreso?: string;
    onClick?: () => void;
}

const CardCuentaLavado = ({
    nombreCliente,
    placa,
    lavador,
    sala,
    productos,
    ingreso = "12:15 p.m.",
    onClick,
}: CuentaLavadoProps) => {
    const total = productos.reduce(
        (acc, p) => acc + p.precio_venta * p.cantidad,
        0
    );

    return (
        <div className={style.card} onClick={onClick}>
            <div className={style.badge}>En servicio</div>

            <div className={style.header}>
                <h2 style={{ alignItems: "center", display: "flex", gap: 5 }}>
                    <div className={style.icon__car}></div><span className={style.placa}>{placa}</span>
                    <span className={style.cliente}>({nombreCliente})</span>
                </h2>
            </div>

            <ul className={style.detalles}>
                <li>Lavador: <strong>{lavador}</strong></li>
                <li>Sala: <strong>{sala}</strong></li>
                <li>Productos: <strong>{productos.reduce((acc, p) => acc + (p.cantidad || 0), 0)}</strong></li>
                <li>Ingreso: <strong>{ingreso}</strong></li>
            </ul>

            <div className={style.footer}>
                <span className={style.total}>${total.toLocaleString()}</span>
                <button className={style.btn}>➤ Abrir cuenta</button>
            </div>
        </div>
    );
};

export default CardCuentaLavado;
