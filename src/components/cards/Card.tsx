import style from "./cardmenu.module.css";

interface CardProps {
    shortcode: string;
    title: string;
    chooseMethod: () => void;
}

const Card = ({shortcode, title, chooseMethod}: CardProps) => {
    return (
        <div className={style.card} onClick={chooseMethod}>
            <span className={style.atajo}>( {shortcode.slice(0,3)} )</span>
            <p>{title.charAt(0).toUpperCase() + title.slice(1)}</p>
        </div>
    );
}

export default Card;