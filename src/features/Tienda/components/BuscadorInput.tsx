// ─────────────────────────────────────────────
//  components/BuscadorInput.tsx
//  Input de búsqueda. Maneja Enter (buscar) y
//  Backspace vacío (eliminar último producto).
// ─────────────────────────────────────────────

import type { KeyboardEvent } from "react";
import type { ModoBusqueda } from "./useTienda";
import style from "../container.module.css";

interface Props {
  inputRef: any;
  modoBusqueda: ModoBusqueda;
  value: string;
  onChange: (val: string) => void;
  onBuscar: (val: string) => void;
  onEliminarUltimo: () => void;
  isLoading?: boolean;
}

export default function BuscadorInput({
  inputRef,
  modoBusqueda,
  value,
  onChange,
  onBuscar,
  onEliminarUltimo,
  isLoading,
}: Props) {
  const esProducto = modoBusqueda === "producto";

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onBuscar(value);
      onChange("");
    }
    if (e.key === "Backspace" && value === "") {
      onEliminarUltimo();
    }
  };

  return (
    <div className={style.form_control}>
      <label>{esProducto ? "Código de barras" : "Cédula del cliente"}</label>
      <input
        ref={inputRef}
        type="search"
        placeholder={esProducto ? "Ej: 123*2 o 123*-1" : "Ej: 45512237"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
    </div>
  );
}
