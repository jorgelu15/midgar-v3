import style from "./cardgestion.module.css"

type CardGestionProps = {
    icon: string;
    title: string;
    description: string;
    openModal: () => void;
}

const CardGestion = ({ icon, title, description, openModal }: CardGestionProps) => {
    return (
        <div className={style.card_gestion}>
            <div className={style.icon__card}>
                <img src={icon} alt={"icono de " + title} width={40} />
            </div>
            <div className={style.card__info}>
                <div className={style.card__info_text}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
                <div className={style.card__button}>
                    <button className="btn  btn_secondary" onClick={openModal}>Gestionar</button>
                </div>
            </div>
        </div>
    );
}

export default CardGestion;