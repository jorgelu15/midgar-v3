import React, { useEffect, useState } from "react";
import style from "./offcanvascliente.module.css";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

const OffcanvasCliente: React.FC<Props> = ({ onClose, isOpen }) => {
  const [visible, setVisible] = useState(isOpen);
  console.log(visible)

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300); // Espera la animación antes de desmontar
  };

  return (
    <div
      className={`${style.offcanvas} ${
        isOpen ? style.slideIn : style.slideOut
      }`}
    >
      <div className={style.header}>
        <div className={style.clientInfo}>
          <strong>Pedro Gómez</strong>{" "}
          <span className={style.status}>💳 Activo</span>
        </div>
        <button onClick={handleClose} className={style.close}>
          ✕
        </button>
      </div>

      <div className={style.section}>
        <div className={style.row}>
          <p>
            ☎️ Tel: <strong>3001234567</strong>
          </p>
          <p>
            🪪 Cédula: <strong>12345678</strong>
          </p>
        </div>
        <div className={style.row}>
          <p>
            🎂 Cumpleaños: <strong>10 abril</strong>
          </p>
        </div>
        <div className={style.row}>
          <p>
            🏠 Dirección: <strong>Cll 10 #12-30</strong>
          </p>
        </div>
        <div className={style.row}>
          <p>
            💰 Cupo: <strong>$200.000</strong>
          </p>
          <p>
            Deuda: <strong>$80.000</strong>
          </p>
        </div>
        <div className={style.row}>
          <p>
            📆 Corte: <strong>15</strong>
          </p>
          <p>
            Clasificación: <strong>Frecuente 🟡</strong>
          </p>
        </div>
      </div>

      <div className={style.tabs}>
        <button>📜 Compras</button>
        <button>💸 Pagos</button>
        <button>📅 Cuotas</button>
        <button>🔔 Alertas</button>
        <button>📝 Notas</button>
      </div>

      <div className={style.section}>
        <p>
          <strong>📜 Historial de compras:</strong>
        </p>
        <ul className={style.list}>
          <li>
            13/07/25 | Leche, Arroz - <strong>$18.000</strong>
          </li>
          <li>
            10/07/25 | Azúcar, Galletas - <strong>$12.000</strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OffcanvasCliente;
