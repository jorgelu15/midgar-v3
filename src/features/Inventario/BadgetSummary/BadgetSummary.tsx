import style from "../container.module.css";
import type { Dispatch, SetStateAction } from "react";

interface BadgetSummaryProps {
  valorInventarioFisico: number;
  gananciaEstimada: number;
  productosAgotados: number;

  cantidadInhabilitados: number;
  cantidadHabilitados: number;

  productosInhabilitados: boolean;
  setProductosInhabilitados: Dispatch<SetStateAction<boolean>>;
}

const BadgetSummary = ({
  valorInventarioFisico,
  gananciaEstimada,
  productosAgotados,
  cantidadInhabilitados,
  cantidadHabilitados,
  productosInhabilitados,
  setProductosInhabilitados,
}: BadgetSummaryProps) => {
  const label = productosInhabilitados ? "Productos habilitados:" : "Productos deshabilitados:";
  const value = productosInhabilitados ? cantidadInhabilitados : cantidadHabilitados;

  return (
    <div className={style.container__badget}>
      <div className={style.badget}>
        <b>Inversión total:</b>
        <p>
          {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
            valorInventarioFisico
          )}
        </p>
      </div>

      <div className={style.badget}>
        <b>Ganancia estimada:</b>
        <p>
          {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
            gananciaEstimada
          )}
        </p>
      </div>

      <div className={style.badget}>
        <b>Productos agotados:</b>
        <p>{new Intl.NumberFormat("es-CO").format(productosAgotados)}</p>
      </div>

      <div
        className={style.badget}
        onClick={() => setProductosInhabilitados((prev) => !prev)}
        style={{ cursor: "pointer" }}
        role="button"
      >
        <b>{label}</b>
        <p>{new Intl.NumberFormat("es-CO").format(value)}</p>
      </div>
    </div>
  );
};

export default BadgetSummary;