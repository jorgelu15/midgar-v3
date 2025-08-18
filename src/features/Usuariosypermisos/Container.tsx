import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";

import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import Table from "../../components/tables/Table";
import Modal from "../../components/modales/Modal";

import { useForm } from "../../hooks/useForm";
import { useShortcuts } from "../../hooks/useShortcodes";
import { routes } from "../../utils/routes";
import style from "./container.module.css";
import { useUserInfo } from "../../hooks/useUserInfo";
import NotPermissions from "../../components/NotPermissions/NotPermissions";
import type { PermisoRepository } from "../../models/Permiso.repository";
import { useUsuarios } from "../../hooks/useUsuarios";
import { mapUsuariosToRows } from "../../utils/adapters/usuarios.adapter";
import add_permission from "../../assets/add_permission.svg";
import type { RolRepository } from "../../models/Rol.repository";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Ajustes", href: routes.ajustes },
    { label: "Usuarios y permisos", href: routes.usuariosPermisos },
];

const menuItems = [
    { shortcode: "Escape", title: "Volver", destiny: routes.ajustes },
    { shortcode: "V", title: "Vender", destiny: routes.vender },
    { shortcode: "C", title: "Clientes", destiny: routes.clientes },
    { shortcode: "I", title: "InventarioFisico", destiny: routes.InventarioFisico },
    { shortcode: "F", title: "Fiados", destiny: routes.fiados },
    { shortcode: "E", title: "Estadísticas", destiny: routes.estadisticas },
    { shortcode: "A", title: "Ajustes", destiny: routes.ajustes },
    { shortcode: "Ctrl + N", title: "Crear nuevo usuario", destiny: routes.usuariosPermisos },
    { shortcode: "B", title: "Buscar usuario", destiny: routes.usuariosPermisos },
];

const Container = () => {
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const PERMISSION_ACCESS = "USUARIOS_PERMISOS";

    const [openModal, setOpenModal] = useState(false);
    const [openModalCreateRol, setOpenModalCreateRol] = useState(false);
    const [openModalPermissions, setOpenModalPermissions] = useState<{ isOpen: boolean, userId: string | null }>({
        isOpen: false,
        userId: null
    });

    const [selectedPermissions, setSelectedPermissions] = useState<PermisoRepository[]>([]);


    const { usuarioQuery, } = useUserInfo();
    const user = usuarioQuery.data;

    const {
        usuariosByClienteQuery,
        rolesByClienteQuery,
        permisosByClienteQuery,
        usuarioInfoQuery,
        createEmpleadoMutation,
        updateEmpleadoMutation,
        asignarPermisosMutation,
        quitarPermisosMutation,
        crearRol,
        usuario
    } = useUsuarios(openModalPermissions?.userId);

    const usuarios = usuariosByClienteQuery.data;
    const empleado = usuarioInfoQuery.data



    const roles = rolesByClienteQuery.data;

    const permisos = user?.permisos;
    const grantedPermission = permisos?.some((permiso: PermisoRepository) =>
        permiso.codigo_permiso === PERMISSION_ACCESS);

    const permisosByCliente = permisosByClienteQuery.data


    const { form, onChangeGeneral, setState, resetForm } = useForm({
        query: "",
        nombre: "",
        email: "",
        password: "",
        tipo: "",
        nombre_rol: "",
        descripcion_rol: ""
    });


    useEffect(() => {
        if (empleado) {
            setState({
                nombre: empleado.nombre,
                email: empleado.email,
            });
            setRol(empleado?.roles[0]?.id_rol ?? "");
            setSelectedPermissions(empleado.permisos || []);
        }
    }, [empleado]);


    const [rol, setRol] = useState<string>("");

    const onChangeRol = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRol(e.target.value);
    };


    const header_items = ["Nombre", "Correo", "Rol", "Fecha de registro", "Acciones"];

    const originalRows = mapUsuariosToRows(usuarios || []);

    const filteredRows = useMemo(() => {
        const query = form?.query?.toLowerCase();
        if (!query) return originalRows;
        return originalRows.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(query)
            )
        );
    }, [form.query, originalRows]);

    const shortcuts = menuItems.reduce((map, item) => {
        const key = item.shortcode;
        if (key === "Escape") {
            map["Escape"] = () => navigate(-1);
        } else if (key === "Ctrl + N") {
            map["ControlLeft+KeyN"] = () => setOpenModal(true);
        } else if (key === "B") {
            map["KeyB"] = () => searchInputRef.current?.focus();
        } else {
            map[`Key${key.toUpperCase()}`] = () => navigate(item.destiny);
        }
        return map;
    }, {} as Record<string, () => void>);

    useShortcuts(shortcuts);

    const onCreateEmpleado = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.nombre || !form.email || !form.password || rol === "" || user?.cliente.id_cliente == null) {
            toast.error("Por favor, completa todos los campos.");
            return;
        }

        createEmpleadoMutation.mutate({
            nombre: form.nombre,
            email: form.email,
            password_hash: form.password,
            id_rol: rol,
            id_cliente: user?.cliente.id_cliente
        }, {
            onSuccess: () => {
                toast.success("Usuario creado exitosamente");
                setOpenModal(false);
            },
            onError: (error: any) => {
                toast.error(error.message);
            }
        });

        setOpenModal(false);
    };

    const onCreateRol = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.nombre_rol || !form.descripcion_rol || user?.cliente.id_cliente == null) {
            toast.error("Por favor, completa todos los campos.");
            return;
        }
        crearRol({
            nombre_rol: form.nombre_rol,
            descripcion_rol: form.descripcion_rol,
            id_cliente: user?.cliente.id_cliente,
            id_usuario: user?.id_usuario
        }).then(() => {
            toast.success("Rol creado exitosamente");
            setState({ nombre_rol: "", descripcion_rol: "" });

        }).catch((error: any) => {
            toast.error(error.message);
        });

        setOpenModalCreateRol(false);
    };


    const onAssignPermissions = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (openModalPermissions.userId === null) {
            toast.error("Por favor, selecciona un usuario");
            return;
        }

    }

    const onTogglePermission = (permisoId: string, checked: boolean) => {
        if (!openModalPermissions.userId) return;

        const payload = {
            id_rol: rol,
            id_permiso: permisoId,
            id_cliente: empleado?.cliente.id_cliente,
            id_usuario: usuario?.id_usuario
        };

        if (rol.trim() === "") {
            toast.error("Por favor, selecciona un rol");
            return;
        }

        if (!checked) {
            // Asignar permiso
            asignarPermisosMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Permiso asignado exitosamente");
                    // 🔹 Agregar el permiso al estado local
                    setSelectedPermissions((prev) => [
                        ...prev,
                        permisosByCliente.find((p: PermisoRepository) => p.id_permiso === permisoId)!
                    ]);
                },
                onError: (error: any) => {
                    toast.error(error.message);
                }
            });
        } else {
            // Quitar permiso
            quitarPermisosMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Permiso quitado exitosamente");
                    // 🔹 Remover el permiso del estado local
                    setSelectedPermissions((prev) =>
                        prev.filter((p) => p.id_permiso !== permisoId)
                    );
                },
                onError: (error: any) => {
                    toast.error(error.message);
                }
            });
        }
    };




    if (!grantedPermission) return <NotPermissions />


    return (
        <div className="container">
            <Breadcrumb items={items} />

            <div className={style.msg__welcome}>
                <h1>Usuarios y permisos</h1>
            </div>

            <div className={style.content}>
                <div className={style.header__container}>
                    <div className={style.btn__container}>
                        <button className="btn btn_primary" onClick={() => setOpenModal(true)}>Crear usuario</button>
                        <button className="btn btn_secondary" onClick={() => setOpenModalCreateRol(true)}>Crear rol</button>
                    </div>
                    <div className={style.form_control}>
                        <input
                            ref={searchInputRef}
                            type="search"
                            placeholder="Buscar un usuario"
                            value={form.query ?? ""}
                            onChange={(e) => onChangeGeneral(e, "query")}
                        />
                    </div>
                </div>

                <div className={style.table_container}>
                    <Table
                        headers={header_items}
                        data={filteredRows}
                        rowsPerPageOptions={[5, 10, 20]}
                        defaultRowsPerPage={10}
                        renderRow={(row) => (
                            <>
                                <td>{row.nombre}</td>
                                <td>{row.correo}</td>
                                <td>{row.rol}</td>
                                <td>{row.fechaRegistro}</td>
                                <td>
                                    <img
                                        src={add_permission}
                                        alt="Gestionar"
                                        title="Gestionar"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            setOpenModalPermissions({ isOpen: true, userId: row.id })
                                        }
                                    />
                                </td>
                            </>
                        )}
                    />


                    <div className={style.shortcut_guide}>
                        <h3>Atajos de teclado</h3>
                        <ul>
                            <li><strong>V:</strong> Ir a la sección de Vender</li>
                            <li><strong>C:</strong> Ir a la sección de Clientes</li>
                            <li><strong>I:</strong> Ir a InventarioFisico</li>
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

            {openModalCreateRol && (
                <Modal title="Crear rol" onClose={() => setOpenModalCreateRol(false)} isOpen={openModalCreateRol}>
                    <form onSubmit={onCreateRol}>
                        <div className={style.form_control}>
                            <label>Nombre del rol</label>
                            <input value={form.nombre_rol} onChange={(e) => onChangeGeneral(e, "nombre_rol")} placeholder="Ingrese un nombre" />
                        </div>
                        <div className={style.form_control}>
                            <label>Descripción del rol</label>
                            <input value={form.descripcion_rol} onChange={(e) => onChangeGeneral(e, "descripcion_rol")} placeholder="Ingrese una descripción" />
                        </div>
                        <button className="btn btn_primary" type="submit" style={{ width: "100%" }}>
                            Guardar cambios
                        </button>
                    </form>
                </Modal>
            )}

            {openModal && (
                <Modal title="Crear usuario" onClose={() => setOpenModal(false)} isOpen={openModal}>
                    <form onSubmit={onCreateEmpleado}>
                        <div className={style.form_control}>
                            <label>Nombre</label>
                            <input value={form.nombre} onChange={(e) => onChangeGeneral(e, "nombre")} placeholder="Ingrese un nombre" />
                        </div>
                        <div className={style.form_control}>
                            <label>Correo</label>
                            <input value={form.email} onChange={(e) => onChangeGeneral(e, "email")} placeholder="Ingrese un correo electrónico" />
                        </div>
                        <div className={style.form_control}>
                            <label>Contraseña</label>
                            <input type="password" value={form.password} onChange={(e) => onChangeGeneral(e, "password")} placeholder="Ingrese una contraseña" />
                        </div>
                        <div className={style.form_control}>
                            <label>Rol</label>
                            <select value={rol} onChange={onChangeRol}>
                                <option value="">Selecciona un rol</option>
                                {
                                    roles.map((rol: RolRepository, index: number) => (
                                        <option key={index} value={rol.id}>{rol.nombre_rol}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <button className="btn btn_primary" type="submit" style={{ width: "100%" }}>
                            Guardar cambios
                        </button>
                    </form>
                </Modal>
            )}

            {openModalPermissions.isOpen && (
                <Modal title="Gestionar datos y permisos del usuario" onClose={() => {
                    setOpenModalPermissions({ isOpen: !openModalPermissions.isOpen, userId: null });
                    setRol("");
                    setSelectedPermissions([]);
                    resetForm()
                }} isOpen={openModalPermissions.isOpen}>
                    <form onSubmit={onAssignPermissions}>
                        <div className={style.form_control}>
                            <label>Nombre de usuario</label>
                            <input
                                required
                                value={form.nombre ?? ""}
                                onChange={(e) => onChangeGeneral(e, "nombre")}
                                type="nombre"
                                placeholder="Ingresa el nombre de usuario"
                            />
                        </div>
                        <div className={style.form_control}>
                            <label>Correo electrónico</label>
                            <input
                                required
                                value={form.email ?? ""}
                                onChange={(e) => onChangeGeneral(e, "email")}
                                type="email"
                                placeholder="Ingresa el correo electrónico"
                            />
                        </div>
                        <div className={style.form_control}>
                            <label>Rol de usuario</label>
                            <select value={rol ?? ""} onChange={onChangeRol}>
                                <option value="">Selecciona un rol</option>
                                {
                                    roles.map((rol: RolRepository, index: number) => (
                                        <option key={index} value={rol.id}>{rol.nombre_rol}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className={style.form_control}>
                            <p>Permisos del usuario</p>
                            <div className={style.permissions_group}>
                                {permisosByCliente?.map((permiso: PermisoRepository, index: number) => (
                                    <label key={index} className={style.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.some((p: PermisoRepository) => p.id_permiso === permiso.id_permiso)}
                                            onChange={() => onTogglePermission(permiso.id_permiso, selectedPermissions.some((p: PermisoRepository) => p.id_permiso === permiso.id_permiso))}
                                        />
                                        <span className={style.slider}></span>
                                        {typeof permiso.nombre_permiso === "string"
                                            ? permiso.nombre_permiso
                                            : JSON.stringify(permiso.nombre_permiso)}
                                    </label>
                                ))}

                            </div>
                        </div>

                        <button className="btn btn_primary" type="submit" style={{ width: "100%" }}>Guardar cambios</button>
                    </form>
                </Modal>
            )}

            <ToastContainer position="bottom-right" autoClose={5000} transition={Bounce} />
        </div>
    );
};

export default Container;
