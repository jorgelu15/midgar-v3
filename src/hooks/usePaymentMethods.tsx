import { useCallback, useState } from "react";
import { routes } from "../utils/routes";

export const medioPagos = [
  { shortcode: "1", title: "Efectivo", destiny: routes.caja },
  { shortcode: "2", title: "Tarjeta de crédito", destiny: routes.recogida },
  { shortcode: "3", title: "Tarjeta débito", destiny: routes.recogida },
  { shortcode: "4", title: "Cheque", destiny: routes.recogida },
];

export type MetodoPago = typeof medioPagos[number]["title"];

export const usePaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState<MetodoPago | null>(null);

  const handleChoosePayment = useCallback((method: MetodoPago) => {
    setSelectedMethod(method);
  }, []);

  const isSelected = (method: MetodoPago) => selectedMethod === method;

  return {
    medioPagos,
    selectedMethod,
    isSelected,
    handleChoosePayment,
  };
};
