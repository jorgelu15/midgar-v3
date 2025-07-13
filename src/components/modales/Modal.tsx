import style from "./modal.module.css";
import close from "../../assets/close.svg"

interface ModalProps {
    children?: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
    title?: string;
}

const Modal = ({ title, onClose, children }: ModalProps) => {
    return (
        <div className={style.modal_overlay} >
            <div className={style.modal_content}>
                <div className={style.header_modal}>
                    <p>{title}</p>
                    <div className={style.icon_close} onClick={onClose}><img src={close} width={24} /></div>
                </div>
                <div className={style.modal_body}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
