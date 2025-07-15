import { useEffect } from "react";
import style from "./modal.module.css";
import closeIcon from "../../assets/close.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnEscape?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnEscape = true,
}: ModalProps) => {
  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div className={style.modal_overlay}>
      <div className={`${style.modal_content} ${style[size]}`}>
        <div className={style.header_modal}>
          <p className={style.modal_title}>{title}</p>
          <div className={style.icon_close} onClick={onClose}>
            <img src={closeIcon} width={24} alt="Cerrar" />
          </div>
        </div>

        <div className={style.modal_body}>{children}</div>

        {footer && <div className={style.modal_footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
