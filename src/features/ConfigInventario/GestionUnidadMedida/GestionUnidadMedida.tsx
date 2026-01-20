import { useMemo, useState, type MouseEvent } from "react";
import stringSimilarity from "string-similarity";

import style from "../container.module.css";
import { useInventario } from "../../../hooks/useInventario";
import CardGestion from "../../../components/cards/CardGestion";
import Modal from "../../../components/modales/Modal";

import borrar from "../../../assets/borrar.svg";
import unidad_medida from "../../../assets/unidad_medida.svg";
import { useForm } from "../../../hooks/useForm";
import Table from "../../../components/tables/Table";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useTheme } from "../../../context/ThemeContext/ThemeContext";
import { useUserInfo } from "../../../hooks/useUserInfo";
import type { UnidadMedidaDTO } from "../../../models/dtos/unidad_medida.dto";



const headers = [
    "Unidad de medida",
    "Abreviatura",
    "Acciones"
];
const GestionUnidadMedida = () => {
    const { theme } = useTheme();
    const { usuarioQuery } = useUserInfo();
    const { createUnidadMedidaMutation, unidadesMedidaQuery } = useInventario();
    const [openModalCategoria, setOpenModalCategoria] = useState(false);
    const [openModalCrearProveedor, setOpenModalCrearProveedor] = useState(false);

    const user = usuarioQuery.data;

    const unidadesMedida = unidadesMedidaQuery.data?.unidades_medida || [];

    const { form, onChangeGeneral } = useForm({ query: "", unidad_medida: "", abreviatura: "" });

    const filteredRows = useMemo(() => {
        const query = form.query.toLowerCase();
        if (!query) return unidadesMedida;

        return unidadesMedida.filter((row: any) => {
            return Object.values(row).some(value => {
                const text = String(value).toLowerCase();

                if (text.includes(query)) return true;

                const similarity = stringSimilarity.compareTwoStrings(text, query);
                return similarity > 0.8;
            });
        });
    }, [form.query, unidadesMedida]);

    const onCreateProveedores = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (form.unidad_medida === "") {
            toast.warning("Por favor, completa al menos el nombre.");
            return;
        }
        createUnidadMedidaMutation.mutate(
            { nombre_unidad: form.unidad_medida, abreviatura: form.abreviatura, id_empresa: user?.empresa.id_empresa },
            {
                onSuccess: () => {
                    toast.success("Unidad creada exitosamente.");
                    setOpenModalCrearProveedor(false);
                },
                onError: (error: any) => {
                    console.log("error al crear la unidad: ", error);
                    toast.error("Error al crear la unidad.");
                },
            }
        );
    }

    return (
        <>
            <CardGestion
                icon={unidad_medida}
                title="Unidades de medida"
                description="Administra las unidades de medida que usas en tu negocio"
                openModal={() => setOpenModalCategoria(true)}
            />
            <Modal
                isOpen={openModalCategoria}
                onClose={() => setOpenModalCategoria(false)}
                title="Gestionar unidades de medida"
                size="lg"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn" onClick={() => setOpenModalCrearProveedor(true)}>
                            Crear nueva unidad de medida
                        </button>
                    </div>
                }
            >
                <Table
                    headers={headers}
                    data={filteredRows}
                    defaultRowsPerPage={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    renderRow={(row: UnidadMedidaDTO) => {
                        const rowValues = [
                            row.nombre_unidad,
                            row.abreviatura || "N/A",
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
                title="Crear unidad de medida"
                isOpen={openModalCrearProveedor}
                onClose={() => setOpenModalCrearProveedor(false)}
                size="sm"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn btn_secondary" onClick={() => setOpenModalCrearProveedor(false)}>Cancelar</button>
                        <button className="btn btn_primary" onClick={onCreateProveedores}>Crear unidad de medida</button>
                    </div>
                }
            >
                <div className="form_control">
                    <label htmlFor="unidad_medida">Nombre de la unidad de medida*</label>
                    <input type="text" id="unidad_medida" name="unidad_medida" onChange={(e) => onChangeGeneral(e, "unidad_medida")} value={form.nombre} />
                </div>
                <div className="form_control">
                    <label htmlFor="abreviatura">Abreviatura</label>
                    <input type="text" id="abreviatura" name="abreviatura" onChange={(e) => onChangeGeneral(e, "abreviatura")} value={form.abreviatura} />
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

export default GestionUnidadMedida;