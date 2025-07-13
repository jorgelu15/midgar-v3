import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import Table from "../../components/tables/Table";
import { useForm } from "../../hooks/useForm";
import { useShortcuts } from "../../hooks/useShortcodes";
import { routes } from "../../utils/routes";
import style from "./container.module.css";
import { useMemo, useRef, useState } from "react";
import Modal from "../../components/modales/Modal";
import { toast, ToastContainer, Bounce } from "react-toastify";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Ajustes", href: routes.ajustes },
    { label: "Usuarios y permisos", href: routes.usuariosPermisos },
];

const menuItems = [
    { shortcode: "Escape", title: "Volver", destiny: routes.ajustes },
    { shortcode: "V", title: "Vender", destiny: routes.vender },
    { shortcode: "C", title: "Clientes", destiny: routes.clientes },
    { shortcode: "I", title: "Inventario", destiny: routes.inventario },
    { shortcode: "F", title: "Fiados", destiny: routes.fiados },
    { shortcode: "E", title: "Estadísticas", destiny: routes.estadisticas },
    { shortcode: "A", title: "Ajustes", destiny: routes.ajustes },
    { shortcode: "Ctrl + N", title: "Crear nuevo usuario", destiny: routes.usuariosPermisos },
    { shortcode: "B", title: "Buscar usuario", destiny: routes.usuariosPermisos },
];

const Container = () => {
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalPermissions, setOpenModalPermissions] = useState<{ isOpen: boolean, userId: string | null }>({ isOpen: false, userId: null });

    const { form, onChangeGeneral } = useForm({
        query: "",
    });

    const header_items = [
        "Nombre",
        "Correo",
        "Rol",
        "Fecha de registro",
        "Acciones",
    ];

    const originalRows = [
        ["Jorge Guardo", "jorge@gmail.com", "Administrador", "09/07/2025", "Acciones"],
        ["Ana Pérez", "ana@gmail.com", "Empleado", "09/07/2025", "Acciones"],
        ["Luis Martínez", "luis@hotmail.com", "Empleado", "08/07/2025", "Acciones"],
        ["Carlos Ramírez", "carlos@yahoo.com", "Administrador", "07/07/2025", "Acciones"],
    ];

    const filteredRows = useMemo(() => {
        const query = form.query.toLowerCase();
        if (!query) return originalRows;
        return originalRows.filter((row) =>
            row.some((cell) => cell.toLowerCase().includes(query))
        );
    }, [form.query]);

    const shortcuts = menuItems.reduce((map, item) => {
        const key = item.shortcode;

        if (key === "Escape") {
            map["Escape"] = () => navigate(-1);
        } else if (key === "Ctrl + N") {
            map["ControlLeft+KeyN"] = () => alert("Crear nuevo usuario");
        } else if (key === "B") {
            map["KeyB"] = () => searchInputRef.current?.focus();
        } else {
            map[`Key${key.toUpperCase()}`] = () => navigate(item.destiny);
        }

        return map;
    }, {} as Record<string, () => void>);

    useShortcuts(shortcuts);

    const handleModal = () => {
        setOpenModal(!openModal);
    }

    const handleModalPermissions = (userId: string): void => {
        setOpenModalPermissions({ isOpen: !openModalPermissions.isOpen, userId: userId });
    }

    const onCreateUser = () => {
        if (!form.nombre || !form.email || !form.password || !form.tipo) {
            toast.error("Por favor, completa todos los campos.");
            return;
        }
    }

    return (
        <div className="container">
            <Breadcrumb items={items} />

            <div className={style.msg__welcome}>
                <h1>Usuarios y permisos</h1>
            </div>

            <div className={style.content}>
                <div className={style.header__container}>
                    <button className="btn btn_primary" onClick={handleModal}>Crear usuario</button>
                    <div className={style.form_control}>
                        <input
                            ref={searchInputRef}
                            type="search"
                            placeholder="Buscar un usuario"
                            value={form.query}
                            onChange={(e) => onChangeGeneral(e, "query")}
                        />
                    </div>
                </div>

                <div className={style.table_container}>
                    <Table
                        header_items={header_items}
                        row_items={filteredRows}
                        rowsPerPageOptions={[5, 10, 20]}
                        defaultRowsPerPage={10}
                        actions={handleModalPermissions}
                    />

                    <div className={style.shortcut_guide}>
                        <h3>Atajos de teclado</h3>
                        <ul>
                            <li><strong>V:</strong> Ir a la sección de Vender</li>
                            <li><strong>C:</strong> Ir a la sección de Clientes</li>
                            <li><strong>I:</strong> Ir a Inventario</li>
                            <li><strong>F:</strong> Ir a Fiados</li>
                            <li><strong>E:</strong> Ir a Estadísticas</li>
                            <li><strong>A:</strong> Ir a Ajustes</li>
                            <li><strong>Ctrl + N:</strong> Crear nuevo usuario</li>
                            <li><strong>Esc:</strong> Volver atrás</li>
                            <li><strong>B:</strong> Enfocar campo de búsqueda</li>
                        </ul>
                    </div>
                </div>
            </div>
            {
                openModal && (
                    <Modal title="Titulo del modal" onClose={handleModal} isOpen={openModal} >
                        <div className={style.form_control}>
                            <label>Nombre de usuario</label>
                            <input
                                required
                                value={form.nombre}
                                onChange={(e) => onChangeGeneral(e, "nombre")}
                                type="nombre"
                                placeholder="Ingresa el nombre de usuario"
                            />
                        </div>
                        <div className={style.form_control}>
                            <label>Correo electrónico</label>
                            <input
                                required
                                value={form.email}
                                onChange={(e) => onChangeGeneral(e, "email")}
                                type="email"
                                placeholder="Ingresa el correo electrónico"
                            />
                        </div>
                        <div className={style.form_control}>
                            <label>Contraseña</label>
                            <input
                                required
                                value={form.password}
                                onChange={(e) => onChangeGeneral(e, "password")}
                                type="password"
                                placeholder="Ingresa la contraseña"
                            />
                        </div>
                        <div className={style.form_control}>
                            <label>Rol de usuario</label>
                            <select
                                required
                                value={form.tipo}
                                onChange={(e) => onChangeGeneral(e, "tipo")}
                            >
                                <option value="">Selecciona un rol</option>
                                <option value="usuario1">Administrador</option>
                                <option value="usuario2">Cajero</option>
                                <option value="usuario3">Domiciliario</option>
                            </select>
                        </div>
                        <button className="btn btn_primary" onClick={onCreateUser} style={{width: "100%"}}>Guardar cambios</button>
                    </Modal>
                )
            }
            {
                openModalPermissions.isOpen && (
                    <Modal title="Gestionar datos y permisos del usuario" onClose={() => setOpenModalPermissions({ isOpen: !openModalPermissions.isOpen, userId: null })} isOpen={openModalPermissions.isOpen}>
                        <div className={style.form_control}>
                            <label>Nombre de usuario</label>
                            <input
                                required
                                value={form.nombre}
                                onChange={(e) => onChangeGeneral(e, "nombre")}
                                type="nombre"
                                placeholder="Ingresa el nombre de usuario"
                            />
                        </div>
                        <div className={style.form_control}>
                            <label>Correo electrónico</label>
                            <input
                                required
                                value={form.email}
                                onChange={(e) => onChangeGeneral(e, "email")}
                                type="email"
                                placeholder="Ingresa el correo electrónico"
                            />
                        </div>
                        <div className={style.form_control}>
                            <label>Rol de usuario</label>
                            <select
                                required
                                value={form.tipo}
                                onChange={(e) => onChangeGeneral(e, "tipo")}
                            >
                                <option value="">Selecciona un rol</option>
                                <option value="usuario1">Administrador</option>
                                <option value="usuario2">Cajero</option>
                                <option value="usuario3">Domiciliario</option>
                            </select>
                        </div>
                        <div className={style.form_control}>
                            <p>Permisos del usuario</p>
                            <div className={style.permissions_group}>
                                <label><input type="checkbox" name="permissions" value="view_sales" /> Ver Ventas</label>
                                <label><input type="checkbox" name="permissions" value="manage_sales" /> Gestionar Ventas</label>
                                <label><input type="checkbox" name="permissions" value="view_products" /> Ver Productos</label>
                                <label><input type="checkbox" name="permissions" value="manage_products" /> Gestionar Productos</label>
                                <label><input type="checkbox" name="permissions" value="view_customers" /> Ver Clientes</label>
                                <label><input type="checkbox" name="permissions" value="manage_customers" /> Gestionar Clientes</label>
                            </div>
                        </div>
                        <button className="btn btn_primary" onClick={onCreateUser} style={{width: "100%"}}>Guardar cambios</button>
                    </Modal>
                )
            }
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
                theme="light"
                transition={Bounce}
            />
        </div>
    );
};

export default Container;
