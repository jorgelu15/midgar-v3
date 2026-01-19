import { useMemo, useState, type MouseEvent } from "react";
import stringSimilarity from "string-similarity";

import style from "../container.module.css";
import { useInventario } from "../../../hooks/useInventario";
import CardGestion from "../../../components/cards/CardGestion";
import Modal from "../../../components/modales/Modal";

import borrar from "../../../assets/borrar.svg";
import proveedores__icon from "../../../assets/proveedores.svg";
import { useForm } from "../../../hooks/useForm";
import Table from "../../../components/tables/Table";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useTheme } from "../../../context/ThemeContext/ThemeContext";
import { useUserInfo } from "../../../hooks/useUserInfo";
import type { ProveedorDTO } from "../../../models/dtos/proveedor.dto";



const headers = [
    "Nombre",
    "Nit",
    "Dirección",
    "Telélefono",
    "Correo",
    "Acciones"
];
const GestionMediosDePago = () => {
    const { theme } = useTheme();
    const { usuarioQuery } = useUserInfo();
    const { createProveedorMutation, proveedoresQuery } = useInventario();
    const [openModalCategoria, setOpenModalCategoria] = useState(false);
    const [openModalCrearProveedor, setOpenModalCrearProveedor] = useState(false);

    const user = usuarioQuery.data;

    const proveedores = proveedoresQuery.data?.proveedores || [];

    const { form, onChangeGeneral } = useForm({ query: "", nombre_proveedor: "", telefono: "", direccion: "", nit: "", correo: "" });

    const filteredRows = useMemo(() => {
        const query = form.query.toLowerCase();
        if (!query) return proveedores;

        return proveedores.filter((row: ProveedorDTO) => {
            return Object.values(row).some(value => {
                const text = String(value).toLowerCase();

                if (text.includes(query)) return true;

                const similarity = stringSimilarity.compareTwoStrings(text, query);
                return similarity > 0.8;
            });
        });
    }, [form.query, proveedores]);

    const onCreateProveedores = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (form.nombre === "") {
            toast.warning("Por favor, completa al menos el nombre.");
            return;
        }
        createProveedorMutation.mutate(
            { nombre: form.nombre, descripcion: form.descripcion, id_empresa: user?.empresa.id_empresa },
            {
                onSuccess: () => {
                    toast.success("Proveedor creado exitosamente.");
                    setOpenModalCrearProveedor(false);
                },
                onError: (error: any) => {
                    console.log("error al crear el proveedor: ", error);
                    toast.error("Error al crear el proveedor.");
                },
            }
        );
    }

    return (
        <>
            <CardGestion
                icon={proveedores__icon}
                title="Medios de pago"
                description="Administra los medios de pago que aceptas en tu negocio"
                openModal={() => setOpenModalCategoria(true)}
            />
            <Modal
                isOpen={openModalCategoria}
                onClose={() => setOpenModalCategoria(false)}
                title="Gestionar proveedores"
                size="lg"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn" onClick={() => setOpenModalCrearProveedor(true)}>
                            Crear nuevo proveedor
                        </button>
                    </div>
                }
            >
                <Table
                    headers={headers}
                    data={filteredRows}
                    defaultRowsPerPage={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    renderRow={(row: ProveedorDTO) => {
                        const rowValues = [
                            row.nombre_proveedor,
                            row.nit || "N/A",
                            row.direccion || "N/A",
                            row.telefono || "N/A",
                            row.correo || "N/A",
                        ];
                        return (
                            <>
                                {rowValues.map((cell, i) => (
                                    <td key={i}>{cell}</td>
                                ))}
                                <td>
                                    <img src={borrar} />
                                </td>
                            </>
                        );
                    }}
                />
            </Modal>
            <Modal
                title="Crear proveedor"
                isOpen={openModalCrearProveedor}
                onClose={() => setOpenModalCrearProveedor(false)}
                size="sm"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn btn_secondary" onClick={() => setOpenModalCrearProveedor(false)}>Cancelar</button>
                        <button className="btn btn_primary" onClick={onCreateProveedores}>Crear proveedor</button>
                    </div>
                }
            >
                <div className="form_control">
                    <label htmlFor="nombre_proveedor">Nombre del proveedor*</label>
                    <input type="text" id="nombre_proveedor" name="nombre_proveedor" onChange={(e) => onChangeGeneral(e, "nombre")} value={form.nombre} />
                </div>
                <div className="form_control">
                    <label htmlFor="nit">Nit</label>
                    <input type="text" id="nit" name="nit" onChange={(e) => onChangeGeneral(e, "nit")} value={form.nit} />
                </div>
                <div className="form_control">
                    <label htmlFor="telefono">Teléfono</label>
                    <input type="text" id="telefono" name="telefono" onChange={(e) => onChangeGeneral(e, "telefono")} value={form.telefono} />
                </div>
                <div className="form_control">
                    <label htmlFor="direccion">Dirección</label>
                    <input type="text" id="direccion" name="direccion" onChange={(e) => onChangeGeneral(e, "direccion")} value={form.direccion} />
                </div>
                <div className="form_control">
                    <label htmlFor="correo">Correo</label>
                    <input type="text" id="correo" name="correo" onChange={(e) => onChangeGeneral(e, "correo")} value={form.correo} />
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
        </>
    );
}

export default GestionMediosDePago;