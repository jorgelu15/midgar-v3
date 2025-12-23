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
  const { usuarioQuery } = useUserInfo();
  const user = usuarioQuery.data;

  const PERMISSION_ACCESS = "USUARIOS_PERMISOS";

  const [openModal, setOpenModal] = useState(false);
  const [gestionarRolesModal, setGestionarRolesModal] = useState(false);
  const [openModalCreateRol, setOpenModalCreateRol] = useState(false);

  const [openModalPermissions, setOpenModalPermissions] = useState<{
    isOpen: boolean;
    userId: string | null;
  }>({
    isOpen: false,
    userId: null,
  });

  const [openModalRol, setOpenModalRol] = useState<{
    isOpen: boolean;
    id_rol: string | null;
  }>({
    isOpen: false,
    id_rol: null,
  });



  const {
    usuariosByClienteQuery,
    rolesByClienteQuery,
    permisosByClienteQuery,
    permisosByRolQuery,
    usuarioInfoQuery,
    createEmpleadoMutation,
    // updateEmpleadoMutation,
    asignarPermisosMutation,
    quitarPermisosMutation,
    crearRol,
    usuario,
  } = useUsuarios(openModalPermissions?.userId, openModalRol?.id_rol);

  
  const usuarios = usuariosByClienteQuery.data;
  const empleado = usuarioInfoQuery.data;

  const permisosByRol = permisosByRolQuery.data || [];
  const roles = rolesByClienteQuery.data || [];
  const permisos = user?.permisos;

  const grantedPermission = permisos?.some(
    (permiso: PermisoRepository) => permiso.codigo_permiso === PERMISSION_ACCESS
  );

  const permisosByCliente = permisosByClienteQuery.data || [];

  const { form, onChangeGeneral, setState, resetForm } = useForm({
    query: "",
    nombre: "",
    email: "",
    password: "",
    tipo: "",
    nombre_rol: "",
    descripcion_rol: "",
  });

  const [rol, setRol] = useState<string>("");

  const onChangeRol = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRol(e.target.value);
  };

  const header_items = ["Nombre", "Correo", "Rol", "Fecha de registro", "Acciones"];
  const header_rol_items = ["Rol", "Descripción", "Acciones"];

  const originalRows = mapUsuariosToRows(usuarios || []);

  const filteredRows = useMemo(() => {
    const query = form?.query?.toLowerCase();
    if (!query) return originalRows;
    return originalRows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(query))
    );
  }, [form.query, originalRows]);

  const rolesRows = roles;

  const filteredRolesRows = useMemo(() => {
    const query = form?.query?.toLowerCase();
    if (!query) return rolesRows;
    return rolesRows.filter((row: RolRepository) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(query))
    );
  }, [form.query, rolesRows]);

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
    if (!form.nombre || !form.email || !form.password || rol === "" || user?.empresa.id_empresa == null) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    createEmpleadoMutation.mutate(
      {
        nombre: form.nombre,
        email: form.email,
        password_hash: form.password,
        id_rol: rol,
        id_empresa: user?.empresa.id_empresa,
      },
      {
        onSuccess: () => {
          toast.success("Usuario creado exitosamente");
          setOpenModal(false);
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      }
    );

    setOpenModal(false);
  };

  const onCreateRol = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!form.nombre_rol || !form.descripcion_rol || user?.empresa.id_empresa == null) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }
    crearRol({
      nombre_rol: form.nombre_rol,
      descripcion_rol: form.descripcion_rol,
      id_empresa: user?.empresa.id_empresa,
      id_usuario: user?.id_usuario,
    })
      .then(() => {
        toast.success("Rol creado exitosamente");
        setState({ nombre_rol: "", descripcion_rol: "" });
      })
      .catch((error: any) => {
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

    
  };

  /**
   * ====== NUEVO: Estado local de permisos asignados al rol (para UI inmediata) ======
   */
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());

  // Seed del estado local cuando cambia el rol o llegan datos nuevos
  useEffect(() => {
    const seed = new Set<string>((permisosByRol || []).map((p: any) => String(p.id_permiso)));
    setAssignedIds(seed);
  }, [openModalRol.id_rol, openModalRol.isOpen, permisosByRolQuery.data]);

  // Toggle (optimistic) + rollback en caso de error, luego refetch
  const handlePermissionToggle = (permisoId: string, nextChecked: boolean) => {
    if (!rol) {
      toast.error("Por favor, selecciona un rol");
      return;
    }

    const id_permiso = String(permisoId);
    const payload = {
      id_rol: rol,
      id_permiso,
      // usa la empresa del usuario autenticado (más estable en este contexto)
      id_empresa: user?.empresa.id_empresa ?? empleado?.empresa?.id_empresa,
      id_usuario: user?.id_usuario ?? usuario?.id_usuario,
    };

    if (nextChecked) {
      // Asignar (optimistic)
      setAssignedIds((prev) => {
        const clone = new Set(prev);
        clone.add(id_permiso);
        return clone;
      });

      asignarPermisosMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Permiso asignado exitosamente");
        },
        onError: (error: any) => {
          // rollback
          setAssignedIds((prev) => {
            const clone = new Set(prev);
            clone.delete(id_permiso);
            return clone;
          });
          toast.error(error?.message || "No se pudo asignar el permiso");
        },
        onSettled: () => {
          permisosByRolQuery.refetch?.();
        },
      });
    } else {
      // Quitar (optimistic)
      setAssignedIds((prev) => {
        const clone = new Set(prev);
        clone.delete(id_permiso);
        return clone;
      });

      quitarPermisosMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Permiso quitado exitosamente");
        },
        onError: (error: any) => {
          // rollback
          setAssignedIds((prev) => {
            const clone = new Set(prev);
            clone.add(id_permiso);
            return clone;
          });
          toast.error(error?.message || "No se pudo quitar el permiso");
        },
        onSettled: () => {
          permisosByRolQuery.refetch?.();
        },
      });
    }
  };

  if (!grantedPermission) return <NotPermissions />;

  return (
    <div className="container">
      <Breadcrumb items={items} />

      <div className={style.msg__welcome}>
        <h1>Usuarios y permisos</h1>
      </div>

      <div className={style.content}>
        <div className={style.header__container}>
          <div className={style.btn__container}>
            <button className="btn btn_primary" onClick={() => setOpenModal(true)}>
              Crear usuario
            </button>
            <button className="btn btn_secondary" onClick={() => setGestionarRolesModal(true)}>
              Gestionar roles
            </button>
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
                    onClick={() => setOpenModalPermissions({ isOpen: true, userId: row.id })}
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

      {/* gestionar roles modal */}
      {
        <Modal
          title="Gestionar roles"
          onClose={() => setGestionarRolesModal(false)}
          isOpen={gestionarRolesModal}
          footer={
            <div className={style.modal_footer_actions}>
              <button className="btn btn_primary" onClick={() => setOpenModalCreateRol(true)}>
                Crear rol
              </button>
            </div>
          }
        >
          <Table
            headers={header_rol_items}
            data={filteredRolesRows}
            rowsPerPageOptions={[5, 10, 20]}
            defaultRowsPerPage={10}
            renderRow={(row: RolRepository) => (
              <>
                <td>{row.nombre_rol}</td>
                <td>{row.descripcion}</td>
                <td>
                  <img
                    src={add_permission}
                    alt="Gestionar"
                    title="Gestionar"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOpenModalRol({ isOpen: true, id_rol: String(row.id) });
                      setRol(String(row.id));
                    }}
                  />
                </td>
              </>
            )}
          />
        </Modal>
      }

      {/* crear rol modal */}
      {
        <Modal
          title="Crear rol"
          onClose={() => setOpenModalCreateRol(false)}
          isOpen={openModalCreateRol}
          footer={
            <div className={style.modal_footer_actions}>
              <button className="btn btn_primary" onClick={onCreateRol}>
                Crear Rol
              </button>
            </div>
          }
        >
          <form>
            <div className={style.form_control}>
              <label>Nombre del rol</label>
              <input
                value={form.nombre_rol}
                onChange={(e) => onChangeGeneral(e, "nombre_rol")}
                placeholder="Ingrese un nombre"
              />
            </div>
            <div className={style.form_control}>
              <label>Descripción del rol</label>
              <input
                value={form.descripcion_rol}
                onChange={(e) => onChangeGeneral(e, "descripcion_rol")}
                placeholder="Ingrese una descripción"
              />
            </div>
          </form>
        </Modal>
      }

      {/* gestionar permisos de un rol */}
      {
        <Modal
          title={`Gestionar permisos de un ${roles?.find((r: RolRepository) => String(r.id) === String(openModalRol.id_rol))?.nombre_rol ?? ""
            }`}
          onClose={() => {
            setOpenModalRol({ isOpen: false, id_rol: null });
          }}
          size="md"
          isOpen={openModalRol.isOpen}
        >
          <form>
            <div className={style.form_control}>
              <p>Permisos generales del sistema</p>
              <div className={style.permissions_group}>
                {permisosByCliente?.map((permiso: PermisoRepository, index: number) => {
                  const isChecked = assignedIds.has(String(permiso.id_permiso));
                  return (
                    <label key={index} className={style.toggle}>
                      <div className={style.card__permission}>
                        <div className={style.permission__control}>
                          <p>
                            {typeof permiso.nombre_permiso === "string"
                              ? permiso.nombre_permiso
                              : JSON.stringify(permiso.nombre_permiso)}
                          </p>

                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              handlePermissionToggle(String(permiso.id_permiso), e.currentTarget.checked)
                            }
                          />
                          <span className={style.slider}></span>
                        </div>
                        <p className={style.descripcion__permiso}>{permiso.descripcion}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </form>
        </Modal>
      }

      {/* crear usuario modal */}
      {
        <Modal title="Crear usuario" onClose={() => setOpenModal(false)} isOpen={openModal}>
          <form onSubmit={onCreateEmpleado}>
            <div className={style.form_control}>
              <label>Nombre</label>
              <input
                value={form.nombre}
                onChange={(e) => onChangeGeneral(e, "nombre")}
                placeholder="Ingrese un nombre"
              />
            </div>
            <div className={style.form_control}>
              <label>Correo</label>
              <input
                value={form.email}
                onChange={(e) => onChangeGeneral(e, "email")}
                placeholder="Ingrese un correo electrónico"
              />
            </div>
            <div className={style.form_control}>
              <label>Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => onChangeGeneral(e, "password")}
                placeholder="Ingrese una contraseña"
              />
            </div>
            <div className={style.form_control}>
              <label>Rol</label>
              <select value={rol} onChange={onChangeRol}>
                <option value="">Selecciona un rol</option>
                {roles.map((rol: RolRepository, index: number) => (
                  <option key={index} value={rol.id}>
                    {rol.nombre_rol}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn_primary" type="submit" style={{ width: "100%" }}>
              Guardar cambios
            </button>
          </form>
        </Modal>
      }

      {/* gestionar datos del usuario modal */}
      {
        <Modal
          title={`Gestionar datos del usuario ${empleado?.nombre ?? ""}`}
          onClose={() => {
            setOpenModalPermissions({ isOpen: !openModalPermissions.isOpen, userId: null });
            setRol("");
            setAssignedIds(new Set());
            resetForm();
          }}
          isOpen={openModalPermissions.isOpen}
        >
          <form onSubmit={onAssignPermissions}>
            <div className={style.form_control}>
              <label>Nombre de usuario</label>
              <input
                required
                value={empleado?.nombre ?? form.nombre }
                onChange={(e) => onChangeGeneral(e, "nombre")}
                type="nombre"
                placeholder="Ingresa el nombre de usuario"
              />
            </div>
            <div className={style.form_control}>
              <label>Correo electrónico</label>
              <input
                required
                value={empleado?.email ?? form.email}
                onChange={(e) => onChangeGeneral(e, "email")}
                type="email"
                placeholder="Ingresa el correo electrónico"
              />
            </div>
            <div className={style.form_control}>
              <label>Rol de usuario</label>
              <select value={empleado?.id_rol ?? rol} onChange={onChangeRol}>
                <option value="">Selecciona un rol</option>
                {roles.map((rol: RolRepository, index: number) => (
                  <option key={index} value={rol.id}>
                    {rol.nombre_rol}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn_primary" type="submit" style={{ width: "100%" }}>
              Guardar cambios
            </button>
          </form>
        </Modal>
      }

      <ToastContainer position="bottom-right" autoClose={5000} transition={Bounce} />
    </div>
  );
};

export default Container;
