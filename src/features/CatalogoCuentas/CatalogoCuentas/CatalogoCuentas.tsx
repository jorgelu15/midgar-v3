import React, { useState } from "react";
import style from "./catalogoCuentas.module.css";
import type { CuentaContable } from "../../../models/CuentaContable";
import { useContabilidad } from "../../../hooks/useContabilidad";
import Modal from "../../../components/modales/Modal";
import { useForm } from "../../../hooks/useForm";

const CatalogoCuentas = () => {
  const {
    pucQuery,
  } = useContabilidad();
  const { form, onChangeGeneral } = useForm({
    codigo: "",
    nombre: "",
    tipo_cuenta: "detalle",
    naturaleza: "debito",
    descripcion: ""
  })
  const [modalCrearCuentaOpen, setModalCrearCuentaOpen] = useState(false);


  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaContable | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { data, isLoading, isError, error } = pucQuery;

  const cuentasPlanas = data;


  const arbolCuentas = cuentasPlanas

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const CuentaFila: React.FC<{
    cuenta: CuentaContable;
    nivel?: number;
    onSelect: (cuenta: CuentaContable) => void;
  }> = ({ cuenta, nivel = 0, onSelect }) => {
    const tieneHijos = cuenta.hijos && cuenta.hijos.length > 0;
    const isExpanded = expandedNodes.has(cuenta.id);
    return (
      <>
        <tr
          className={`${style.row} ${cuentaSeleccionada?.id === cuenta.id ? style.seleccionada : ''}`}
          onClick={() => onSelect(cuenta)}
        >
          <td style={{ paddingLeft: `${nivel * 24}px` }}>
            {tieneHijos && (
              <button
                className={style.toggle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(cuenta.id);
                }}
              >
                {isExpanded ? "− " : "+ "}
              </button>
            )}
            <span className={style.codigo}>{cuenta.codigo}</span>
            <span>{cuenta.nombre}</span>
          </td>
        </tr>
        {isExpanded &&
          tieneHijos &&
          cuenta?.hijos!.map((hijo) => (
            <CuentaFila
              key={hijo.id}
              cuenta={hijo}
              nivel={nivel + 1}
              onSelect={onSelect}
            />
          ))}
      </>
    );
  };

  if (isLoading) {
    return <div className={style.cargando}>Cargando catálogo de cuentas...</div>;
  }

  if (isError) {
    return <div className={style.error}>Error: {error.message}</div>;
  }

  return (
    <div className={style.container}>
      <div className={style.panelIzquierdo}>
        <div className={style.header}>
          <div className={style.actions}>
            <button className={"btn btn_primary"}>Saldos iniciales</button>
            <button className={"btn btn_secondary"}>Más acciones</button>
            <button className={"btn btn_secondary"} onClick={() => setModalCrearCuentaOpen(true)}>Crear cuenta</button>
          </div>
        </div>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {arbolCuentas?.map((cuenta: CuentaContable) => (
              <CuentaFila
                key={cuenta.id}
                cuenta={cuenta}
                onSelect={setCuentaSeleccionada}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className={style.panelDerecho}>
        {cuentaSeleccionada ? (
          <div className={style.detalle}>
            <h3>Cuenta contable</h3>
            <p><strong>Código:</strong> {cuentaSeleccionada.codigo}</p>
            <p><strong>Nombre:</strong> {cuentaSeleccionada.nombre}</p>
            <p><strong>Tipo de cuenta:</strong> {cuentaSeleccionada.tipo_cuenta}</p>
            <p><strong>Naturaleza:</strong> {cuentaSeleccionada.naturaleza}</p>
            <p><strong>Nivel:</strong> {cuentaSeleccionada.nivel}</p>
            <p><strong>Descripción:</strong> {cuentaSeleccionada.descripcion || "Sin descripción"}</p>
          </div>
        ) : (
          <div className={style.detalleVacio}>Selecciona una cuenta para ver detalles</div>
        )}
      </div>
      {modalCrearCuentaOpen && (
        <Modal
          isOpen={modalCrearCuentaOpen}
          onClose={() => setModalCrearCuentaOpen(false)}
          title="Crear nueva cuenta contable"
          size="md"
          closeOnEscape={true}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button className="btn btn_secondary" onClick={() => setModalCrearCuentaOpen(false)}>
                Cancelar
              </button>
              <button className="btn btn_primary" onClick={() => {
                setModalCrearCuentaOpen(false);
              }}>
                Crear
              </button>
            </div>
          }
        >
          <form className={style.formulario}>
            <div className={style.form_control}>
              <label>Código</label>
              <input
                type="text"
                value={form.codigo}
                onChange={(e) => onChangeGeneral(e, "codigo")}
              />
            </div>
            <div className={style.form_control}>
              <label>Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => onChangeGeneral(e, "nombre")}
              />
            </div>
            <div className={style.form_control}>
              <label>Tipo de cuenta</label>
              <select
                value={form.tipo_cuenta}
                onChange={(e) => onChangeGeneral(e, "tipo_cuenta")}
              >
                <option value="detalle">Detalle</option>
                <option value="mayor">Mayor</option>
              </select>
            </div>
            <div className={style.form_control}>
              <label>Naturaleza</label>
              <select
                value={form.naturaleza}
                onChange={(e) => onChangeGeneral(e, "naturaleza")}
              >
                <option value="debito">Débito</option>
                <option value="credito">Crédito</option>
              </select>
            </div>
            <div className={style.form_control}>
              <label>Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => onChangeGeneral(e, "descripcion")}
              />
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

export default CatalogoCuentas;