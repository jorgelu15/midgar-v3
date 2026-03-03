// ─────────────────────────────────────────────
//  components/BarraAcciones.tsx
//  Botones de acción rápida del POS (Volver, Consulta, Cliente, Totalizar)
// ─────────────────────────────────────────────

import CardPOS from "../../../components/cards/CardPOS";
import { routes } from "../../../utils/routes";
import { useNavigate } from "react-router-dom";

import volver from "../../../assets/volver.svg";
import confirm__wallet from "../../../assets/confirm_wallet.svg";
import consulta from "../../../assets/consulta.svg";
import clients from "../../../assets/clientes.png";
import type { ModoBusqueda } from "./useTienda";

interface Props {
  clienteSeleccionado: boolean;
  tieneProductos: boolean;
  setModoBusqueda: (m: ModoBusqueda) => void;
  onTotalizar: () => void;
}

export default function BarraAcciones({
  clienteSeleccionado,
  tieneProductos,
  setModoBusqueda,
  onTotalizar,
}: Props) {
  const navigate = useNavigate();

  const items = [
    {
      shortcode: "Escape",
      image: volver,
      title: "Volver",
      action: () => navigate(routes.vender),
    },
    {
      shortcode: "F1",
      image: consulta,
      title: "Consulta",
      action: () => clienteSeleccionado && setModoBusqueda("producto"),
    },
    {
      shortcode: "F2",
      image: clients,
      title: "Cliente",
      action: () => setModoBusqueda("cliente"),
    },
    {
      shortcode: "F12",
      image: confirm__wallet,
      title: "Totalizar",
      action: onTotalizar,
    },
  ];

  return (
    <>
      {items.map((item, index) => (
        <CardPOS
          key={index}
          shortcode={item.shortcode}
          title={item.title}
          redirect={item.action}
          to=""
          image={item.image}
        />
      ))}
    </>
  );
}
