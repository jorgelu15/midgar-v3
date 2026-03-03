// ─────────────────────────────────────────────
//  Container.tsx  (refactorizado)
//  Orquestador principal. Solo layout + teclado global.
//  Toda la lógica vive en useTienda.ts
// ─────────────────────────────────────────────

import { useEffect, useState } from "react";
import style from "./container.module.css";
import { useTienda } from "./useTienda";

import BarraAcciones from "./components/BarraAcciones";
import BuscadorInput from "./components/BuscadorInput";
import InfoUltimoProducto from "./components/InfoUltimoProducto";
import PanelTotalizar from "./components/PanelTotalizar";
import Factura from "./components/Factura";

const Container = () => {
  const [codigoInput, setCodigoInput] = useState("");

  const {
    productosFactura,
    ultimoProducto,
    clienteSeleccionado,
    modoBusqueda,
    setModoBusqueda,
    modoTotalizar,
    filtroMedio,
    setFiltroMedio,
    pagos,
    medioSeleccionado,
    setMedioSeleccionado,
    montoMedio,
    setMontoMedio,
    mediosDePago,
    total,
    faltante,
    inputRef,
    handleBuscar,
    handleEliminarUltimo,
    handleAbrirTotalizar,
    handleAgregarPago,
    handleConfirmarVenta,
    vaciarFactura,
    handleEscape,
    isBuscandoCliente,
    isBuscandoProducto,
    isConfirmando,
  } = useTienda();

  // ── Teclado global (shortcuts) ─────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (modoTotalizar && !medioSeleccionado) {
        const found = mediosDePago.find((m) => m.shortcode === e.code);
        if (found) {
          e.preventDefault();
          setMedioSeleccionado(found.nombre);
          return;
        }
        if (e.code === "F9" && faltante <= 0 && pagos.length > 0) {
          e.preventDefault();
          handleConfirmarVenta();
          return;
        }
      }

      switch (e.code) {
        case "Escape":
          e.preventDefault();
          handleEscape();
          break;
        case "F1":
          e.preventDefault();
          if (clienteSeleccionado && !modoTotalizar) setModoBusqueda("producto");
          break;
        case "F2":
          e.preventDefault();
          if (!modoTotalizar) setModoBusqueda("cliente");
          break;
        case "F12":
          e.preventDefault();
          handleAbrirTotalizar();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    modoTotalizar,
    medioSeleccionado,
    mediosDePago,
    faltante,
    pagos,
    clienteSeleccionado,
  ]);

  // ── Foco automático en el input ────────────────
  useEffect(() => {
    if (!modoTotalizar || medioSeleccionado) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [modoBusqueda, modoTotalizar, medioSeleccionado]);

  return (
    <div className="container" style={{ marginTop: 0 }}>
      <div className={style.container__compact}>
        <div className={style.main}>
          <div className={style.msg__welcome}>
            <h1>Tienda</h1>
          </div>

          {!modoTotalizar && (
            <>
              <div className={style.cards}>
                <BarraAcciones
                  clienteSeleccionado={!!clienteSeleccionado}
                  tieneProductos={productosFactura.length > 0}
                  setModoBusqueda={setModoBusqueda}
                  onTotalizar={handleAbrirTotalizar}
                />
              </div>

              <div className={style.cards} style={{ gap: 0 }}>
                <BuscadorInput
                  inputRef={inputRef}
                  modoBusqueda={modoBusqueda}
                  value={codigoInput}
                  onChange={setCodigoInput}
                  onBuscar={(val) => {
                    handleBuscar(val);
                    setCodigoInput("");
                  }}
                  onEliminarUltimo={handleEliminarUltimo}
                  isLoading={isBuscandoCliente || isBuscandoProducto}
                />
                <InfoUltimoProducto producto={ultimoProducto} />
              </div>
            </>
          )}

          {modoTotalizar && (
            <PanelTotalizar
              inputRef={inputRef}
              mediosDePago={mediosDePago}
              filtroMedio={filtroMedio}
              onFiltroChange={setFiltroMedio}
              medioSeleccionado={medioSeleccionado}
              onSeleccionarMedio={setMedioSeleccionado}
              montoMedio={montoMedio}
              onMontoChange={setMontoMedio}
              onAgregarPago={handleAgregarPago}
              onConfirmarVenta={handleConfirmarVenta}
              faltante={faltante}
              isConfirmando={isConfirmando}
            />
          )}
        </div>

        <Factura
          cliente={clienteSeleccionado}
          productos={productosFactura}
          pagos={pagos}
          total={total}
          onVaciar={vaciarFactura}
        />
      </div>
    </div>
  );
};

export default Container;
