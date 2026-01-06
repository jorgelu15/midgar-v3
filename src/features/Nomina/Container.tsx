import { useMemo, useState } from "react";
import stringSimilarity from "string-similarity";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import Table from "../../components/tables/Table";
import { useForm } from "../../hooks/useForm";
import { routes } from "../../utils/routes";
import style from "./container.module.css";
import Modal from "../../components/modales/Modal";
import borrar from "../../assets/borrar.svg";
import payEmployee from "../../assets/nomina.svg";
import volver from "../../assets/volver.svg";
import { useShortcuts } from "../../hooks/useShortcodes";
import { useClientes } from "../../hooks/useClientes";
import type { ClienteRepository } from "../../models/Cliente.repository";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useUserInfo } from "../../hooks/useUserInfo";

const items = [
  { label: "Dashboard", href: routes.dashboard },
  { label: "Nómina", href: routes.nomina },
];

const menuItems = [
  { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
];

const Container = () => {
  const navigate = useNavigate();
  const { usuarioQuery } = useUserInfo();
  const { clientesQuery, createClienteMutation, updateClienteMutation, deleteClienteMutation } = useClientes();
  const user = usuarioQuery.data;
  const clientes: ClienteRepository[] = clientesQuery.data || [];


  const { form, onChangeGeneral, setState } = useForm({
    query: "",
    cedula: "",
    nombre: "",
    telefono: "",
    direccion: "",
    email: ""
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedClient, setSelectedClient] = useState<ClienteRepository | null>(null);

  const onOpenEditCliente = (cliente: ClienteRepository) => {
    setSelectedClient(cliente);
    setState((prev: any) => ({
      ...prev,
      cedula: cliente.cedula || "",
      nombre: cliente.nombre || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
      email: cliente.email || "",
    }));
    setShowEditModal(true);
  };

  const onOpenDeleteCliente = (cliente: ClienteRepository) => {
    setSelectedClient(cliente);

    setShowDeleteModal(true);
  }


  // Atajos
  const shortcuts = menuItems.reduce((map, item) => {
    map[item.shortcode] = () => navigate(item.destiny);
    return map;
  }, {} as Record<string, () => void>);
  useShortcuts(shortcuts);

  const header_items = [
    "Cédula",
    "Nombre",
    "Teléfono",
    "Total a pagar",
    "Acciones",
  ];

  const filteredRows = useMemo(() => {
    const query = form?.query.toLowerCase();
    if (!query) return clientes;

    return clientes.filter((row: ClienteRepository) => {
      return Object.values(row).some(value => {
        const text = String(value).toLowerCase();

        if (text.includes(query)) return true;

        const similarity = stringSimilarity.compareTwoStrings(text, query);
        return similarity > 0.8;
      });
    });
  }, [form.query, clientes]);


  const onCreateCliente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.cedula || !form.nombre || user?.empresa.id_empresa == null) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    createClienteMutation.mutate(
      {
        cedula: form.cedula,
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
        email: form.email,
        id_empresa: `${user?.empresa.id_empresa}`,
      },
      {
        onSuccess: () => {
          toast.success("Cliente creado exitosamente");
          setShowCreateModal(false);
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      }
    );

    setShowCreateModal(false);
  };

  const onUpdateCliente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClient) {
      toast.error("Por favor, selecciona un cliente.");
      return;
    }

    if (!form.cedula || !form.nombre || user?.empresa.id_empresa == null) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    updateClienteMutation.mutate(
      {
        cedula: form.cedula,
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
        email: form.email,
        id_empresa: `${user?.empresa.id_empresa}`,
      },
      {
        onSuccess: () => {
          toast.success("Cliente actualizado exitosamente");
          setShowEditModal(false);
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      }
    );
    setShowEditModal(false);
  }

  const onDeleteCliente = () => {
    if (!selectedClient) {
      toast.error("Por favor, selecciona un cliente.");
      return;
    }

    deleteClienteMutation.mutate(
      selectedClient.cedula,
      {
        onSuccess: () => {
          toast.success("Cliente eliminado exitosamente");
          setShowDeleteModal(false);
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      }
    );
    setShowDeleteModal(false);

  }
  return (
    <div className="container">
      <Breadcrumb items={items} />
      <div className={style.msg__welcome}>
        <h1>Nómina</h1>
      </div>
      <div className={style.content}>
        <div className={style.header__container}>
          <div className={style.form_control}>
            <input
              type="search"
              placeholder="Buscar un empleado"
              value={form.query}
              onChange={(e) => onChangeGeneral(e, "query")}
            />
          </div>
        </div>

        <div className={style.table_container}>
          <Table
            headers={header_items}
            data={filteredRows}
            rowsPerPageOptions={[5, 10, 20]}
            defaultRowsPerPage={5}
            renderRow={(row) => {
              const rowValues = [
                row.cedula,
                row.nombre,
                row.telefono,
                row.direccion
              ];
              return (
                <>
                  {rowValues.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                  <td>
                    <img src={payEmployee} onClick={() => onOpenEditCliente(row)} />
                  </td>
                </>
              );
            }}
          />
        </div>

        {/* Atajos */}
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

      {/* Modal Crear Cliente */}
      <Modal
        title="Crear nuevo cliente"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="md"
      >
        <form className={style.form_cliente} onSubmit={onCreateCliente}>
          <div className={style.form_control}>
            <label>Cédula *</label>
            <input type="text" required value={form.cedula} onChange={(e) => onChangeGeneral(e, "cedula")} />
          </div>
          <div className={style.form_control}>
            <label>Nombre completo *</label>
            <input type="text" required value={form.nombre} onChange={(e) => onChangeGeneral(e, "nombre")} />
          </div>
          <div className={style.form_control}>
            <label>Teléfono</label>
            <input type="text" required value={form.telefono} onChange={(e) => onChangeGeneral(e, "telefono")} />
          </div>
          <div className={style.form_control}>
            <label>Direccion</label>
            <input type="text" required value={form.direccion} onChange={(e) => onChangeGeneral(e, "direccion")} />
          </div>
          <div className={style.form_control}>
            <label>Email</label>
            <input type="text" required value={form.email} onChange={(e) => onChangeGeneral(e, "email")} />
          </div>
          <div className={style.modal_footer_actions}>
            <button className="btn btn_secondary" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </button>
            <button className="btn btn_primary">
              Crear cliente
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal Editar Cliente */}
      <Modal
        title={`Editar cliente: ${selectedClient?.nombre}`}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        size="md"
      >
        <form className={style.form_cliente} onSubmit={onUpdateCliente}>
          <div className={style.form_control}>
            <label>Cédula *</label>
            <input type="text" disabled value={form.cedula} onChange={(e) => onChangeGeneral(e, "cedula")} />
          </div>
          <div className={style.form_control}>
            <label>Nombre completo *</label>
            <input type="text" disabled value={form.nombre} onChange={(e) => onChangeGeneral(e, "nombre")} />
          </div>
          <div className={style.form_control}>
            <label>Telefono </label>
            <input type="text" required value={form.telefono} onChange={(e) => onChangeGeneral(e, "telefono")} />
          </div>
          <div className={style.form_control}>
            <label>Direccion </label>
            <input type="text" required value={form.direccion} onChange={(e) => onChangeGeneral(e, "direccion")} />
          </div>
          <div className={style.form_control}>
            <label>Email *</label>
            <input type="text" required value={form.email} onChange={(e) => onChangeGeneral(e, "email")} />
          </div>
          <div className={style.modal_footer_actions}>
            <button className="btn btn_secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </button>
            <button className="btn btn_primary">
              Actualizar cliente
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar Cliente */}
      <Modal
        title={`Eliminar cliente: ${selectedClient?.nombre}`}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <form className={style.form_cliente} onSubmit={onDeleteCliente}>
          <div className={style.modal_footer_actions}>
            <button className="btn btn_secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </button>
            <button className="btn btn_primary">
              Eliminar cliente
            </button>
          </div>
        </form>
      </Modal>

    
      <ToastContainer position="bottom-right" autoClose={5000} transition={Bounce} />

    </div>
  );
};

export default Container;
