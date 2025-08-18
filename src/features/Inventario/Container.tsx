import style from "./container.module.css";
import { routes } from "../../utils/routes";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { useMemo } from "react";
import stringSimilarity from "string-similarity";
import { useForm } from "../../hooks/useForm";
import borrar from "../../assets/borrar.svg";
import volver from "../../assets/volver.svg";
import status from "../../assets/status.svg";
import Table from "../../components/tables/Table";
import { useShortcuts } from "../../hooks/useShortcodes";
import { useNavigate } from "react-router-dom";
import { useInventario } from "../../hooks/useInventario";
import type { ProductoRepository } from "../../models/Producto.repository";
import { useProductModals } from "../../hooks/useProductModals";
import BadgetSummary from "./BadgetSummary/BadgetSummary";
import CreateProductoModal from "./Modals/CrearProducto.modal";
import AjustarStockModal from "./Modals/AjustarStock.modal";
import KardexModal from "./Modals/Kardex.modal";
import AbastecerInventarioModal from "./Modals/AbastecerInventario.modal";

const items = [
  { label: "Dashboard", href: routes.dashboard },
  { label: "Inventario físico", href: routes.InventarioFisico },
];

const menuItems = [
  { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
];

const Container = () => {
  const { productosQuery, valorInventarioFisicoQuery, gananciaEstimadaQuery, productosAgotadosQuery } = useInventario();
  const productos: ProductoRepository[] = productosQuery.data || [];
  const valorInventarioFisico = valorInventarioFisicoQuery.data?.valor_inventario_fisico || 0;
  const gananciaEstimada = gananciaEstimadaQuery.data?.ganancia_estimada || 0;
  const productosAgotados = productosAgotadosQuery.data?.productos_agotados || 0;

console.log("productos", productos);  
  
  const navigate = useNavigate();
  const { form, onChangeGeneral } = useForm({ query: "" });
  const {
    selectedProduct,
    setSelectedProduct,
    isKardexModalOpen,
    setIsKardexModalOpen,
    isCreateProductModalOpen,
    setIsCreateProductModalOpen,
    isAdjustStockModalOpen,
    setIsAdjustStockModalOpen,
    isAbastecerModalOpen,
    setIsAbastecerModalOpen
  } = useProductModals();


  // Construir los atajos a partir de menuItems
  const shortcuts = menuItems.reduce((map, item) => {
    map[item.shortcode] = () => navigate(item.destiny);
    return map;
  }, {} as Record<string, () => void>);

  useShortcuts(shortcuts);

  const openKardexModal = (product: ProductoRepository) => {
    setSelectedProduct(product);
    setIsKardexModalOpen(true);
  };

  const openCreateProductModal = () => {
    setIsCreateProductModalOpen(true);
  }

  const openAbastecerInventarioModal = () => {
    setIsAbastecerModalOpen(true);
  }

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

  const filteredRows = useMemo(() => {
    const query = form.query.toLowerCase();
    if (!query) return productos;

    return productos.filter((row: ProductoRepository) => {
      return Object.values(row).some(value => {
        const text = String(value).toLowerCase();

        if (text.includes(query)) return true;

        const similarity = stringSimilarity.compareTwoStrings(text, query);
        return similarity > 0.8;
      });
    });
  }, [form.query, productos]);



  return (
    <div className="container">
      <Breadcrumb items={items} />

      <div className={style.msg__welcome}>
        <h1>Inventario físico</h1>
      </div>

      <BadgetSummary
        valorInventarioFisico={valorInventarioFisico}
        gananciaEstimada={gananciaEstimada}
        productosAgotados={productosAgotados}
      />

      <div className={style.content}>
        <div className={style.header__container}>
          <div style={{ display: "flex", gap: 20 }}>
            <button className="btn btn_primary" onClick={openCreateProductModal}>Crear producto</button>
            <button className="btn btn_secondary" onClick={openAbastecerInventarioModal}>Abastecer inventario</button>
          </div>
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
            renderRow={(row) => {
              const rowValues = [
                row.codigo,
                row.nombre,
                row.categoria_id,
                row.costo,
                row.precio_venta,
                row.cantidad,
                row.cantidad_minima,
                row.estado
              ];
              return (
                <>
                  {rowValues.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                  <td>
                    <img src={status} onClick={() => openKardexModal(row)} />
                    <img src={borrar} />
                  </td>
                </>
              );
            }}
          />
        </div>

        {/* Modal Kardex */}
        {isKardexModalOpen && selectedProduct && (
          <KardexModal
            isKardexModalOpen={isKardexModalOpen}
            setIsKardexModalOpen={setIsKardexModalOpen}
            selectedProduct={selectedProduct}
            openAdjustStockModal={openAdjustStockModal}
          />
        )}

        {isAdjustStockModalOpen && (
          <AjustarStockModal
            isAdjustStockModalOpen={isAdjustStockModalOpen}
            setIsAdjustStockModalOpen={setIsAdjustStockModalOpen}
            selectedProduct={selectedProduct}
          />
        )}

        {isCreateProductModalOpen && (
          <CreateProductoModal
            isCreateProductModalOpen={isCreateProductModalOpen}
            setIsCreateProductModalOpen={setIsCreateProductModalOpen}
          />
        )}

        {isAbastecerModalOpen && (
          <AbastecerInventarioModal
            isAbastecerInventarioModalOpen={isAbastecerModalOpen}
            setIsAbastecerInventarioModalOpen={setIsAbastecerModalOpen}
          />
        )}


      </div>
    </div>
  );
};

export default Container;
