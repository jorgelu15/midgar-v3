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
import { useUserInfo } from "../../hooks/useUserInfo";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Vender", href: routes.vender },
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", codigo_permiso: "POS_NORMAL", destiny: routes.dashboard },
    { shortcode: "1", image: tienda, title: "Tienda", codigo_permiso: "POS_NORMAL", destiny: routes.tienda },
    { shortcode: "2", image: factura_manual, title: "Factura manual", codigo_permiso: "FACTURA_MANUAL", destiny: routes.factura_manual },
    { shortcode: "3", image: wash, title: "Auto lavado", codigo_permiso: "AUTO_LAVADO", destiny: routes.autolavado },

];
const Container = () => {
    const { usuarioQuery } = useUserInfo();
        const user = usuarioQuery.data;
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
                        codigo_permiso={item.codigo_permiso}
                        permisos={user?.permisos}
                    />
                ))}
            </div>
        </div>
    );
}

export default Container;