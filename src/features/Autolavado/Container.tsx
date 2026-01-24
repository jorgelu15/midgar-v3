import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Modal from "../../components/modales/Modal";
import SelectSearch from "../../components/selects/SelectSearch";
import { useProductModals } from "../../hooks/useProductModals";
import CardCuentaLavado from "../../components/cards/CardCuentaLavado";
import style from "./container.module.css";
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
import { useShortcuts } from "../../hooks/useShortcodes";
import { routes } from "../../utils/routes";
import { useNavigate } from "react-router-dom";
import Receipt from "./receipt/Receipt";
import { useReactToPrint } from "react-to-print";


interface CuentaLavado {
    id_cuenta_cliente: string;
    nombre: string;
    placa: string;
    lavador: string;
    sala: string;
    productos: ProductoRepository[];
}

interface MedioPago {
    id_medio_pago: number;
    nombre: string;
    shortcode: string;
}



const Container = () => {
    const {
        abrirCuenta,
        setAbrirCuenta,
        openModalCuenta,
        setOpenModalCuenta,
        setGenerateReceipt,
        generateReceipt
    } = useProductModals();

    const { theme } = useTheme();
    const navigate = useNavigate()

    const { usuarioQuery, lavadoresQuery } = useUserInfo();
    const { productosQuery } = useInventario();
    const [progress, setProgress] = useState<number | null>(null);
    console.log(progress)
    const [clienteNombre, setClienteNombre] = useState("");
    const [placa, setPlaca] = useState("");
    const [lavador, setLavador] = useState({ label: "", value: "" });
    const [servicio, setServicio] = useState({ label: "", value: "" });
    const [sala, setSala] = useState({ label: "", value: "" });
    const [totatilizar, setTotatilizar] = useState(false);

    const [medioSeleccionado, setMedioSeleccionado] = useState<MedioPago | null>(null);
    const [filtroMedio, setFiltroMedio] = useState("");
    const [montoMedio, setMontoMedio] = useState("");
    const [pagos, setPagos] = useState<{ id: number; medio: string; monto: number }[]>([]);

    const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaLavado | null>(null);
    const [productosFactura, setProductosFactura] = useState<ProductoRepository[]>([]);
    const [ultimoProducto, setUltimoProducto] = useState<ProductoRepository | null>(null);
    console.log(ultimoProducto)
    const { form, onChangeGeneral, resetForm } = useForm({ codigo: "" });
    const { cuentasQuery,
        metodosPagoQuery,
        createCuenta,
        agregarProductoCuenta,
        cancelarCuenta,
        cerrarCuenta,
        descargarInventario
    } = useCuenta(cuentaSeleccionada?.id_cuenta_cliente || null);
    const ticketRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    // Sincroniza productos de cuentaSeleccionada en cuentasQuery (React Query)
    // Se ejecuta cada vez que cambia cuentaSeleccionada

    useEffect(() => {
        if (!cuentaSeleccionada) return;
        queryClient.setQueryData(
            ["cuenta_cliente", usuarioQuery.data?.empresa.id_empresa],
            (oldData: any) => {
                if (!oldData) return oldData;
                return oldData.map((cuenta: any) =>
                    cuenta.id_cuenta_cliente === cuentaSeleccionada.id_cuenta_cliente
                        ? { ...cuenta, productos: cuentaSeleccionada.productos }
                        : cuenta
                );
            }
        );
    }, [cuentaSeleccionada, queryClient, usuarioQuery.data?.empresa.id_empresa]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const openCuentaModal = () => setAbrirCuenta(true);
    const closeCuentaModal = () => setAbrirCuenta(false);

    const openGenerarReciboModal = () => setGenerateReceipt(true);
    const closeGenerarReciboModal = () => {
        setProductosFactura([]);
        setUltimoProducto(null);
        setCuentaSeleccionada(null);
        setPagos([]);
        setTotatilizar(false);
        setMedioSeleccionado(null);
        setMontoMedio("");
        setGenerateReceipt(false);
    }

    const openCuentaLavadoModal = () => setOpenModalCuenta(true);
    const closeCuentaLavadoModal = () => {
        setOpenModalCuenta(false);
        setMedioSeleccionado(null);
        setMontoMedio("");
        setPagos([]);
        setTotatilizar(false);
    }
    const handlerCancelarCuenta = () => {
        if (cuentaSeleccionada)
            cancelarCuenta(cuentaSeleccionada.id_cuenta_cliente as unknown as number, usuarioQuery?.data.empresa?.id_empresa)
                .then((response: any) => {
                    if (response.status === 200) {
                        setProductosFactura([]);
                        setUltimoProducto(null);
                        setCuentaSeleccionada(null);
                        toast.success("Cuenta cancelada");
                        queryClient.invalidateQueries({ queryKey: ["cuenta_cliente", usuarioQuery.data?.empresa.id_empresa] });
                        setOpenModalCuenta(false);
                    } else {
                        toast.error("Error al cancelar cuenta");
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                    toast.error("Error al cancelar cuenta");
                });
    }

    const handleAgregarCuenta = (event: React.FormEvent) => {
        event.preventDefault();

        if (clienteNombre.trim() === "" || placa.trim() === "" || lavador.value === "" || sala.value === "" || servicio.value === "") {
            toast.error(`Faltan campos obligatorios.`);
            return;
        }

        // Crear objeto cuenta
        const cuenta = {
            nombre: clienteNombre,
            placa: placa,
            id_usuario: lavador.value,
            sala: sala.value,
            productos: productosFactura,
            servicio: servicio.value
        };

        createCuenta(cuenta, usuarioQuery?.data?.empresa.id_empresa, setProgress).then((response: any) => {
            if (response.status !== 200) return;
            setClienteNombre("");
            setPlaca("");
            setLavador({ label: "", value: "" });
            setSala({ label: "", value: "" });
            setProductosFactura([]);
            setUltimoProducto(null);
            setCuentaSeleccionada(response.data.cuenta);
            queryClient.invalidateQueries({ queryKey: ["cuenta_cliente", usuarioQuery.data?.empresa.id_empresa] });
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
        const producto = productosQuery.data?.existencias.find((p: any) => p.codigo === codigo);
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
            if (cantidadFinal <= 0) updated.splice(index, 1);
        } else {
            if (cantidadIngresada <= 0) return;
            updated.push({ ...producto, cantidad: Number(cantidadIngresada) ?? 0 });
        }

        // Llamada async antes de hacer setState
        const res = await agregarProductoCuenta(
            producto.id_producto,
            cantidadFinal,
            usuarioQuery?.data?.empresa?.id_empresa,
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

    const productosCuenta = cuentaSeleccionada?.productos ?? [];
    const total = productosCuenta.reduce(
        (acc, p) => acc + (Number(p.precio_venta) * Number(p.cantidad ?? 1)),
        0
    );

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

        setPagos([...pagos, { id: medioSeleccionado.id_medio_pago, medio: medioSeleccionado.nombre, monto: monto, }]);
        setMontoMedio("");
        setMedioSeleccionado(null);
        inputRef.current?.focus();
    };


    const handlerConfirmarVenta = () => {
        if (faltante > 0) {
            toast.error(`Faltante: ${currencyFormat.format(faltante)}`);
            return;
        }

        const factura = {
            cliente: cuentaSeleccionada?.nombre,
            total: total,
            id_cuenta_cliente: cuentaSeleccionada?.id_cuenta_cliente,
            id_empresa: usuarioQuery?.data.empresa.id_empresa,
            pagos: pagos.map((p) => ({
                id_medio_pago: p.id,
                medio: p.medio,
                monto: p.monto
            })),
        };
        cerrarCuenta(factura, setProgress)
            .then((response: any) => {
                if (response.status === 200) {
                    toast.success("Venta realizada con exito");
                    // setProductosFactura([]);
                    // setUltimoProducto(null);
                    // setCuentaSeleccionada(null);
                    // setPagos([]);
                    // setTotatilizar(false);
                    // setMedioSeleccionado(null);
                    // setMontoMedio("");
                    // Actualizar cuentasQuery para eliminar la cuenta cerrada
                    queryClient.setQueryData(
                        ["cuenta_cliente", usuarioQuery.data?.empresa.id_empresa],
                        (oldData: any) => {
                            if (!oldData) return oldData;
                            return oldData.filter(
                                (c: any) => c.id_cuenta_cliente !== cuentaSeleccionada?.id_cuenta_cliente
                            );
                        }
                    );

                    descargarInventario(usuarioQuery.data?.empresa.id_empresa, usuarioQuery.data?.id_usuario, cuentaSeleccionada?.productos, setProgress);
                    openGenerarReciboModal();

                    setOpenModalCuenta(false);
                } else {
                    toast.error("Error al cerrar cuenta");
                }
            })
            .catch((error: any) => {
                console.error("Error al cerrar cuenta:", error);
                toast.error("Error al cerrar cuenta");
            });
    }

    const opciones = [
        { label: "Lavador 1", value: "1" },
        { label: "Lavador 2", value: "2" },
        { label: "Sala A", value: "A" },
        { label: "Sala B", value: "B" }
    ];



    const handleKeyDown = (e: KeyboardEvent | KeyboardEvent<HTMLDivElement>) => {
        if (totatilizar && !medioSeleccionado) {
            const found = metodosPagoQuery?.data.find((m: MedioPago) => m.shortcode === e.code);
            if (found) {
                e.preventDefault();
                setMedioSeleccionado(found.nombre);
                return;
            }

            if (e.code === "F9" && faltante <= 0 && pagos.length > 0) {
                e.preventDefault();
                handlerConfirmarVenta();
                return;
            }
        }

        switch (e.code) {
            case "Escape":
                e.preventDefault();
                if (totatilizar && !medioSeleccionado) {
                    setTotatilizar(false);
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
                setAbrirCuenta(true);
                break;
            case "F12":
                e.preventDefault();
                if (!cuentaSeleccionada) return alert("Debe seleccionar una cuenta");
                if (productosFactura.length === 0) return alert("No hay productos");
                setTotatilizar(true);
                break;
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown as any);
        return () => window.removeEventListener("keydown", handleKeyDown as any);
    }, [totatilizar, cuentaSeleccionada, productosFactura, medioSeleccionado]);

    const handlePrint = useReactToPrint({
        contentRef: ticketRef
    });

    const menuItems = [
        { shortcode: "Escape", image: "", title: "Volver", destiny: routes.vender },
        { shortcode: "F1", image: "", title: "Abrir Cuenta", destiny: openCuentaModal },
        { shortcode: "F4", image: "", title: "Cerrar", destiny: closeCuentaModal },
    ];
    const shortcuts = menuItems.reduce((map, item) => {
        map[item.shortcode] = () => item.destiny instanceof Function ? item.destiny() : navigate(item.destiny);
        return map;
    }, {} as Record<string, () => void>);

    useShortcuts(shortcuts);
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
                {(cuentasQuery?.data ?? []).map((cuenta: any) => (
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
                    <label>Servicio de lavado*</label>
                    <SelectSearch
                        options={
                            (productosQuery.data?.existencias ?? [])
                                .filter((p: any) => (p.nombre ?? "").toLowerCase().includes("servicio"))
                                .map((p: any) => ({ label: p.nombre, value: String(p.id_producto) }))
                        }
                        value={servicio}
                        onSelect={(option) => setServicio({ label: option.label, value: String(option.value) })}
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
                onClose={() => closeCuentaLavadoModal()}
                title="Cuenta Lavado"
                size="lg"
                footer={
                    <div className={style.modal_footer_actions}>
                        {totatilizar === true && (
                            <button className="btn btn_secondary" onClick={() => setTotatilizar(false)}>
                                Regresar
                            </button>
                        )}
                        <button className="btn btn_secondary" onClick={handlerCancelarCuenta}>
                            Cancelar Cuenta
                        </button>
                        {faltante <= 0 && total > 0 && (
                            <button className="btn btn_primary" onClick={() => handlerConfirmarVenta()}>
                                Confirmar Venta
                            </button>
                        )}
                        {totatilizar === false && (
                            <button className="btn btn_primary" onClick={() => setTotatilizar(true)}>
                                Totalizar
                            </button>
                        )}
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
                            <div style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
                                <p><strong>Total:</strong></p>
                                <p><strong>{currencyFormat.format(total ?? 0)}</strong></p>
                            </div>

                        </div>
                        <div className={style.facture}>
                            {(cuentaSeleccionada?.productos ?? []).map((p: any, i: any) => (
                                p.cantidad > 0 && (
                                    <div key={i} className={style.facture__content__item}>
                                        <p className={style.title__item}>{p.nombre}</p>
                                        <div className={style.facture__content__item__info}>
                                            <p>{p.cantidad} UND x {p.precio_venta}</p>
                                            <p>{currencyFormat.format(p.precio_venta * p.cantidad)}</p>
                                        </div>
                                    </div>
                                )
                            ))}
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
                                    {(metodosPagoQuery?.data ?? [])
                                        .filter((mp: { nombre: string }) =>
                                            mp.nombre.toLowerCase().includes(filtroMedio.toLowerCase())
                                        )
                                        .map((medio: any, index: number) => (
                                            <CardPOS
                                                key={index}
                                                shortcode={"F" + (index + 1)}
                                                title={medio.nombre}
                                                redirect={() => setMedioSeleccionado(medio)}
                                                image={confirm__wallet}
                                                to=""
                                            />
                                        ))}
                                </div>
                            </>
                        ) : (
                            <div className={style.form_control}>
                                <label>Ingresar monto en {medioSeleccionado.nombre}</label>
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
                    </div>
                )}

            </Modal>
            {/* Modal de facturacion */}
            <Modal isOpen={generateReceipt} onClose={closeGenerarReciboModal} title="Recibo" size="sm" footer={
                <div className={style.modal_footer_actions}>
                    <button className="btn btn_secondary" onClick={closeGenerarReciboModal}>
                        Salir
                    </button>
                    <button
                        className="btn btn_primary"
                        onClick={handlePrint}
                    >
                        Generar factura
                    </button>
                </div>
            }>
                <div id="factura" ref={ticketRef}>
                    <Receipt items={cuentaSeleccionada?.productos ?? []} />
                </div>
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
