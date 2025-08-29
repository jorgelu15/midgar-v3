import React, { useState } from "react";
import Table from "./Table";
import style from "./table.module.css";
import { useInventario } from "../../hooks/useInventario";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descuento: number;
  impuesto: number;
  cantidad: number;
  observaciones: string;
}

const productosDisponibles: Producto[] = [
  {
    id: 1,
    nombre: "Arroz Diana 1Kg",
    precio: 4500,
    descuento: 0,
    impuesto: 0,
    cantidad: 1,
    observaciones: "",
  },
  {
    id: 2,
    nombre: "Aceite Girasol 900ml",
    precio: 9800,
    descuento: 0,
    impuesto: 0,
    cantidad: 1,
    observaciones: "",
  },
];

const codigosBarras: Record<string, number> = {
  "7701234567890": 1,
  "7709876543210": 2,
};

const TableCompras: React.FC<any> = ( { productos, setProductos } ) => {
  // const [productos, setProductos] = useState<Producto[]>([]);
  const [codigoBusqueda, setCodigoBusqueda] = useState("");

  const { productosQuery } = useInventario();


  const handleBuscarPorCodigo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const codigo = e.target.value;
    setCodigoBusqueda(codigo);

    // if (codigo.length >= 6 && codigosBarras[codigo]) {
    //   const id = codigosBarras[codigo];
    //   const productoEncontrado = productosDisponibles.find((p) => p.id === id);

    //   if (productoEncontrado) {
    //     const yaExiste = productos.some((p) => p.nombre === productoEncontrado.nombre);
    //     if (!yaExiste) {
    //       setProductos((prev) => [
    //         ...prev,
    //         {
    //           ...productoEncontrado,
    //           id: Date.now(),
    //         },
    //       ]);
    //       setCodigoBusqueda("");
    //     }
    //   }
    // }
    if (codigo.length >= 3) {
      const productoEncontrado = productosQuery.data?.find((p: any) => p.codigo === codigo);
      const resultado = productoEncontrado
        ? [{
          id: productoEncontrado.id_producto,
          nombre: productoEncontrado.nombre,
          precio: productoEncontrado.costo,
          descuento: 0,
          impuesto: 0,
          cantidad: productoEncontrado.cantidad,
          observaciones: "",
        }]
        : [];
      if (productoEncontrado) {
        const yaExiste = productos.some((p: any) => p.nombre === productoEncontrado.nombre);
        if (!yaExiste) {
          setProductos((prev: any) => [
            ...prev,
            {
              ...resultado[0],
            },
          ]);
          setCodigoBusqueda("");
        }
      }
    }
  };

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
                : parseFloat(valor as string),
          }
          : prod
      )
    );
  };

  const calcularTotal = (p: Producto) =>
    ((p.precio - p.descuento + p.impuesto) * p.cantidad).toFixed(2);

  const headers = [
    "Producto",
    "Precio",
    "Descuento %",
    "Impuesto",
    "Cantidad",
    "Observaciones",
    "Total",
  ];

  const renderRow = (prod: Producto) => (
    <>
      <td>
        <input
          value={prod.nombre}
          onChange={(e) => actualizarCampo(prod.id, "nombre", e.target.value)}
          className={style.input}
        />
      </td>
      <td>
        <input
          type="number"
          value={prod.precio}
          onChange={(e) => actualizarCampo(prod.id, "precio", e.target.value)}
          className={style.input}
        />
      </td>
      <td>
        <input
          type="number"
          value={prod.descuento}
          onChange={(e) => actualizarCampo(prod.id, "descuento", e.target.value)}
          className={style.input}
        />
      </td>
      <td>
        <input
          type="number"
          value={prod.impuesto}
          onChange={(e) => actualizarCampo(prod.id, "impuesto", e.target.value)}
          className={style.input}
        />
      </td>
      <td>
        <input
          type="number"
          value={prod.cantidad}
          onChange={(e) => actualizarCampo(prod.id, "cantidad", e.target.value)}
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
    </>
  );

  return (
    <div>
      <div className={style.searchContainer}>
        <input
          type="text"
          placeholder="Escanea o escribe código de barras"
          value={codigoBusqueda}
          onChange={handleBuscarPorCodigo}
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
