// ─────────────────────────────────────────────
//  components/PanelTotalizar.tsx
//  Panel de totalización: selección de medio de pago,
//  ingreso de monto y confirmación de venta.
// ─────────────────────────────────────────────

import type {KeyboardEvent } from "react";
import CardPOS from "../../../components/cards/CardPOS";
import confirm__wallet from "../../../assets/confirm_wallet.svg";
import type { MedioPago } from "./tienda.service";
import style from "../container.module.css";

const currencyFormat = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
});

interface Props {
  inputRef: any;
  mediosDePago: MedioPago[];
  filtroMedio: string;
  onFiltroChange: (val: string) => void;
  medioSeleccionado: string | null;
  onSeleccionarMedio: (nombre: string) => void;
  montoMedio: string;
  onMontoChange: (val: string) => void;
  onAgregarPago: () => void;
  onConfirmarVenta: () => void;
  faltante: number;
  isConfirmando?: boolean;
}

export default function PanelTotalizar({
  inputRef,
  mediosDePago,
  filtroMedio,
  onFiltroChange,
  medioSeleccionado,
  onSeleccionarMedio,
  montoMedio,
  onMontoChange,
  onAgregarPago,
  onConfirmarVenta,
  faltante,
  isConfirmando,
}: Props) {
  const mediosFiltrados = mediosDePago.filter((mp) =>
    mp.nombre.toLowerCase().includes(filtroMedio.toLowerCase())
  );

  const handleMontoKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAgregarPago();
    }
  };

  return (
    <div className={style.main__content}>
      {!medioSeleccionado ? (
        <>
          <div className={style.form_control}>
            <label>Buscar medio de pago</label>
            <input
              type="search"
              placeholder="Ej: Nequi"
              value={filtroMedio}
              onChange={(e) => onFiltroChange(e.target.value)}
            />
          </div>

          <div className={style.cards}>
            {mediosFiltrados.map((medio, index) => (
              <CardPOS
                key={index}
                shortcode={medio.shortcode}
                title={medio.nombre}
                redirect={() => onSeleccionarMedio(medio.nombre)}
                image={confirm__wallet}
                to=""
              />
            ))}
          </div>
        </>
      ) : (
        <div className={style.form_control}>
          <label>Ingresar monto en {medioSeleccionado}</label>
          <input
            ref={inputRef}
            type="number"
            placeholder="Ej: 50000"
            value={montoMedio}
            onChange={(e) => onMontoChange(e.target.value)}
            onKeyDown={handleMontoKeyDown}
          />
        </div>
      )}

      {faltante > 0 && (
        <div className={style.info__cliente}>
          <div
            className={style.info__producto}
            style={{ alignItems: "end" }}
          >
            <p>Faltante</p>
            <div
              className={style.info__producto__cantidad}
              style={{ justifyContent: "flex-end" }}
            >
              <p>{currencyFormat.format(faltante)}</p>
            </div>
          </div>
        </div>
      )}

      {faltante < 0 && (
        <p style={{ color: "#4caf50", marginTop: 10 }}>
          Vuelto: {currencyFormat.format(-faltante)}
        </p>
      )}

      <CardPOS
        title={isConfirmando ? "Procesando..." : "Vender"}
        shortcode="F9"
        to=""
        redirect={faltante <= 0 ? onConfirmarVenta : () => {}}
      />
    </div>
  );
}
