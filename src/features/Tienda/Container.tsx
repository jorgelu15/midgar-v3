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

const menuItems = [
  { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.vender },
  { shortcode: "F1", image: consulta, title: "Consulta", destiny: "" },
  { shortcode: "F2", image: clients, title: "Cliente", destiny: "" },
  { shortcode: "F12", image: confirm__wallet, title: "Totalizar", destiny: "" },
];

const mockProductos = [
  { codigo: "123", nombre: "Coca-Cola 400ml", precio: 3500 },
  { codigo: "456", nombre: "Galletas Festival", precio: 2500 },
  { codigo: "789", nombre: "Chocoramo", precio: 3000 },
];

const mockClientes = [
  { cedula: "45512237", nombre: "Delia Rosa Romero Florez" },
  { cedula: "12345678", nombre: "Carlos Perez" },
];

const currencyFormat = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP"
});

const Container = () => {
  const navigate = useNavigate();

  const { form, onChangeGeneral, resetForm } = useForm({
    codigo: "",
    valor: ""
  });

  const [productosFactura, setProductosFactura] = useState<any>([]);
  const [ultimoProducto, setUltimoProducto] = useState<any>(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
  const [modoBusqueda, setModoBusqueda] = useState<"cliente" | "producto">("cliente");

  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      switch (e.code) {
        case "Escape":
          e.preventDefault();
          navigate(routes.vender);
          break;
        case "F1":
          e.preventDefault();
          if (clienteSeleccionado) setModoBusqueda("producto");
          break;
        case "F2":
          e.preventDefault();
          setModoBusqueda("cliente");
          break;
        case "F12":
          e.preventDefault();
          handleTotalizar();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productosFactura, clienteSeleccionado]);

  const handleEnter = (e: any) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const input = form.codigo.trim();
    if (!input) return;

    if (modoBusqueda === "cliente") {
      const cliente = mockClientes.find(c => c.cedula === input);
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
      const producto = mockProductos.find(p => p.codigo === codigo);
      if (!producto) {
        alert("Producto no encontrado");
        resetForm();
        return;
      }

      setProductosFactura((prev: any) => {
        const updated = [...prev];
        const index = updated.findIndex(p => p.codigo === codigo);
        if (index !== -1) {
          updated[index].cantidad += cantidad;
          if (updated[index].cantidad <= 0) updated.splice(index, 1);
        } else {
          if (cantidad <= 0) return prev;
          updated.push({ ...producto, cantidad });
        }
        return updated;
      });
      setUltimoProducto({ ...producto, cantidad });
      resetForm();
    }
  };

  const handleBackspace = (e: any) => {
    if (e.key === "Backspace" && form.codigo === "") {
      setProductosFactura((prev: any) => {
        const updated = prev.slice(0, -1);
        setUltimoProducto(updated.length ? updated[updated.length - 1] : null);
        return updated;
      });
    }
  };

  const total = productosFactura.reduce((sum: any, p: any) => sum + p.precio * p.cantidad, 0);

  const handleVaciarFactura = () => {
    setProductosFactura([]);
    setUltimoProducto(null);
    setClienteSeleccionado(null);
    setModoBusqueda("cliente");
  };

  const handleTotalizar = () => {
    if (productosFactura.length === 0) return alert("No hay productos");
    if (!clienteSeleccionado) return alert("Debe seleccionar un cliente");

    const venta = {
      productos: productosFactura,
      cliente: clienteSeleccionado,
      total,
      fecha: new Date().toISOString(),
    };
    console.log("Venta totalizada:", venta);
    handleVaciarFactura();
    alert("Venta registrada con " + clienteSeleccionado.nombre);
  };

  return (
    <div className="container" style={{ marginTop: 0 }}>
      <div className={style.container__compact}>
        <div className={style.main}>
          <div className={style.msg__welcome}>
            <h1>Tienda</h1>
          </div>

          <div className={style.cards}>
            {menuItems.map((item, index) => (
              <CardMenu
                key={index}
                shortcode={item.shortcode}
                title={item.title}
                redirect={() => {
                  if (item.destiny === "consulta") setModoBusqueda("producto");
                  else if (item.destiny === "cliente") setModoBusqueda("cliente");
                  else if (item.destiny === "totalizar") handleTotalizar();
                  else navigate(item.destiny);
                }}
                to={item.destiny}
                image={item.image}
              />
            ))}
          </div>

          <div className={style.main__content}>
            <div className={style.form_control}>
              <label>{modoBusqueda === "producto" ? "Código de barras" : "Cédula del cliente"}</label>
              <input
                ref={inputRef}
                type="search"
                placeholder={modoBusqueda === "producto" ? "Ej: 123*2 o 123*-1" : "Ej: 45512237"}
                onChange={(e) => onChangeGeneral(e, "codigo")}
                onKeyDown={(e) => { handleEnter(e); handleBackspace(e); }}
                value={form.codigo}
              />
            </div>

            <div className={style.info__cliente}>
              {ultimoProducto && (
                <div className={style.info__producto}>
                  <p>{ultimoProducto.codigo} - {ultimoProducto.nombre}</p>
                  <div className={style.info__producto__cantidad}>
                    <p>{ultimoProducto.cantidad} UND x {currencyFormat.format(ultimoProducto.precio)}</p>
                    <p>{currencyFormat.format(ultimoProducto.precio * ultimoProducto.cantidad)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={style.facture}>
          <div className={style.facture__controls}>
            <div className={style.btn}><img src={dcto} width={30} /></div>
            <div className={style.btn} onClick={handleVaciarFactura}><img src={trash} /></div>
          </div>

          <div className={style.facture__info}>
            <div className={style.facture__info__subtitle}>
              <h4>Cajero:</h4><p>Jorge Guardo</p>
            </div>
            <div className={style.facture__info__subtitle}>
              <h4>Cliente:</h4>
              {clienteSeleccionado ? (
                <p>{clienteSeleccionado.cedula} - {clienteSeleccionado.nombre}</p>
              ) : (
                <p>Sin cliente seleccionado</p>
              )}
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
