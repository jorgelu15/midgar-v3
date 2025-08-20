import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import CardMenu from "../../components/cards/CardMenu";
import style from "./container.module.css";
import { routes } from "../../utils/routes";

import volver from "../../assets/volver.svg";
import catalogoicon from "../../assets/catalogoCuentas.svg";
import { useShortcuts } from "../../hooks/useShortcodes";
import { useUserInfo } from "../../hooks/useUserInfo";

const items = [
    { label: "Dashboard", href: "/" },
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
    { shortcode: "1", image: catalogoicon, title: "Catálogo de cuentas", destiny: routes.catalogo },
];

const Container = () => {
    const navigate = useNavigate();
     const { usuarioQuery } = useUserInfo()
      const user = usuarioQuery.data;

    const shortcuts = menuItems.reduce((map, item) => {
        map[item.shortcode] = () => navigate(item.destiny);
        return map;
    }, {} as Record<string, () => void>);

    useShortcuts(shortcuts);

    return (
        <div className="container">
            <Breadcrumb items={items} />
            <div className={style.msg__welcome}>
                <h1>Contabilidad</h1>
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
                        codigo_permiso=""
                        permisos={user?.permisos}
                    />
                ))}
            </div>
        </div>
    );
}

export default Container;