import { useMemo, useState, type MouseEvent } from "react";
import stringSimilarity from "string-similarity";

import style from "../container.module.css";
import { useInventario } from "../../../hooks/useInventario";
import CardGestion from "../../../components/cards/CardGestion";
import Modal from "../../../components/modales/Modal";

import borrar from "../../../assets/borrar.svg";
import marca__icon from "../../../assets/marca.svg";
import { useForm } from "../../../hooks/useForm";
import Table from "../../../components/tables/Table";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useTheme } from "../../../context/ThemeContext/ThemeContext";
import { useUserInfo } from "../../../hooks/useUserInfo";
import type { MarcaDTO } from "../../../models/dtos/marca.dto";



const headers = [
    "Nombre de la marca",
    "Acciones"
];
const GestionMarcas = () => {
    const { theme } = useTheme();
    const { usuarioQuery } = useUserInfo();
    const { marcasQuery, createMarcaMutation } = useInventario();
    const [openModalCategoria, setOpenModalCategoria] = useState(false);
    const [openModalCrearProveedor, setOpenModalCrearProveedor] = useState(false);

    const user = usuarioQuery.data;
    const marcas = marcasQuery.data?.marcas || [];


    const { form, onChangeGeneral } = useForm({ query: "", nombre_marca: ""});

    const filteredRows = useMemo(() => {
        const query = form.query.toLowerCase();
        if (!query) return marcas;

        return marcas.filter((row: MarcaDTO) => {
            return Object.values(row).some(value => {
                const text = String(value).toLowerCase();

                if (text.includes(query)) return true;

                const similarity = stringSimilarity.compareTwoStrings(text, query);
                return similarity > 0.8;
            });
        });
    }, [form.query, marcas]);

    const onCreateMarca = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (form.nombre === "") {
            toast.warning("Por favor, completa al menos el nombre.");
            return;
        }
        createMarcaMutation.mutate(
            { nombre_marca: form.nombre_marca, id_empresa: user?.empresa.id_empresa },
            {
                onSuccess: () => {
                    toast.success("Marca creada exitosamente.");
                    setOpenModalCrearProveedor(false);
                },
                onError: (error: any) => {
                    console.log("error al crear la marca: ",error);
                    toast.error("Error al crear la marca.");
                },
            }
        );
    }

    return (
        <>
            <CardGestion
                icon={marca__icon}
                title="Marcas"
                description="Administra las marcas de tus productos"
                openModal={() => setOpenModalCategoria(true)}
            />
            <Modal
                isOpen={openModalCategoria}
                onClose={() => setOpenModalCategoria(false)}
                title="Gestionar marcas"
                size="md"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn" onClick={() => setOpenModalCrearProveedor(true)}>
                            Crear nueva marca
                        </button>
                    </div>
                }
            >
                <Table
                    headers={headers}
                    data={filteredRows}
                    defaultRowsPerPage={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    renderRow={(row: MarcaDTO) => {
                        const rowValues = [
                            row.nombre_marca
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
                title="Crear marca"
                isOpen={openModalCrearProveedor}
                onClose={() => setOpenModalCrearProveedor(false)}
                size="sm"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn btn_secondary" onClick={() => setOpenModalCrearProveedor(false)}>Cancelar</button>
                        <button className="btn btn_primary" onClick={onCreateMarca}>Crear Marca</button>
                    </div>
                }
            >
                <div className="form_control">
                    <label htmlFor="nombre_marca">Nombre de la marca*</label>
                    <input type="text" id="nombre_marca" name="nombre_marca" onChange={(e) => onChangeGeneral(e, "nombre_marca")} value={form.nombre_marca} />
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

export default GestionMarcas;