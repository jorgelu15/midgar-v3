import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import CardMenu from "../../components/cards/CardMenu";
import style from "./container.module.css";
import { useShortcuts } from "../../hooks/useShortcodes";
import { routes } from "../../utils/routes";
import permisos_usuario from "../../assets/permisos_usuario.svg";
import access_account from "../../assets/access_account.svg";
import business from "../../assets/business.svg";
import InventarioFisicos from "../../assets/inventory.svg"
import volver from "../../assets/volver.svg";
import ventas from "../../assets/ventas.svg";
import clientes_credits from "../../assets/clientes_credits.svg";
import reports from "../../assets/stats_mode.svg";
import palette from "../../assets/palette.svg";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Ajustes", href: routes.ajustes },
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.dashboard },
    { shortcode: "1", image: permisos_usuario, title: "Usuarios y permisos", destiny: routes.usuariosPermisos },
    { shortcode: "2", image: access_account, title: "Cuenta y acceso", destiny: routes.cuentaAcceso },
    { shortcode: "3", image: business, title: "Negocio", destiny: routes.negocio },
    { shortcode: "4", image: InventarioFisicos, title: "InventarioFisico", destiny: routes.InventarioFisico },
    { shortcode: "5", image: ventas, title: "Ventas", destiny: routes.ventasConfig },
    { shortcode: "6", image: clientes_credits, title: "Clientes y créditos", destiny: routes.ajustes },
    { shortcode: "7", image: reports, title: "Reportes y estadísticas", destiny: routes.configuracionReportes },
    { shortcode: "8", image: palette, title: "Estilo e interfaz", destiny: routes.estiloInterfaz },
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
                <h1>Ajustes</h1>
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