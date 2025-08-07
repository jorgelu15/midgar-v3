import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { routes } from "../../utils/routes";
import style from "./container.module.css";
import { useShortcuts } from "../../hooks/useShortcodes";
import CardMenu from "../../components/cards/CardMenu";
import volver from "../../assets/volver.svg";
import tienda from "../../assets/tienda.svg";
import factura_manual from "../../assets/factura_manual.svg";
import wash from "../../assets/wash.svg";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Vender", href: routes.vender },
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
    { shortcode: "1", image: tienda, title: "Tienda", destiny: routes.tienda },
    { shortcode: "2", image: factura_manual, title: "Factura manual", destiny: routes.factura_manual },
    { shortcode: "3", image: wash, title: "Auto lavado", destiny: routes.autolavado },

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
                <h1>Vender</h1>
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