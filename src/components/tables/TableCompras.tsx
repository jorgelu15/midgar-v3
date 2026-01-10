import React, { useState } from "react";
import Table from "./Table";
import style from "./table.module.css";
import { useInventario } from "../../hooks/useInventario";
import borrar from "../../assets/borrar.svg";
interface Producto {
  id: number;
  nombre: string;
  costo: number;
  descuento: number;
  impuesto: number;
  cantidad: number;
  observaciones: string;
}

const TableCompras: React.FC<any> = ({ productos, setProductos }) => {
  const [codigoBusqueda, setCodigoBusqueda] = useState("");

  const { productosQuery } = useInventario();
  const productosDisponibles = productosQuery.data?.existencias || [];

  /* ============================
     AGREGAR POR CÓDIGO (ENTER)
  ============================ */
  const agregarPorCodigo = (codigo: string) => {
    const code = codigo.trim();
    if (code.length < 1) return;

    const productoEncontrado = productosDisponibles.find(
      (p: any) => String(p.codigo) === String(code)
    );

    if (!productoEncontrado) return;

    const yaExiste = productos.some(
      (p: any) => p.id === productoEncontrado.id_producto
    );
    if (yaExiste) {
      setCodigoBusqueda("");
      return;
    }

    setProductos((prev: any) => [
      ...prev,
      {
        id_producto: productoEncontrado.id_producto,
        nombre: productoEncontrado.nombre,
        costo: Number(productoEncontrado.costo),
        descuento: 0,
        impuesto: 0,
        cantidad: 1,
        observaciones: "",
      },
    ]);

    setCodigoBusqueda("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigoBusqueda(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      agregarPorCodigo(codigoBusqueda);
    }
  };

  /* ============================
     ELIMINAR PRODUCTO
  ============================ */
  const eliminarProducto = (id: number) => {
    setProductos((prev: any) => prev.filter((p: any) => p.id !== id));
  };

  /* ============================
     EDITAR CAMPOS
  ============================ */
  const actualizarCampo = (
    id: number,
    campo: keyof Producto,
    valor: string | number
  ) => {
    setProductos((prev: any) =>
      prev.map((prod: any) =>
        prod.id === id
          ? {
              ...prod,
              [campo]:
                campo === "nombre" || campo === "observaciones"
                  ? valor
                  : Number(valor),
            }
          : prod
      )
    );
  };

  const calcularTotal = (p: Producto) =>
    ((p.costo - p.descuento + p.impuesto) * p.cantidad).toFixed(2);

  /* ============================
     TABLA
  ============================ */
  const headers = [
    "Producto",
    "Precio",
    "Descuento %",
    "Impuesto",
    "Cantidad",
    "Observaciones",
    "Total",
    "Acciones",
  ];

  const renderRow = (prod: Producto) => (
    <>
      <td>
        <input
          value={prod.nombre}
          onChange={(e) =>
            actualizarCampo(prod.id, "nombre", e.target.value)
          }
          className={style.input}
        />
      </td>
      <td>
        <input
          type="number"
          value={prod.costo}
          onChange={(e) =>
            actualizarCampo(prod.id, "costo", e.target.value)
          }
          className={style.input}
        />
      </td>
      <td>
        <input
          type="number"
          value={prod.descuento}
          onChange={(e) =>
            actualizarCampo(prod.id, "descuento", e.target.value)
          }
          className={style.input}
        />
      </td>
      <td>
        <input
          type="number"
          value={prod.impuesto}
          onChange={(e) =>
            actualizarCampo(prod.id, "impuesto", e.target.value)
          }
          className={style.input}
        />
      </td>
      <td>
        <input
          type="number"
          value={prod.cantidad}
          onChange={(e) =>
            actualizarCampo(prod.id, "cantidad", e.target.value)
          }
          className={style.input}
        />
      </td>
      <td>
        <input
          value={prod.observaciones}
          onChange={(e) =>
            actualizarCampo(prod.id, "observaciones", e.target.value)
          }
          className={style.input}
        />
      </td>
      <td>${calcularTotal(prod)}</td>
      <td>
        <button
          onClick={() => eliminarProducto(prod.id)}
          style={{
            background: "transparent",
            border: "none",
            color: "#e74c3c",
            cursor: "pointer",
            fontSize: "18px",
          }}
          title="Eliminar producto"
        >
          <img src={borrar} alt="eliminar" />
        </button>
      </td>
    </>
  );

  return (
    <div>
      <div className={style.searchContainer}>
        <input
          type="text"
          placeholder="Escanea o escribe código de barras"
          value={codigoBusqueda}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={style.input}
        />
      </div>

      {productos.length > 0 && (
        <Table
          headers={headers}
          data={productos}
          renderRow={(prod: any) => renderRow(prod)}
        />
      )}
    </div>
  );
};

export default TableCompras;
