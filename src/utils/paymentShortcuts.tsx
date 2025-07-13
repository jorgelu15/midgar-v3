// src/utils/paymentShortcuts.ts
import { medioPagos } from "../hooks/usePaymentMethods";

export const generatePaymentShortcuts = (handleChoose: (title: string) => void) => {
  return medioPagos.reduce((map, item) => {
    map[item.shortcode] = () => handleChoose(item.title);
    return map;
  }, {} as Record<string, () => void>);
};
