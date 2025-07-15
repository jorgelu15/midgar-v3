import style from "./container.module.css";
import { routes } from "../../utils/routes";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { useMemo, useState } from "react";
import { useForm } from "../../hooks/useForm";
import borrar from "../../assets/borrar.svg";
import volver from "../../assets/volver.svg";
import status from "../../assets/status.svg";
import Table from "../../components/tables/Table";
import Modal from "../../components/modales/Modal";
import { useShortcuts } from "../../hooks/useShortcodes";
import { useNavigate } from "react-router-dom";

const items = [
  { label: "Dashboard", href: routes.dashboard },
  { label: "Inventario", href: routes.inventario },
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
];

const Container = () => {
  const navigate = useNavigate();
  const { form, onChangeGeneral } = useForm({ query: "" });
  const [selectedProduct, setSelectedProduct] = useState<string[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdjustStockModalOpen, setIsAdjustStockModalOpen] = useState(false);

  // Construir los atajos a partir de menuItems
  const shortcuts = menuItems.reduce((map, item) => {
    map[item.shortcode] = () => navigate(item.destiny);
    return map;
  }, {} as Record<string, () => void>);

  useShortcuts(shortcuts);

  const openProductModal = (product: string[]) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openAdjustStockModal = () => {
    setIsAdjustStockModalOpen(true);
  };

  const headers = [
    "Código",
    "Nombre",
    "Categoría",
    "Costo",
    "Precio de venta",
    "Cantidad actual",
    "Stock mínimo",
    "Estado",
    "Acciones",
  ];

  const originalRows = [
    ["0001", "Leche Alpina 1L", "Lácteos", "$2.600", "$4.000", 12, 5, "Activo"],
    ["0002", "Arroz Diana 5Kg", "Granos", "$9.000", "$13.000", 3, 5, "Stock bajo"],
    ["0003", "Aceite Premier 1L", "Aceites", "$5.800", "$9.000", 0, 4, "Agotado"],
    ["0004", "Jabón Rey x3", "Aseo", "$1.200", "$2.500", 15, 8, "Activo"],
    ["0005", "Coca-Cola 1.5L", "Bebidas", "$3.500", "$5.500", 2, 5, "Stock bajo"],
    ["0006", "Papel Higiénico 4 rollos", "Aseo", "$4.000", "$6.000", 10, 3, "Activo"],
    ["0007", "Sardina Van Camp's", "Enlatados", "$2.800", "$4.200", 0, 6, "Agotado"],
    ["0008", "Galletas Festival", "Dulces", "$1.000", "$1.800", 7, 4, "Activo"],
    ["0009", "Harina PAN 1Kg", "Harinas", "$2.400", "$3.500", 1, 3, "Stock bajo"],
    ["0010", "Agua Cristal 600ml", "Bebidas", "$900", "$1.500", 20, 10, "Activo"],
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
        <h1>Inventario</h1>
      </div>

      <div className={style.container__badget}>
        <div className={style.badget}>
          <b>Inversión total:</b>
          <p>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(80000)}</p>
        </div>
        <div className={style.badget}>
          <b>Ganancia estimada:</b>
          <p>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(2000000)}</p>
        </div>
        <div className={style.badget}>
          <b>Productos agotados:</b>
          <p>{new Intl.NumberFormat("es-CO", { style: "decimal", notation: "compact" }).format(3)}</p>
        </div>
      </div>

      <div className={style.content}>
        <div className={style.header__container}>
          <button className="btn btn_primary">Crear producto</button>
          <div className={style.form_control}>
            <input
              type="search"
              placeholder="Buscar un producto"
              value={form.query}
              onChange={(e) => onChangeGeneral(e, "query")}
            />
          </div>
        </div>

        <div className={style.table_container}>
          <Table
            headers={headers}
            data={filteredRows}
            defaultRowsPerPage={5}
            rowsPerPageOptions={[5, 10, 20]}
            renderRow={(row) => (
              <>
                {row.map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
                <td>
                  <img src={status} onClick={() => openProductModal(row.map(String))} />
                  <img src={borrar} />
                </td>
              </>
            )}
          />
        </div>

        {/* Modal Kardex */}
        {isModalOpen && selectedProduct && (
          <Modal
            title={`Kardex - ${selectedProduct[1]}`}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            size="lg"
            footer={
              <div className={style.modal_footer_actions}>
                <button className="btn">Exportar Excel</button>
                <button className="btn">Imprimir</button>
                <button className="btn" onClick={openAdjustStockModal}>
                  Ajustar stock
                </button>
              </div>
            }
          >
            <div className={style.kardex__sumary}>
              <p><b>Stock actual:</b> 22 unidades</p>
              <p><b>Última entrada:</b> 15/05/2025 (+10)</p>
              <p><b>Última salida:</b> 18/05/2025 (-5)</p>
            </div>

            <div className={style.control__kardex}>
              <div>
                <span>Ver:</span>
                <select>
                  <option>Últimos 7 días</option>
                  <option>Últimos 30 días</option>
                  <option>Todos los movimientos</option>
                </select>
              </div>
              <div>
                <span>Ordenar por:</span>
                <select>
                  <option>Más reciente</option>
                  <option>Entradas primero</option>
                  <option>Salidas primero</option>
                </select>
              </div>
            </div>

            <Table
              headers={["Fecha", "Movimiento", "Motivo", "Cantidad", "Saldo", "Costo", "Usuario"]}
              data={[
                ["15/07/2025", "Entrada", "Compra proveedor", "+10", "22", "$2.600", "Jorge"],
                ["14/07/2025", "Salida", "Venta", "-3", "12", "$2.600", "Ana"],
                ["13/07/2025", "Entrada", "Ajuste inventario", "+5", "15", "$2.500", "Luis"],
                ["12/07/2025", "Salida", "Venta", "-2", "10", "$2.500", "Sofía"],
                ["11/07/2025", "Entrada", "Compra proveedor", "+10", "12", "$2.400", "Carlos"],
              ]}
              defaultRowsPerPage={5}
              rowsPerPageOptions={[5, 10]}
              renderRow={(row) => (
                <>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </>
              )}
            />
          </Modal>
        )}

        {/* Modal Ajustar Stock */}
        {isAdjustStockModalOpen && (
          <Modal
            title="Ajustar Stock"
            isOpen={isAdjustStockModalOpen}
            onClose={() => setIsAdjustStockModalOpen(false)}
            size="md"
            footer={
              <div className={style.modal_footer_actions}>
                <button className="btn btn_secondary" onClick={() => setIsAdjustStockModalOpen(false)}>
                  Cancelar
                </button>
                <button className="btn btn_primary">Confirmar ajuste</button>
              </div>
            }
          >
            <form className={style.adjust_stock_form}>
              <div className={style.form_control}>
                <label>Cantidad a ajustar *</label>
                <input type="number" placeholder="Ej: +5 o -3" required />
              </div>
              <div className={style.form_control}>
                <label>Tipo de movimiento *</label>
                <select required>
                  <option value="">Seleccionar...</option>
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                </select>
              </div>
              <div className={style.form_control}>
                <label>Motivo del ajuste *</label>
                <select required>
                  <option value="">Seleccionar motivo</option>
                  <option value="conteo">Conteo físico</option>
                  <option value="daño">Producto dañado</option>
                  <option value="error">Error de sistema</option>
                </select>
              </div>
              <div className={style.form_control}>
                <label>Observación (opcional)</label>
                <input type="text" placeholder="Ej: bolsas abiertas, humedad" />
              </div>
              <div className={style.form_control}>
                <label>Usuario</label>
                <input type="text" value="Juan Pérez" disabled />
              </div>
              <div className={style.form_control}>
                <label>Fecha</label>
                <input type="text" value={new Date().toLocaleString("es-CO")} disabled />
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Container;
