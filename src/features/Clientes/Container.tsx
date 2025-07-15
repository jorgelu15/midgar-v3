import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import Table from "../../components/tables/Table";
import { useForm } from "../../hooks/useForm";
import { routes } from "../../utils/routes";
import style from "./container.module.css";
import OffcanvasCliente from "../../components/offcanvas/OffcanvasCliente";
import Modal from "../../components/modales/Modal";
import preview from "../../assets/status.svg";
import volver from "../../assets/volver.svg";
import add_money from "../../assets/add_money.svg";
import { useShortcuts } from "../../hooks/useShortcodes";

const items = [
  { label: "Dashboard", href: routes.dashboard },
  { label: "Clientes", href: routes.clientes },
];

const menuItems = [
  { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
];

const Container = () => {
  const navigate = useNavigate();
  const { form, onChangeGeneral } = useForm({ query: "" });

  const [showPanel, setShowPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCupoModal, setShowCupoModal] = useState(false);

  const [selectedClient, setSelectedClient] = useState<{ nombre: string; cedula: string } | null>(null);
  const [clientForm, setClientForm] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    cupo: "",
  });

  const [cupoForm, setCupoForm] = useState({
    cupo: "",
    corte: "15",
    cuotas: "3",
    interes: "2",
    observacion: "",
    aplicaInteres: true,
  });

  const onChangeClientForm = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setClientForm({ ...clientForm, [field]: e.target.value });
  };

  const onChangeCupoForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    const value = field === "aplicaInteres" ? (e.target as HTMLInputElement).checked : e.target.value;
    setCupoForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAsignarCupo = (cedula: string, nombre: string) => {
    setSelectedClient({ cedula, nombre });
    setShowCupoModal(true);
  };

  // Atajos
  const shortcuts = menuItems.reduce((map, item) => {
    map[item.shortcode] = () => navigate(item.destiny);
    return map;
  }, {} as Record<string, () => void>);
  useShortcuts(shortcuts);

  const header_items = [
    "Cédula",
    "Nombre",
    "Teléfono",
    "Deuda Actual",
    "Cupo disponible",
    "Última compra",
    "Estado de crédito",
    "Acciones",
  ];

  const originalRows: string[][] = [
    ["1012345678", "Pedro Gómez", "3001234567", "$80.000", "$0", "13/07/2025", "Activo", "Acciones"],
    ["1023456789", "Ana María Torres", "3014567890", "$0", "$150.000", "10/07/2025", "Activo", "Acciones"],
    ["1034567890", "Carlos Ruiz", "3129876543", "$180.000", "$0", "01/07/2025", "En mora", "Acciones"],
  ];

  const filteredRows = useMemo(() => {
    const query = form.query.toLowerCase();
    if (!query) return originalRows;
    return originalRows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(query))
    );
  }, [form.query]);

  return (
    <div className="container">
      <Breadcrumb items={items} />
      <div className={style.msg__welcome}>
        <h1>Clientes</h1>
      </div>
      <div className={style.content}>
        <div className={style.header__container}>
          <button className="btn btn_primary" onClick={() => setShowCreateModal(true)}>
            Crear cliente
          </button>
          <div className={style.form_control}>
            <input
              type="search"
              placeholder="Buscar un cliente"
              value={form.query}
              onChange={(e) => onChangeGeneral(e, "query")}
            />
          </div>
        </div>

        <div className={style.table_container}>
          <Table<string[]>
            headers={header_items}
            data={filteredRows}
            rowsPerPageOptions={[5, 10, 20]}
            defaultRowsPerPage={5}
            renderRow={(row) => (
              <>
                {row.map((cell, i) => (
                  <td key={i}>
                    {i !== row.length - 1 ? cell : (
                      <>

                        {row[4] === "$0" ? (
                          <button style={{ background: "transparent", marginRight: 6 }} onClick={() => handleAsignarCupo(row[1], row[0])}>
                            <img src={add_money} />
                          </button>
                        ) : (
                          <button
                            style={{ background: "transparent", marginRight: 6 }}
                            onClick={() => setShowPanel(true)}
                          >
                            <img src={preview} alt="Ver" />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                ))}
              </>
            )}
          />
        </div>
        <OffcanvasCliente isOpen={showPanel} onClose={() => setShowPanel(false)} />

        {/* Atajos */}
        <div className={style.shortcut_guide}>
          <h3>Atajos de teclado</h3>
          <ul>
            <li><strong>V:</strong> Ir a la sección de Vender</li>
            <li><strong>C:</strong> Ir a la sección de Clientes</li>
            <li><strong>I:</strong> Ir a Inventario</li>
            <li><strong>F:</strong> Ir a Fiados</li>
            <li><strong>E:</strong> Ir a Estadísticas</li>
            <li><strong>A:</strong> Ir a Ajustes</li>
            <li><strong>Ctrl + N:</strong> Crear nuevo usuario</li>
            <li><strong>Esc:</strong> Volver atrás</li>
            <li><strong>B:</strong> Enfocar campo de búsqueda</li>
          </ul>
        </div>
      </div>

      {/* Modal Crear Cliente */}
      {showCreateModal && (
        <Modal
          title="Crear nuevo cliente"
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          size="md"
          footer={
            <div className={style.modal_footer_actions}>
              <button className="btn btn_secondary" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </button>
              <button className="btn btn_primary" onClick={() => console.log(clientForm)}>
                Crear cliente
              </button>
            </div>
          }
        >
          <form className={style.form_cliente}>
            <div className={style.form_control}>
              <label>Cédula *</label>
              <input type="text" required value={clientForm.cedula} onChange={(e) => onChangeClientForm(e, "cedula")} />
            </div>
            <div className={style.form_control}>
              <label>Nombre completo *</label>
              <input type="text" required value={clientForm.nombre} onChange={(e) => onChangeClientForm(e, "nombre")} />
            </div>
            <div className={style.form_control}>
              <label>Teléfono *</label>
              <input type="text" required value={clientForm.telefono} onChange={(e) => onChangeClientForm(e, "telefono")} />
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Asignar Cupo */}
      {showCupoModal && selectedClient && (
        <Modal
          title={`Asignar tarjeta a: ${selectedClient.nombre}`}
          isOpen={showCupoModal}
          onClose={() => setShowCupoModal(false)}
          size="md"
          footer={
            <div className={style.modal_footer_actions}>
              <button className="btn" onClick={() => setShowCupoModal(false)}>Cancelar</button>
              <button className="btn" onClick={() => console.log(cupoForm)}>Asignar cupo</button>
            </div>
          }
        >
          <div className={style.form_cliente}>
            <p><b>Nombre:</b> {selectedClient.cedula}</p>

            <div className={style.form_control}>
              <label>Cupo total a asignar</label>
              <input type="text" placeholder="$200.000" value={cupoForm.cupo} onChange={(e) => onChangeCupoForm(e, "cupo")} />
            </div>

            <div className={style.form_control}>
              <label>Fecha de corte</label>
              <select value={cupoForm.corte} onChange={(e) => onChangeCupoForm(e, "corte")}>
                {[...Array(28)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div className={style.form_control}>
              <label>🧮 Cuotas predeterminadas</label>
              <select value={cupoForm.cuotas} onChange={(e) => onChangeCupoForm(e, "cuotas")}>
                <option value="1">1 cuota</option>
                <option value="2">2 cuotas</option>
                <option value="3">3 cuotas</option>
                <option value="6">6 cuotas</option>
              </select>
            </div>

            <div className={style.form_control}>
              <label>📈 Aplica interés mensual</label>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="checkbox"
                  checked={cupoForm.aplicaInteres}
                  onChange={(e) => onChangeCupoForm(e, "aplicaInteres")}
                />
                <span>Sí</span>
                <input
                  type="text"
                  style={{ width: "80px" }}
                  value={cupoForm.interes}
                  onChange={(e) => onChangeCupoForm(e, "interes")}
                />
                <span>%</span>
              </div>
            </div>

            <div className={style.form_control}>
              <label>📝 Observación</label>
              <input
                type="text"
                value={cupoForm.observacion}
                onChange={(e) => onChangeCupoForm(e, "observacion")}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Container;
