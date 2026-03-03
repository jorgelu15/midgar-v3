// ─────────────────────────────────────────────
//  components/Factura.tsx
//  Panel lateral derecho: cajero, cliente,
//  items de la factura, pagos y total.
// ─────────────────────────────────────────────

import type { ProductoRepository } from "../../../models/Producto.repository";
import type { Cliente, Pago } from "./tienda.service";
import style from "../container.module.css";
import dcto from "../../../assets/dcto.svg";
import trash from "../../../assets/borrar.svg";

const currencyFormat = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
});

interface Props {
  cajero?: string;
  cliente: Cliente | null;
  productos: ProductoRepository[];
  pagos: Pago[];
  total: number;
  onVaciar: () => void;
}

export default function Factura({
  cajero = "Jorge Guardo",
  cliente,
  productos,
  pagos,
  total,
  onVaciar,
}: Props) {
  return (
    <div className={style.facture}>
      <div className={style.facture__controls}>
        <div className={style.btn}>
          <img src={dcto} width={30} alt="Descuento" />
        </div>
        <div className={style.btn} onClick={onVaciar}>
          <img src={trash} alt="Vaciar factura" />
        </div>
      </div>

      <div className={style.facture__info}>
        <div className={style.facture__info__subtitle}>
          <h4>Cajero:</h4>
          <p>{cajero}</p>
        </div>
        <div className={style.facture__info__subtitle}>
          <h4>Cliente:</h4>
          {cliente ? (
            <p>
              {cliente.cedula} - {cliente.nombre}
            </p>
          ) : (
            <p>Sin cliente seleccionado</p>
          )}
        </div>
      </div>

      <div className={style.facture__content}>
        {productos.map((p, i) => (
          <div key={i} className={style.facture__content__item}>
            <p className={style.title__item}>{p.nombre}</p>
            <div className={style.facture__content__item__info}>
              <p>
                {p.cantidad} UND x {currencyFormat.format(p.precio_venta)}
              </p>
              <p>
                {currencyFormat.format(p.precio_venta * (p.cantidad ?? 1))}
              </p>
            </div>
          </div>
        ))}

        {pagos.map((p, i) => (
          <div key={i} className={style.facture__content__item}>
            <p className={style.title__item}>Pago con {p.medio}</p>
            <div className={style.facture__content__item__info}>
              <p>{currencyFormat.format(p.monto)}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className={style.facture__content__item__info}
        style={{ padding: "20px" }}
      >
        <p>Total:</p>
        <p>{currencyFormat.format(total)}</p>
      </div>
    </div>
  );
}
