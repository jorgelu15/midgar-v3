import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Modal from "../../components/modales/Modal";
import SelectSearch from "../../components/selects/SelectSearch";
import { useProductModals } from "../../hooks/useProductModals";
import CardCuentaLavado from "../../components/cards/CardCuentaLavado";
import style from "./container.module.css";
import CardProductotienda from "../../components/cards/CardProductoTiendas";
import { useCuenta } from "../../hooks/useCuenta";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useTheme } from "../../context/ThemeContext/ThemeContext";
import type { ProductoRepository } from "../../models/Producto.repository";
import { useForm } from "../../hooks/useForm";
import { useUserInfo } from "../../hooks/useUserInfo";
import { useInventario } from "../../hooks/useInventario";
import { useQueryClient } from "@tanstack/react-query";
import CardPOS from "../../components/cards/CardPOS";
import confirm__wallet from "../../assets/confirm_wallet.svg";


// Interfaces
// interface ProductoRepository {
//     codigo: string;
//     nombre: string;
//     precio_venta: number;
//     cantidad?: number;
// }

interface CuentaLavado {
    id_cuenta_cliente: string;
    nombreCliente: string;
    placa: string;
    lavador: string;
    sala: string;
    productos: ProductoRepository[];
}

const Container = () => {
    const {
        abrirCuenta,
        setAbrirCuenta,
        openModalCuenta,
        setOpenModalCuenta
    } = useProductModals();

    const { theme } = useTheme();

    // const { usuario } = useAuth();
    const { usuarioQuery, lavadoresQuery } = useUserInfo();
    const { productosQuery } = useInventario();

    const [progress, setProgress] = useState<number | null>(null);

    const [clienteNombre, setClienteNombre] = useState("");
    const [placa, setPlaca] = useState("");
    const [lavador, setLavador] = useState({ label: "", value: "" });
    const [sala, setSala] = useState({ label: "", value: "" });
    const [totatilizar, setTotatilizar] = useState(false);

    const [medioSeleccionado, setMedioSeleccionado] = useState<string | null>(null);
    const [filtroMedio, setFiltroMedio] = useState("");
    const [montoMedio, setMontoMedio] = useState("");
    const [pagos, setPagos] = useState<{ medio: string; monto: number }[]>([]);

    const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaLavado | null>(null);
    const [productosFactura, setProductosFactura] = useState<ProductoRepository[]>([]);
    const [ultimoProducto, setUltimoProducto] = useState<ProductoRepository | null>(null);
    const { form, onChangeGeneral, resetForm } = useForm({ codigo: "" });

    const { cuentasQuery, cuentaByIdiDQuery, createCuenta, agregarProductoCuenta, cancelarCuenta } = useCuenta(cuentaSeleccionada?.id_cuenta_cliente || null);

    const queryClient = useQueryClient();
    // Sincroniza productos de cuentaSeleccionada en cuentasQuery (React Query)
    // Se ejecuta cada vez que cambia cuentaSeleccionada
    useEffect(() => {
        if (!cuentaSeleccionada) return;
        queryClient.setQueryData(
            ["cuenta_cliente", usuarioQuery.data?.cliente.id_cliente],
            (oldData: any) => {
                if (!oldData) return oldData;
                return oldData.map((cuenta: any) =>
                    cuenta.id_cuenta_cliente === cuentaSeleccionada.id_cuenta_cliente
                        ? { ...cuenta, productos: cuentaSeleccionada.productos }
                        : cuenta
                );
            }
        );
    }, [cuentaSeleccionada, queryClient, usuarioQuery.data?.cliente.id_cliente]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    // Lista de medios de pago disponibles
    const mediosDePago = [
        { nombre: "Efectivo", shortcode: "F1" },
        { nombre: "Nequi", shortcode: "F2" },
        { nombre: "Daviplata", shortcode: "F3" },
        { nombre: "Tarjeta Débito", shortcode: "F4" },
        { nombre: "Tarjeta Crédito", shortcode: "F5" }
    ];

    
    const openCuentaModal = () => setAbrirCuenta(true);
    const closeCuentaModal = () => setAbrirCuenta(false);

    const openCuentaLavadoModal = () => setOpenModalCuenta(true);
    const closeCuentaLavadoModal = () => {
        if (cuentaSeleccionada)
            cancelarCuenta(cuentaSeleccionada.id_cuenta_cliente as unknown as number, usuarioQuery?.data.cliente.id_cliente)
                .then((response: any) => {
                    if (response.status === 200) {
                        setProductosFactura([]);
                        setUltimoProducto(null);
                        setCuentaSeleccionada(null);
                        toast.success("Cuenta cancelada");
                        queryClient.invalidateQueries({ queryKey: ["cuenta_cliente", usuarioQuery.data?.cliente.id_cliente] });
                        setOpenModalCuenta(false);
                    } else {
                        toast.error("Error al cancelar cuenta");
                    }
                })
                .catch((error: any) => {
                    toast.error("Error al cancelar cuenta");
                });
    }

    const handleAgregarProducto = async (producto: ProductoRepository) => {
        // Copia del estado actual
        let updated = [...cuentaSeleccionada?.productos || []];

        const index = updated.findIndex((p) => p.codigo === producto.codigo);
        let cantidadFinal = 1;

        if (index !== -1) {
            updated[index].cantidad = (updated[index].cantidad || 0) + 1;
            cantidadFinal = updated[index].cantidad;
        } else {
            updated.push({ ...producto, cantidad: 1 });
            if (cuentaSeleccionada)
                setCuentaSeleccionada({
                    ...cuentaSeleccionada,
                    productos: [...cuentaSeleccionada?.productos, { ...producto, cantidad: 1 }]
                });
        }

        // Llamada a la API antes de setear el estado
        const res = await agregarProductoCuenta(
            producto.id_producto,
            cantidadFinal,
            usuarioQuery?.data.cliente.id_cliente,
            cuentaSeleccionada?.id_cuenta_cliente,
            setProgress
        );

        if (res.status === 200) {
            setProductosFactura(updated);
            setUltimoProducto({ ...producto, cantidad: cantidadFinal });
        } else {
            console.log("Error al agregar producto");
        }
    };

    const handleAgregarCuenta = (event: React.FormEvent) => {
        event.preventDefault();

        if (clienteNombre.trim() === "" || placa.trim() === "" || lavador.value === "" || sala.value === "") {
            toast.error(`Faltan campos obligatorios.`);
            return;
        }

        // Crear objeto cuenta
        const cuenta = {
            nombre: clienteNombre,
            placa: placa,
            lavador: lavador.value,
            sala: sala.value,
            productos: productosFactura
        };

        createCuenta(cuenta, usuarioQuery?.data.cliente.id_cliente, setProgress).then((response: any) => {
            if (response.status !== 200) return;
            setClienteNombre("");
            setPlaca("");
            setLavador({ label: "", value: "" });
            setSala({ label: "", value: "" });
            setProductosFactura([]);
            setUltimoProducto(null);
            setCuentaSeleccionada(response.data.cuenta);
            queryClient.invalidateQueries({ queryKey: ["cuenta_cliente", usuarioQuery.data?.cliente.id_cliente] });
            toast.success(response.data.message);
            closeCuentaModal();
            openCuentaLavadoModal();
        }).catch((error: any) => {
            toast.error(error.error);
            setProgress(null);
        });
    };

    const handleEnter = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        e.preventDefault();

        const input = form.codigo.trim();
        if (!input) return;

        const match = input.match(/^([0-9]+)(\*(-?[0-9.]+))?$/);
        if (!match) {
            alert("Formato inválido. Usa: codigo o codigo*cantidad");
            return;
        }

        const codigo = match[1];
        const cantidadIngresada = parseFloat(match[3]) || 1;
        const producto = productosQuery.data?.find((p: any) => p.codigo === codigo);
        if (!producto) {
            alert("Producto no encontrado");
            resetForm();
            return;
        }

        let updated = [...cuentaSeleccionada?.productos || []];
        const index = updated.findIndex((p) => p.codigo === codigo);
        let cantidadFinal = cantidadIngresada;

        if (index !== -1) {
            updated[index].cantidad = (updated[index].cantidad || 0) + cantidadIngresada;
            cantidadFinal = updated[index].cantidad;
            console.log("antes", updated);
            if (cantidadFinal <= 0) updated.splice(index, 1);
            console.log("después", updated);
        } else {
            if (cantidadIngresada <= 0) return;
            updated.push({ ...producto, cantidad: Number(cantidadIngresada) ?? 0 });
        }

        // Llamada async antes de hacer setState
        const res = await agregarProductoCuenta(
            producto.id_producto,
            cantidadFinal,
            usuarioQuery?.data.cliente.id_cliente,
            cuentaSeleccionada?.id_cuenta_cliente,
            setProgress
        );

        // Ahora sí, actualizar en función de la respuesta
        if (res.status === 200) {
            // setProductosFactura(updated);

            if (cuentaSeleccionada)
                setCuentaSeleccionada({
                    ...cuentaSeleccionada,
                    productos: updated
                });
            resetForm();
            // Aquí podrías hacer algo con la cuenta actualizada, como mostrar un mensaje o actualizar el estado
        } else {
            console.log("Error agregando producto");
        }
        setUltimoProducto({ ...producto, cantidad: cantidadIngresada });
        resetForm();
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

    const currencyFormat = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP"
    });

    const total = cuentaSeleccionada?.productos.reduce((acc, p) => acc + (p.precio_venta * (p.cantidad || 1)), 0) || 0;

    const totalPagado = pagos.reduce((acc, p) => acc + p.monto, 0);
    const faltante = total - totalPagado;

    // Función para agregar un pago
    const handleAgregarPago = () => {
        if (!medioSeleccionado || !montoMedio) return;

        const monto = parseFloat(montoMedio);
        if (isNaN(monto) || monto <= 0) {
            toast.error("Monto inválido");
            return;
        }

        setPagos([...pagos, { medio: medioSeleccionado, monto }]);
        setMontoMedio("");
        setMedioSeleccionado(null);
        inputRef.current?.focus();
    };

    const opciones = [
        { label: "Lavador 1", value: "1" },
        { label: "Lavador 2", value: "2" },
        { label: "Sala A", value: "A" },
        { label: "Sala B", value: "B" }
    ];



    return (
        <div className="container" style={{ marginTop: 0 }}>
            <header className={style.header}>
                <h1>Autolavado</h1>
                <nav>
                    <a className="btn btn_primary" onClick={openCuentaModal}>Abrir Cuenta (1)</a>
                    <a className="btn btn_secondary">Volver (ESC)</a>
                </nav>
            </header>
            <div className={style.gridContainer}>
                {cuentasQuery.isLoading && <p>Cargando cuentas...</p>}
                {cuentasQuery.isError && <p>Error al cargar las cuentas</p>}
                {cuentasQuery?.data && cuentasQuery.data.map((cuenta: any) => (
                    <CardCuentaLavado
                        key={cuenta.id_cuenta_cliente}
                        nombreCliente={cuenta.nombre}
                        placa={cuenta.placa}
                        lavador={cuenta.lavador?.nombre ?? ""}
                        sala={cuenta.sala}
                        ingreso={new Date(cuenta.ingreso).toLocaleString("es-CO", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                        productos={cuenta.productos || []}
                        onClick={() => {
                            setCuentaSeleccionada(cuenta);
                            openCuentaLavadoModal();
                        }}
                    />
                ))}
            </div>
            {/* MODAL 1: Abrir cuenta */}
            <Modal
                isOpen={abrirCuenta}
                onClose={closeCuentaModal}
                title="Abrir cuenta"
                size="md"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn btn_secondary" onClick={closeCuentaModal}>
                            Cancelar
                        </button>
                        <button
                            className="btn btn_primary"
                            onClick={(e) => {
                                handleAgregarCuenta(e);
                            }}
                        >
                            Confirmar cuenta
                        </button>
                    </div>
                }
            >
                <div className={style.form_control}>
                    <label>Nombre del cliente*</label>
                    <input
                        type="text"
                        name="cliente"
                        placeholder="Ej: Jorge Guardo"
                        value={clienteNombre}
                        onChange={(e) => setClienteNombre(e.target.value)}
                        required
                    />
                </div>
                <div className={style.form_control}>
                    <label>Placa*</label>
                    <input
                        type="text"
                        name="placa"
                        placeholder="Ej: UAI166"
                        value={placa}
                        onChange={(e) => setPlaca(e.target.value)}
                        required
                    />
                </div>
                <div className={style.form_control}>
                    <label>Lavador*</label>
                    <SelectSearch
                        options={lavadoresQuery.data?.map((lavador: any) => ({ label: lavador.nombre, value: lavador.id_usuario })) ?? []}
                        value={lavador}
                        onSelect={(option) => setLavador({ label: option.label, value: option.value.toString() })}
                    />
                </div>
                <div className={style.form_control}>
                    <label>Sala*</label>
                    <SelectSearch
                        options={opciones.filter(o => o.label.includes("Sala"))}
                        value={sala}
                        onSelect={(option) => setSala({ label: option.label, value: option.value.toString() })}
                    />
                </div>
            </Modal>

            {/* MODAL 2: Cuenta abierta */}
            <Modal
                isOpen={openModalCuenta}
                onClose={() => setOpenModalCuenta(false)}
                title="Cuenta Lavado"
                size="lg"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn btn_secondary" onClick={closeCuentaLavadoModal}>
                            Cancelar Cuenta
                        </button>
                        <button className="btn btn_primary" onClick={() => setTotatilizar(true)}>
                            Totalizar
                        </button>
                    </div>
                }
            >
                {totatilizar === false && (
                    <div className={style.container__compact}>
                        <div className={style.main__modal}>
                            <div className={style.cards} style={{ gap: 0 }}>
                                <div className={style.form_control}>
                                    <label>Código de barras</label>
                                    <input type="search" onChange={(e) => onChangeGeneral(e, "codigo")}
                                        onKeyDown={(e) => {
                                            handleEnter(e);
                                            handleBackspace(e);
                                        }}
                                        value={form.codigo} />
                                </div>

                            </div>
                            <div className={style.cards} style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 20, maxHeight: 220, overflowY: "auto" }}>
                                {productosQuery.data?.map((producto: any) => (
                                    <CardProductotienda
                                        key={producto.codigo}
                                        {...producto}
                                        onClick={() => handleAgregarProducto(producto)}
                                    />
                                ))}
                            </div>
                            <div style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
                                <p><strong>Total:</strong></p>
                                <p><strong>{currencyFormat.format(total ?? 0)}</strong></p>
                            </div>

                        </div>
                        <div className={style.facture}>

                            {
                                cuentaSeleccionada?.productos.map((p: any, i: any) => (
                                    p.cantidad > 0 && <div key={i} className={style.facture__content__item}>
                                        <p className={style.title__item}>{p.nombre}</p>
                                        <div className={style.facture__content__item__info}>
                                            <p>{p.cantidad} UND x {p.precio_venta}</p>
                                            <p>{currencyFormat.format(p.precio_venta * p.cantidad)}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}

                {totatilizar === true && (
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

                        {/* Lista de pagos agregados */}
                        <div className={style.pagos_list}>
                            {pagos.map((p, i) => (
                                <div key={i} className={style.info__producto}>
                                    <p>{p.medio}</p>
                                    <p>{currencyFormat.format(p.monto)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Mostrar faltante o vuelto */}
                        {faltante > 0 && (
                            <p style={{ color: "#f44336", marginTop: 10 }}>
                                Faltante: {currencyFormat.format(faltante)}
                            </p>
                        )}
                        {faltante < 0 && (
                            <p style={{ color: "#4caf50", marginTop: 10 }}>
                                Vuelto: {currencyFormat.format(-faltante)}
                            </p>
                        )}

                        {faltante === 0 && total > 0 && (
                            <button className="btn btn_success" onClick={() => toast.success("Venta finalizada")}>
                                Confirmar Venta
                            </button>
                        )}
                    </div>
                )}

            </Modal>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme}
                transition={Bounce}
            />
        </div>
    );
};

export default Container;
