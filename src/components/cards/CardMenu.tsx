import { Link } from "react-router-dom";
import style from "./cardmenu.module.css";

interface CardMenuProps {
  shortcode: string;
  image?: string | null;
  title: string;
  redirect: (shortcode: string) => void;
  to: string;
  permisos: Permiso[];
  codigo_permiso: string
}

interface Permiso {
  nombre_permiso: string;
  codigo_permiso: string;
  descripcion_permiso: string;
  id_permiso: number;
}

const CardMenu = ({ shortcode, image, title, redirect, to, permisos, codigo_permiso }: CardMenuProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Previene doble navegación si `redirect` ya hace `navigate`
    redirect(shortcode);
  };

  const tienePermiso = permisos?.some((permiso) => permiso.codigo_permiso === codigo_permiso || codigo_permiso === "");
  console.log(tienePermiso)
  if (!tienePermiso) return null

  return (
    <Link to={to} className={style.card} onClick={handleClick}>
      <span className={style.atajo}>( {shortcode.slice(0, 3)} )</span>
      {image && <img src={image} width={30} alt={title} />}
      <p>{title.charAt(0).toUpperCase() + title.slice(1)}</p>
    </Link>
  );
};

export default CardMenu;
