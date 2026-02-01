import { Bounce, toast, ToastContainer } from "react-toastify";
import Modal from "../../../components/modales/Modal";
import { useInventario } from "../../../hooks/useInventario";
import style from "../container.module.css";

interface DeleteProductoModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  productoSeleccionado: {
    id_producto: number;
    nombre: string;
  } | null;
}

const DeleteProductoModal = ({
  isOpen,
  setIsOpen,
  productoSeleccionado,
}: DeleteProductoModalProps) => {
  const { deleteProductoMutation } = useInventario();

  const handleDelete = async () => {
    if (!productoSeleccionado) return;

    try {
      await deleteProductoMutation.mutateAsync(
        productoSeleccionado.id_producto
      );

      toast.success("Producto eliminado correctamente");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Error al eliminar el producto");
    }
  };

  return (
    <Modal
      title="Eliminar Producto"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="sm"
      footer={
        <div className={style.modal_footer_actions}>
          <button
            className="btn btn_secondary"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </button>

          <button
            className="btn btn_danger"
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </div>
      }
    >
      <div className={style.delete_confirmation}>
        <p>
          ¿Estás seguro de inhablitar el producto{" "}
          <strong>{productoSeleccionado?.nombre}</strong>?
        </p>
        <p className={style.warning_text}>
          Para volver a utilizarlo, deberás activarlo en el modulo de productos.
        </p>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Modal>
  );
};

export default DeleteProductoModal;
