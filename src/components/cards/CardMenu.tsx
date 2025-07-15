import { Link } from "react-router-dom";
import style from "./cardmenu.module.css";

interface CardMenuProps {
  shortcode: string;
  image?: string | null;
  title: string;
  redirect: (shortcode: string) => void;
  to: string;
}

const CardMenu = ({ shortcode, image, title, redirect, to }: CardMenuProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Previene doble navegación si `redirect` ya hace `navigate`
    redirect(shortcode);
  };

  return (
    <Link to={to} className={style.card} onClick={handleClick}>
      <span className={style.atajo}>( {shortcode.slice(0, 3)} )</span>
      {image && <img src={image} width={30} alt={title} />}
      <p>{title.charAt(0).toUpperCase() + title.slice(1)}</p>
    </Link>
  );
};

export default CardMenu;
