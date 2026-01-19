import { useMemo, useState, type MouseEvent } from "react";
import stringSimilarity from "string-similarity";

import style from "../container.module.css";
import { useInventario } from "../../../hooks/useInventario";
import CardGestion from "../../../components/cards/CardGestion";
import Modal from "../../../components/modales/Modal";

import type { CategoriaRepository } from "../../../models/Categoria.repository";
import borrar from "../../../assets/borrar.svg";
import category__icon from "../../../assets/category.svg";
import { useForm } from "../../../hooks/useForm";
import Table from "../../../components/tables/Table";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useTheme } from "../../../context/ThemeContext/ThemeContext";
import { useUserInfo } from "../../../hooks/useUserInfo";



const headers = [
    "Nombre",
    "Descripción",
    "Acciones"
];
const GestionCategorias = () => {
    const { theme } = useTheme();
    const { usuarioQuery } = useUserInfo();
    const { categoriasQuery, createCategoriaMutation } = useInventario();
    const [openModalCategoria, setOpenModalCategoria] = useState(false);
    const [openModalCrearCategoria, setOpenModalCrearCategoria] = useState(false);

    const user = usuarioQuery.data;
    const categorias = categoriasQuery.data || [];

    const { form, onChangeGeneral } = useForm({ query: "", nombre: "", descripcion: "" });

    const filteredRows = useMemo(() => {
        const query = form.query.toLowerCase();
        if (!query) return categorias;

        return categorias.filter((row: CategoriaRepository) => {
            return Object.values(row).some(value => {
                const text = String(value).toLowerCase();

                if (text.includes(query)) return true;

                const similarity = stringSimilarity.compareTwoStrings(text, query);
                return similarity > 0.8;
            });
        });
    }, [form.query, categorias]);

    const onCreateCategoria = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (form.nombre === "") {
            toast.warning("Por favor, completa al menos el nombre.");
            return;
        }
        createCategoriaMutation.mutate(
            { nombre: form.nombre, descripcion: form.descripcion, id_empresa: user?.empresa.id_empresa },
            {
                onSuccess: () => {
                    toast.success("Categoría creada exitosamente.");
                    setOpenModalCrearCategoria(false);
                },
                onError: (error: any) => {
                    console.log("error al crear la categoria: ",error);
                    toast.error("Error al crear la categoría.");
                },
            }
        );
    }

    return (
        <>
            <CardGestion
                icon={category__icon}
                title="Categorías"
                description="Administra las categorias  de tus productos"
                openModal={() => setOpenModalCategoria(true)}
            />
            <Modal
                isOpen={openModalCategoria}
                onClose={() => setOpenModalCategoria(false)}
                title="Gestionar categorías"
                size="lg"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn" onClick={() => setOpenModalCrearCategoria(true)}>
                            Crear nueva categoría
                        </button>
                    </div>
                }
            >
                <Table
                    headers={headers}
                    data={filteredRows}
                    defaultRowsPerPage={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    renderRow={(row: CategoriaRepository) => {
                        const rowValues = [
                            row.nombre,
                            row.descripcion || "N/A",
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
                title="Crear categoría"
                isOpen={openModalCrearCategoria}
                onClose={() => setOpenModalCrearCategoria(false)}
                size="sm"
                footer={
                    <div className={style.modal_footer_actions}>
                        <button className="btn btn_secondary" onClick={() => setOpenModalCrearCategoria(false)}>Cancelar</button>
                        <button className="btn btn_primary" onClick={onCreateCategoria}>Crear categoría</button>
                    </div>
                }
            >
                <div className="form_control">
                    <label htmlFor="nombre_categoria">Nombre de la categoría*</label>
                    <input type="text" id="nombre_categoria" name="nombre_categoria" onChange={(e) => onChangeGeneral(e, "nombre")} value={form.nombre} />
                </div>
                <div className="form_control">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea id="descripcion" name="descripcion" onChange={(e) => onChangeGeneral(e, "descripcion")} value={form.descripcion}></textarea>
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

export default GestionCategorias;