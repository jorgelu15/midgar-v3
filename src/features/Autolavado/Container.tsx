import { useState } from "react";
import Card from "../../components/cards/Card";
import Modal from "../../components/modales/Modal";
import SelectSearch from "../../components/selects/SelectSearch";
import { useProductModals } from "../../hooks/useProductModals";
import CardCuentaLavado from "../../components/cards/CardCuentaLavado";
import style from "./container.module.css";
import CardProductotienda from "../../components/cards/CardProductoTiendas";
import { useCuenta } from "../../hooks/useCuenta";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

// Interfaces
interface ProductoRepository {
    codigo: string;
    nombre: string;
    precio_venta: number;
    cantidad?: number;
}

interface CuentaLavado {
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

    const { usuario } = useAuth();
    const [progress, setProgress] = useState<number | null>(null);

    const [clienteNombre, setClienteNombre] = useState("");
    const [placa, setPlaca] = useState("");
    const [lavador, setLavador] = useState({label: "", value: ""});
    const [sala, setSala] = useState({label: "", value: ""});

    const { cuentasQuery, createCuenta } = useCuenta();

    const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaLavado | null>(null);
    const [productosFactura, setProductosFactura] = useState<ProductoRepository[]>([]);
    const [ultimoProducto, setUltimoProducto] = useState<ProductoRepository | null>(null);

    const openCuentaModal = () => setAbrirCuenta(true);
    const closeCuentaModal = () => setAbrirCuenta(false);

    const openCuentaLavadoModal = () => setOpenModalCuenta(true);
    const closeCuentaLavadoModal = () => setOpenModalCuenta(false);

    const handleAgregarProducto = (producto: ProductoRepository) => {
        const nuevoProducto = { ...producto, cantidad: 1 };
        setProductosFactura([...productosFactura, nuevoProducto]);
        setUltimoProducto(nuevoProducto);
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

        createCuenta(cuenta, usuario?.id_inst, setProgress).then((response: any) => {
            toast.success(response.data.message);
            closeCuentaModal();
            openCuentaLavadoModal();
        }).catch((error: any) => {
            toast.error(error.error);
            setProgress(null);
        });
    };

    const currencyFormat = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP"
    });

    const total = productosFactura.reduce((acc, p) => acc + (p.precio_venta * (p.cantidad || 1)), 0);

    const opciones = [
        { label: "Lavador 1", value: "1" },
        { label: "Lavador 2", value: "2" },
        { label: "Sala A", value: "A" },
        { label: "Sala B", value: "B" }
    ];

    // mock.ts
    const mockProductos = [
        { nombre: "Cerveza", precio: 5000, descuento: 0, cantidad: 2 },
        { nombre: "Gaseosa", precio: 3000, descuento: 0, cantidad: 1 },
        { nombre: "Snacks", precio: 4000, descuento: 0, cantidad: 3 },
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
                {cuentasQuery.data && cuentasQuery.data.map((cuenta: any) => (
                    <CardCuentaLavado
                        key={cuenta.id_cuenta_cliente}
                        nombreCliente={cuenta.nombre}
                        placa={cuenta.placa}
                        lavador={cuenta.lavador}
                        sala={cuenta.sala}
                        ingreso={cuenta.ingreso}
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
                        options={opciones.filter(o => o.label.includes("Lavador"))}
                        value={lavador}
                        onSelect={setLavador}
                    />
                </div>
                <div className={style.form_control}>
                    <label>Sala*</label>
                    <SelectSearch
                        options={opciones.filter(o => o.label.includes("Sala"))}
                        value={sala}
                        onSelect={setSala}
                    />
                </div>
            </Modal>

            {/* MODAL 2: Cuenta abierta */}
            <Modal
                isOpen={openModalCuenta}
                onClose={closeCuentaLavadoModal}
                title="Cuenta Lavado"
                size="lg"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn btn_secondary" onClick={closeCuentaLavadoModal}>
                            Cerrar
                        </button>
                        <button className="btn btn_primary" onClick={() => console.log("Procesar")}>
                            Procesar
                        </button>
                    </div>
                }
            >
                <div className={style.container__compact}>
                    <div className={style.main__modal}>
                        <div className={style.cards} style={{ gap: 0 }}>
                            <div className={style.form_control}>
                                <label>Código de barras</label>
                                <input type="search" />
                            </div>

                        </div>
                        <div className={style.cards} style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 20, maxHeight: 220, overflowY: "auto" }}>
                            {mockProductos.map((producto) => (
                                <CardProductotienda
                                    key={producto.codigo}
                                    {...producto}
                                    onClick={() => handleAgregarProducto(producto)}
                                />
                            ))}
                        </div>
                        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
                            <p><strong>Total:</strong></p>
                            <p><strong>{currencyFormat.format(total)}</strong></p>
                        </div>

                    </div>
                    <div className={style.facture}>

                        {
                            new Array(10).fill(0).map((_, index) => (
                                <div className={style.facture__content__item}>
                                    <p className={style.title__item}>Cerveza Club Colombia</p>
                                    <div className={style.facture__content__item__info}>
                                        <p>2 UND x $6.000</p>
                                        <p>$12.000</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Container;
