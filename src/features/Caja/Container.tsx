import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import CardMenu from "../../components/cards/CardMenu";
import { routes } from "../../utils/routes";
import style from "./container.module.css";
import volver from "../../assets/volver.svg";
import open_wallet from "../../assets/open_wallet.svg";
import close_wallet from "../../assets/close_wallet.svg";
import recogida_money from "../../assets/recogida.svg";
import { useNavigate } from "react-router-dom";
import { useShortcuts } from "../../hooks/useShortcodes";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Caja", href: routes.caja },
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
    { shortcode: "1", image: open_wallet, title: "Apertura", destiny: routes.apertura },
    { shortcode: "2", image: close_wallet, title: "Cierre", destiny: routes.cierre },
    { shortcode: "3", image: recogida_money, title: "Recogida", destiny: routes.recogida },
];
const Container = () => {
    const navigate = useNavigate();

    // Construir los atajos a partir de menuItems
        const shortcuts = menuItems.reduce((map, item) => {
            map[item.shortcode] = () => navigate(item.destiny);
            return map;
        }, {} as Record<string, () => void>);
    
        useShortcuts(shortcuts);

    return (
        <div className="container">
            <Breadcrumb items={items} />
            <div className={style.msg__welcome}>
                <h1>Caja</h1>
            </div>
            <div className={style.cards}>
                {menuItems.map((item, index) => (
                    <CardMenu
                        key={index}
                        shortcode={item.shortcode}
                        image={item.image}
                        title={item.title}
                        redirect={() => navigate(item.destiny)}
                        to={item.destiny}
                    />
                ))}
            </div>
        </div>
    );
}

export default Container;