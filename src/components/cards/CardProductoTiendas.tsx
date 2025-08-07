import type { ProductoRepository } from "../../models/Producto.repository";
import style from "./cardproductotiendas.module.css";

interface Props extends ProductoRepository {
  onClick?: () => void;
}

const CardProductotienda = ({
  codigo,
  nombre,
  cantidad,
  precio_venta,
  cantidad_minima,
  categoria_id,
  costo,
  estado,
  foto_url,
  id_inst,
  id_producto,
  impuesto_id,
  marca_id,
  proveedor_id,
  unidad_medida_id,
  onClick,
}: Props) => {
  return (
    <div
      className={style.card}
      onClick={onClick}
      style={{ backgroundImage: `url(${foto_url})` }}
    >
      <div className={style.overlay}>
        <span className={style.atajo}>( {id_producto?.slice(0, 3)} )</span>
        <p>{nombre.charAt(0).toUpperCase() + nombre?.slice(1)}</p>
      </div>
    </div>
  );
};

export default CardProductotienda;
