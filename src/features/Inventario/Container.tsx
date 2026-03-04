import style from "./container.module.css";
import { routes } from "../../utils/routes";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { useMemo, useState } from "react";
import stringSimilarity from "string-similarity";
import { useForm } from "../../hooks/useForm";
import borrar from "../../assets/borrar.svg";
import status from "../../assets/status.svg";
import edit from "../../assets/edit.svg";
import enable from "../../assets/enable.svg";

import volver from "../../assets/volver.svg";
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
import SkeletonTable from "../../components/skeleton/SkeletonTable";
import ActualizarProductoModal from "./Modals/ActualizarProducto.modal";
import DeleteProductoModal from "./Modals/DeleteProducto.modal";
import { useUserInfo } from "../../hooks/useUserInfo";
import type { CategoriaDTO } from "../../models/dtos/categoria.dto";

const items = [
  { label: "Dashboard", href: routes.dashboard },
  { label: "Inventario físico", href: routes.InventarioFisico },
];

const menuItems = [
  { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
];

const Container = () => {
  const { usuarioQuery } = useUserInfo();
  const {
    productosQuery,
    valorInventarioFisicoQuery,
    gananciaEstimadaQuery,
    productosAgotadosQuery,
    createExistencias,
    categoriasQuery
  } = useInventario();

  const productos: ProductoRepository[] = productosQuery?.data?.existencias || [];
  const categorias: CategoriaDTO[] = categoriasQuery?.data || [];
  const valorInventarioFisico = valorInventarioFisicoQuery.data?.valor_inventario_fisico || 0;
  const gananciaEstimada = gananciaEstimadaQuery.data?.ganancia_estimada || 0;
  const productosAgotados = productosAgotadosQuery.data?.productos_agotados || 0;

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
    setIsAbastecerModalOpen,
    editProduct,
    setEditProduct,
    deleteProduct,
    setDeleteProduct,
  } = useProductModals();

  // false => mostrar habilitados
  // true  => mostrar inhabilitados
  const [productosInhabilitados, setProductosInhabilitados] = useState(false);

  // ✅ Ajusta reglas si tu estado es diferente (ej: 1 = inhabilitado exacto)
  const productosHabilitados = useMemo(
    () => productos.filter((p) => p.estado === 0),
    [productos]
  );

  const productosInhabilitadosArr = useMemo(
    () => productos.filter((p) => p.estado !== 0),
    [productos]
  );

  // ✅ La tabla se alimenta de esta fuente
  const sourceRows = useMemo(
    () => (productosInhabilitados ? productosInhabilitadosArr : productosHabilitados),
    [productosInhabilitados, productosHabilitados, productosInhabilitadosArr]
  );

  const shortcuts = menuItems.reduce((map, item) => {
    map[item.shortcode] = () => navigate(item.destiny);
    return map;
  }, {} as Record<string, () => void>);

  useShortcuts(shortcuts);

  const openKardexModal = (product: any) => {
    setSelectedProduct(product);
    setIsKardexModalOpen(true);
  };

  const openCreateProductModal = () => setIsCreateProductModalOpen(true);
  const openAbastecerInventarioModal = () => setIsAbastecerModalOpen(true);
  const openAdjustStockModal = () => setIsAdjustStockModalOpen(true);

  const openEditProductModal = (product: any) => {
    setEditProduct(true);
    setSelectedProduct(product);
  };

  const openDeleteProductModal = (product: any) => {
    setDeleteProduct(true);
    setSelectedProduct(product);
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

  // ✅ Buscar SOLO dentro de lo que estás mostrando (habilitados o inhabilitados)
  const filteredRows = useMemo(() => {
    const query = form.query.trim().toLowerCase();
    if (!query) return sourceRows;

    return sourceRows.filter((row: ProductoRepository) => {
      return Object.values(row).some((value) => {
        const text = String(value ?? "").toLowerCase();
        if (text.includes(query)) return true;

        const similarity = stringSimilarity.compareTwoStrings(text, query);
        return similarity > 0.8;
      });
    });
  }, [form.query, sourceRows]);


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
        cantidadInhabilitados={productosInhabilitadosArr.length}
        cantidadHabilitados={productosHabilitados.length}
        productosInhabilitados={productosInhabilitados}
        setProductosInhabilitados={setProductosInhabilitados}
      />

      <div className={style.content}>
        <div className={style.header__container}>
          <div style={{ display: "flex", gap: 20 }}>
            <button className="btn btn_primary" onClick={openCreateProductModal}>
              Crear producto
            </button>
            <button className="btn btn_secondary" onClick={openAbastecerInventarioModal}>
              Abastecer inventario
            </button>
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
          {productosQuery.isLoading ? (
            <SkeletonTable cols={9} rows={5} />
          ) : (
            <Table
              headers={headers}
              data={filteredRows}
              defaultRowsPerPage={5}
              rowsPerPageOptions={[5, 10, 20]}
              renderRow={(row) => {
                const rowValues = [
                  row.codigo,
                  row.nombre,
                  categorias.find((cat) => cat.id_categoria === row.categoria_id)?.nombre || "Sin categoría",
                  row.costo,
                  row.precio_venta,
                  row.cantidad,
                  row.cantidad_minima,
                  row.estado === 1 ? "ACTIVO" : "INHABILITADO",
                ];

                return (
                  <>
                    {rowValues.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                    <td>
                      {
                        productosInhabilitados && (
                          <>
                            <img src={status} onClick={() => openKardexModal(row)} />
                            {row.id_empresa === usuarioQuery.data.empresa.id_empresa && <img src={edit} onClick={() => openEditProductModal(row)} />}
                            <img src={borrar} onClick={() => openDeleteProductModal(row)} />
                          </>
                        )
                      }
                      {!productosInhabilitados && <img src={enable} onClick={() => createExistencias(row, usuarioQuery.data.empresa.id_empresa)} />}
                    </td>
                  </>
                );
              }}
            />
          )}
        </div>

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

        {editProduct && (
          <ActualizarProductoModal
            editProduct={editProduct}
            setEditProduct={setEditProduct}
            setSelectedProduct={setSelectedProduct}
            selectedProduct={selectedProduct}
          />
        )}

        {deleteProduct && (
          <DeleteProductoModal
            isOpen={deleteProduct}
            setIsOpen={setDeleteProduct}
            productoSeleccionado={
              selectedProduct
                ? { id_producto: selectedProduct.id_producto, nombre: selectedProduct.nombre }
                : null
            }
          />
        )}
      </div>
    </div>
  );
};

export default Container;