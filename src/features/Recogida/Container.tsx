import { useNavigate } from "react-router-dom";
import { useShortcuts } from "../../hooks/useShortcodes";
import { routes } from "../../utils/routes";
import style from "./container.module.css";

import volver from "../../assets/volver.svg";
import confirm__wallet from "../../assets/confirm_wallet.svg";
import dcto from "../../assets/dcto.svg";
import trash from "../../assets/borrar.svg";

import CardMenu from "../../components/cards/CardMenu";
import Card from "../../components/cards/Card";

import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { generatePaymentShortcuts } from "../../utils/paymentShortcuts";
import { useForm } from "../../hooks/useForm";
import { useEffect, useRef, useState } from "react";

const menuItems = [
  { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.caja },
  { shortcode: "F12", image: confirm__wallet, title: "Confirmar", destiny: routes.recogida },
];

const Container = () => {
  const navigate = useNavigate();

  const { medioPagos } = usePaymentMethods();
  const { form, onChangeGeneral, resetForm } = useForm({
    method: "",
    valor: ""
  });

  const [recogida, setRecogida] = useState<{ metodo: string, valor: number }[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const total = recogida.reduce((acc, curr) => acc + curr.valor, 0);

  const generalShortcuts = menuItems.reduce((map, item) => {
    map[item.shortcode] = () => navigate(item.destiny);
    return map;
  }, {} as Record<string, () => void>);

  const medioPagoShortcuts = generatePaymentShortcuts((method) => setSelectedMethod(method));

  // Solo activa los shortcuts cuando no se está escribiendo un monto
  useShortcuts(
    selectedMethod ? generalShortcuts : { ...generalShortcuts, ...medioPagoShortcuts }
  );

  // Auto focus en input cuando selecciona método
  useEffect(() => {
    if (selectedMethod && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedMethod]);

  const handleAgregarMonto = () => {
    if (!selectedMethod || !form.valor) return;

    const valorNumerico = parseFloat(form.valor.replace(/[^0-9.]/g, ''));
    if (isNaN(valorNumerico)) return;

    setRecogida(prev => {
      const index = prev.findIndex(item => item.metodo === selectedMethod);
      if (index !== -1) {
        const copia = [...prev];
        copia[index].valor += valorNumerico;
        return copia;
      }
      return [...prev, { metodo: selectedMethod, valor: valorNumerico }];
    });

    resetForm();
    setSelectedMethod(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAgregarMonto();
    }
  };

  // 🔍 Filtrado de medios de pago
  const mediosFiltrados = medioPagos.filter(mp =>
    mp.title.toLowerCase().includes(form.method.toLowerCase())
  );

  return (
    <div className="container" style={{ marginTop: 0 }}>
      <div className={style.container__compact}>
        <div className={style.main}>
          <div className={style.msg__welcome}>
            <h1>Recogida</h1>
          </div>

          <div className={style.cards}>
            {menuItems.map((item, index) => (
              <CardMenu
                key={index}
                shortcode={item.shortcode}
                title={item.title}
                redirect={() => navigate(item.destiny)}
                to={item.destiny}
                image={item.image}
              />
            ))}
          </div>

          <div className={style.main__content}>
            <div className={style.form_control}>
              {selectedMethod ? (
                <>
                  <label>Monto para {selectedMethod}</label>
                  <input
                    ref={inputRef}
                    type="number"
                    placeholder="Ingrese el valor recogido"
                    onChange={(e) => onChangeGeneral(e, "valor")}
                    value={form.valor}
                    onKeyDown={handleKeyDown} // ← Captura ENTER
                  />
                </>
              ) : (
                <>
                  <label>Seleccione un medio de pago</label>
                  <input
                    type="search"
                    placeholder="Buscar un medio de pago"
                    onChange={(e) => onChangeGeneral(e, "method")}
                    value={form.method}
                  />
                </>
              )}
            </div>

            {/* Oculta tarjetas si se está digitando monto */}
            {!selectedMethod && (
              <div className={style.cards}>
                {mediosFiltrados.map((item, index) => (
                  <Card
                    key={index}
                    shortcode={item.shortcode}
                    title={item.title}
                    chooseMethod={() => setSelectedMethod(item.title)}
                  />
                ))}
                {mediosFiltrados.length === 0 && <p>No hay coincidencias</p>}
              </div>
            )}
          </div>
        </div>

        <div className={style.facture}>
          <div className={style.facture__controls}>
            <div className={style.btn}><img src={dcto} width={30} /></div>
            <div className={style.btn}><img src={trash} /></div>
          </div>

          <div className={style.facture__info}>
            <div className={style.facture__info__subtitle}>
              <h4>Cajero:</h4><p>Jorge Guardo</p>
            </div>
            <div className={style.facture__info__subtitle}>
              <h4>Fecha:</h4><p>{new Date().toLocaleDateString()}</p>
            </div>
            <div className={style.facture__info__subtitle}>
              <h4>Hora:</h4><p>{new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <div className={style.facture__content}>
            {recogida.map((item, i) => (
              <div key={i} className={style.facture__content__item}>
                <p>{item.metodo}</p>
                <p>{new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP"
                }).format(item.valor)}</p>
              </div>
            ))}
          </div>

          <h2 className={style.facture__total}>
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP"
            }).format(total)}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Container;
