// ─────────────────────────────────────────────
//  components/InfoUltimoProducto.tsx
//  Muestra el resumen del último producto escaneado.
// ─────────────────────────────────────────────

import type { ProductoRepository } from "../../../models/Producto.repository";
import style from "../container.module.css";

const currencyFormat = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
});

interface Props {
  producto: ProductoRepository | null;
}

export default function InfoUltimoProducto({ producto }: Props) {
  if (!producto) return null;

  return (
    <div className={style.info__cliente}>
      <div className={style.info__producto}>
        <p>
          {producto.codigo} - {producto.nombre}
        </p>
        <div className={style.info__producto__cantidad}>
          <p>
            {producto.cantidad} UND x{" "}
            {currencyFormat.format(producto.precio_venta)}
          </p>
          <p>
            {currencyFormat.format(
              producto.precio_venta * (producto.cantidad ?? 1)
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
