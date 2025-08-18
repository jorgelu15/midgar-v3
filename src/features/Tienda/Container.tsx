import { useNavigate } from "react-router-dom";
import { routes } from "../../utils/routes";
import style from "./container.module.css";

import volver from "../../assets/volver.svg";
import confirm__wallet from "../../assets/confirm_wallet.svg";
import dcto from "../../assets/dcto.svg";
import trash from "../../assets/borrar.svg";
import consulta from "../../assets/consulta.svg";
import clients from "../../assets/clientes.png";

import CardMenu from "../../components/cards/CardMenu";

import { useForm } from "../../hooks/useForm";
import { useRef, useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import CardProductotienda from "../../components/cards/CardProductoTiendas";
import type { ProductoRepository } from "../../models/Producto.repository";
import CardPOS from "../../components/cards/CardPOS";

interface Cliente {
  cedula: string;
  nombre: string;
}

interface MedioPago {
  nombre: string;
  shortcode: string;
}

interface Pago {
  medio: string;
  monto: number;
}

const menuItems = [
  { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.vender },
  { shortcode: "F1", image: consulta, title: "Consulta", destiny: "" },
  { shortcode: "F2", image: clients, title: "Cliente", destiny: "" },
  { shortcode: "F12", image: confirm__wallet, title: "Totalizar", destiny: "" },
];

const mockProductos: ProductoRepository[] = [
  {
    id_producto: "1",
    codigo: "123",
    nombre: "Coca-Cola 400ml",
    precio_venta: 3500,
    cantidad: 0,
    cantidad_minima: 0,
    categoria_id: 1,
    costo: 2500,
    estado: true,
    foto_url: "https://licoresmedellin.com/cdn/shop/files/GASEOSA_COCA_COLA_ORIGINAL_MEDIANA_1_5L.jpg",
    id_inst: 1,
    impuesto_id: 1,
    marca_id: 1,
    proveedor_id: 1,
    unidad_medida_id: 1
  }
  
];

const mockClientes: Cliente[] = [
  { cedula: "45512237", nombre: "Delia Rosa Romero Florez" },
  { cedula: "12345678", nombre: "Carlos Perez" },
];

const mediosDePago: MedioPago[] = [
  { nombre: "Efectivo", shortcode: "F3" },
  { nombre: "Nequi", shortcode: "F4" },
  { nombre: "Transferencia", shortcode: "F5" },
  { nombre: "Tarjeta", shortcode: "F6" },
  { nombre: "Otro", shortcode: "F7" },
];

const currencyFormat = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
});

const Container = () => {
  const navigate = useNavigate();
  
  const { form, onChangeGeneral, resetForm } = useForm({ codigo: "", valor: "" });

  const [productosFactura, setProductosFactura] = useState<ProductoRepository[]>([]);
  const [ultimoProducto, setUltimoProducto] = useState<ProductoRepository | null>(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [modoBusqueda, setModoBusqueda] = useState<"cliente" | "producto">("cliente");
  const [modoTotalizar, setModoTotalizar] = useState(false);
  const [filtroMedio, setFiltroMedio] = useState("");
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [medioSeleccionado, setMedioSeleccionado] = useState<string | null>(null);
  const [montoMedio, setMontoMedio] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const total = productosFactura.reduce((sum, p) => sum + (p.precio_venta * (p.cantidad || 1)), 0);
  const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
  const faltante = total - totalPagado;

  const handleKeyDown = (e: KeyboardEvent | KeyboardEvent<HTMLDivElement>) => {
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
        if (modoTotalizar && !medioSeleccionado) {
          setModoTotalizar(false);
          setPagos([]);
          setFiltroMedio("");
        } else if (medioSeleccionado) {
          setMedioSeleccionado(null);
          setMontoMedio("");
        } else {
          navigate(routes.vender);
        }
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
        if (!clienteSeleccionado) return alert("Debe seleccionar un cliente");
        if (productosFactura.length === 0) return alert("No hay productos");
        setModoTotalizar(true);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown as any);
    return () => window.removeEventListener("keydown", handleKeyDown as any);
  }, [modoTotalizar, clienteSeleccionado, productosFactura, medioSeleccionado]);

  useEffect(() => {
    if (!modoTotalizar || medioSeleccionado) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [modoBusqueda, modoTotalizar, medioSeleccionado]);

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const input = form.codigo.trim();
    if (!input) return;

    if (modoBusqueda === "cliente") {
      const cliente = mockClientes.find((c) => c.cedula === input);
      if (!cliente) {
        alert("Cliente no encontrado");
      } else {
        setClienteSeleccionado(cliente);
        setModoBusqueda("producto");
      }
      resetForm();
    } else if (modoBusqueda === "producto") {
      const match = input.match(/^([0-9]+)(\*(-?[0-9.]+))?$/);
      if (!match) {
        alert("Formato inválido. Usa: codigo o codigo*cantidad");
        return;
      }

      const codigo = match[1];
      const cantidad = parseFloat(match[3]) || 1;
      const producto = mockProductos.find((p) => p.codigo === codigo);
      if (!producto) {
        alert("Producto no encontrado");
        resetForm();
        return;
      }

      setProductosFactura((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((p) => p.codigo === codigo);
        if (index !== -1) {
          updated[index].cantidad = (updated[index].cantidad || 0) + cantidad;
          if (updated[index].cantidad! <= 0) updated.splice(index, 1);
        } else {
          if (cantidad <= 0) return prev;
          updated.push({ ...producto, cantidad: Number(cantidad) ?? 0 });
        }
        return updated;
      });

      setUltimoProducto({ ...producto, cantidad });
      resetForm();
    }
  };

  const handleBackspace = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && form.codigo === "") {
      setProductosFactura((prev) => {
        const updated = prev.slice(0, -1);
        setUltimoProducto(updated.length ? updated[updated.length - 1] : null);
        return updated;
      });
    }
  };

  const handleAgregarPago = () => {
    const monto = parseFloat(montoMedio);
    if (!medioSeleccionado || isNaN(monto) || monto <= 0) return;
    setPagos([...pagos, { medio: medioSeleccionado, monto }]);
    setMedioSeleccionado(null);
    setMontoMedio("");
  };

  const handleConfirmarVenta = () => {
    if (faltante > 0) return alert("Aún falta dinero para completar la venta");

    const venta = {
      productos: productosFactura,
      cliente: clienteSeleccionado,
      pagos,
      total,
      fecha: new Date().toISOString(),
    };

    console.log("Venta registrada:", venta);
    alert("Venta completada correctamente");
    handleVaciarFactura();
  };

  const handleVaciarFactura = () => {
    setProductosFactura([]);
    setUltimoProducto(null);
    setClienteSeleccionado(null);
    setModoBusqueda("cliente");
    setModoTotalizar(false);
    setPagos([]);
    setMedioSeleccionado(null);
    setMontoMedio("");
    setFiltroMedio("");
  };

  const handleAgregarProducto = (producto: ProductoRepository) => {
    setProductosFactura((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((p) => p.codigo === producto.codigo);
      if (index !== -1) {
        updated[index].cantidad = (updated[index].cantidad || 0) + 1;
      } else {
        updated.push({ ...producto, cantidad: 1 });
      }
      return updated;
    });
    setUltimoProducto({ ...producto, cantidad: 1 });
  };


  return (
    <div className="container" style={{ marginTop: 0 }}>
      <div className={style.container__compact}>
        <div className={style.main}>
          <div className={style.msg__welcome}><h1>Tienda</h1></div>

          {!modoTotalizar && (
            <>
              <div className={style.cards}>
                {menuItems.map((item, index) => (
                  <CardPOS
                    key={index}
                    shortcode={item.shortcode}
                    title={item.title}
                    redirect={() => {
                      if (item.destiny === "consulta") setModoBusqueda("producto");
                      else if (item.destiny === "cliente") setModoBusqueda("cliente");
                      else if (item.destiny === "totalizar") {
                        if (!clienteSeleccionado) return alert("Debe seleccionar un cliente");
                        if (productosFactura.length === 0) return alert("No hay productos");
                        setModoTotalizar(true);
                      } else navigate(item.destiny);
                    }}
                    to={item.destiny}
                    image={item.image}
                  />
                ))}
              </div>

              <div className={style.cards} style={{ gap: 0 }}>
                <div className={style.form_control}>
                  <label>{modoBusqueda === "producto" ? "Código de barras" : "Cédula del cliente"}</label>
                  <input
                    ref={inputRef}
                    type="search"
                    placeholder={modoBusqueda === "producto" ? "Ej: 123*2 o 123*-1" : "Ej: 45512237"}
                    onChange={(e) => onChangeGeneral(e, "codigo")}
                    onKeyDown={(e) => {
                      handleEnter(e);
                      handleBackspace(e);
                    }}
                    value={form.codigo}
                  />
                </div>

                <div className={style.main__content} style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 20, maxHeight: 220, overflowY: "auto" }}>
                  {
                    clienteSeleccionado &&
                    mockProductos?.map((producto: ProductoRepository) => {
                      return (
                        <CardProductotienda
                          {...producto}
                          onClick={() => handleAgregarProducto(producto)}
                        />
                      )
                    })
                  }
                </div>

                <div className={style.info__cliente}>
                  {ultimoProducto && (
                    <div className={style.info__producto}>
                      <p>{ultimoProducto.codigo} - {ultimoProducto.nombre}</p>
                      <div className={style.info__producto__cantidad}>
                        <p>{ultimoProducto.cantidad} UND x {currencyFormat.format(ultimoProducto.precio_venta)}</p>
                        <p>{currencyFormat.format(ultimoProducto.precio_venta * (ultimoProducto.cantidad ?? 1))}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {modoTotalizar && (
            <div className={style.main__content}>
              {!medioSeleccionado ? (
                <>
                  <div className={style.form_control}>
                    <label>Buscar medio de pago</label>
                    <input
                      type="search"
                      placeholder="Ej: Nequi"
                      value={filtroMedio}
                      onChange={(e) => setFiltroMedio(e.target.value)}
                    />
                  </div>

                  <div className={style.cards}>
                    {mediosDePago
                      .filter(mp => mp.nombre.toLowerCase().includes(filtroMedio.toLowerCase()))
                      .map((medio, index) => (
                        <CardPOS
                          key={index}
                          shortcode={medio.shortcode}
                          title={medio.nombre}
                          redirect={() => setMedioSeleccionado(medio.nombre)}
                          image={confirm__wallet}
                          to=""
                        />
                      ))}
                  </div>
                </>
              ) : (
                <div className={style.form_control}>
                  <label>Ingresar monto en {medioSeleccionado}</label>
                  <input
                    ref={inputRef}
                    type="number"
                    placeholder="Ej: 50000"
                    value={montoMedio}
                    onChange={(e) => setMontoMedio(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAgregarPago()}
                  />
                </div>
              )}

              {faltante > 0 && (
                <div className={style.info__cliente}>
                  {ultimoProducto && (
                    <div className={style.info__producto} style={{ alignItems: "end" }}>
                      <p>Total</p>
                      <div className={style.info__producto__cantidad} style={{ justifyContent: "flex-end" }}>
                        <p>{currencyFormat.format(faltante)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {faltante < 0 && (
                <p style={{ color: "#4caf50", marginTop: 10 }}>
                  Vuelto: {currencyFormat.format(-faltante)}
                </p>
              )}

              <CardPOS title="Vender" shortcode="F9" to="" redirect={() => { }} />
            </div>
          )}
        </div>

        <div className={style.facture}>
          <div className={style.facture__controls}>
            <div className={style.btn}><img src={dcto} width={30} /></div>
            <div className={style.btn} onClick={handleVaciarFactura}><img src={trash} /></div>
          </div>

          <div className={style.facture__info}>
            <div className={style.facture__info__subtitle}><h4>Cajero:</h4><p>Jorge Guardo</p></div>
            <div className={style.facture__info__subtitle}>
              <h4>Cliente:</h4>
              {clienteSeleccionado
                ? <p>{clienteSeleccionado.cedula} - {clienteSeleccionado.nombre}</p>
                : <p>Sin cliente seleccionado</p>}
            </div>
          </div>

          <div className={style.facture__content}>
            {productosFactura.map((p: any, i: any) => (
              <div key={i} className={style.facture__content__item}>
                <p className={style.title__item}>{p.nombre}</p>
                <div className={style.facture__content__item__info}>
                  <p>{p.cantidad} UND x {p.precio}</p>
                  <p>{currencyFormat.format(p.precio * p.cantidad)}</p>
                </div>
              </div>
            ))}

            {pagos.length > 0 && pagos.map((p, i) => (
              <div key={i} className={style.facture__content__item}>
                <p className={style.title__item}>Pago con {p.medio}</p>
                <div className={style.facture__content__item__info}>
                  <p>{currencyFormat.format(p.monto)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={style.facture__content__item__info} style={{ padding: "20px" }}>
            <p>Total:</p>
            <p>{currencyFormat.format(total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
