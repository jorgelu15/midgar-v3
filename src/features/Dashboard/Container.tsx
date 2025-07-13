import { useNavigate } from "react-router-dom";
import { useShortcuts } from "../../hooks/useShortcodes"; // ajusta la ruta según tu estructura
import style from "./container.module.css";
import vender from "../../assets/vender.png";
import caja from "../../assets/caja.svg";
import clientes from "../../assets/clientes.png";
import inventario from "../../assets/inventario.png";
import fiados from "../../assets/fiado.png";
import stats from "../../assets/stats.png";
import settings from "../../assets/settings.png";
import CardMenu from "../../components/cards/CardMenu";
import { routes } from "../../utils/routes";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";

const menuItems = [
    { shortcode: "1", image: vender, title: "Vender", destiny: routes.vender },
    { shortcode: "2", image: caja, title: "Caja", destiny: routes.caja },
    { shortcode: "3", image: clientes, title: "Clientes", destiny: routes.clientes },
    { shortcode: "4", image: inventario, title: "Inventario", destiny: routes.inventario },
    { shortcode: "5", image: fiados, title: "Fiados", destiny: routes.fiados },
    { shortcode: "6", image: stats, title: "Estadísticas", destiny: routes.estadisticas },
    { shortcode: "7", image: settings, title: "Ajustes", destiny: routes.ajustes },
];

const items = [
    { label: "Dashboard", href: "/" },
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
        <div className={"container"}>
            <Breadcrumb items={items} />
            <div className={style.msg__welcome}>
                <h1>¡Hola Don John Lopez!</h1>
                <p>Hoy es Martes, 8 de julio</p>
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
};

export default Container;
