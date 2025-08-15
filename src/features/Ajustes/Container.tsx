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
import { useUserInfo } from "../../hooks/useUserInfo";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Ajustes", href: routes.ajustes },
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", codigo_permiso: "", destiny: routes.dashboard },
    { shortcode: "1", image: permisos_usuario, title: "Usuarios y permisos", codigo_permiso: "USUARIOS_PERMISOS", destiny: routes.usuariosPermisos },
    { shortcode: "2", image: access_account, title: "Cuenta y acceso", codigo_permiso: "CUENTA_ACCESO", destiny: routes.cuentaAcceso },
    { shortcode: "3", image: business, title: "Negocio", codigo_permiso: "BUSINESS", destiny: routes.negocio },
    { shortcode: "4", image: InventarioFisicos, title: "InventarioFisico", codigo_permiso: "INVENTARIO_FISICO", destiny: routes.InventarioFisico },
    { shortcode: "5", image: ventas, title: "Ventas", codigo_permiso: "VENTAS", destiny: routes.ventasConfig },
    { shortcode: "6", image: clientes_credits, title: "Clientes y créditos", codigo_permiso: "CLIENTES_CREDITOS", destiny: routes.ajustes },
    { shortcode: "7", image: reports, title: "Reportes y estadísticas", codigo_permiso: "REPORTE_ESTADISTICA", destiny: routes.configuracionReportes },
    { shortcode: "8", image: palette, title: "Estilo e interfaz", codigo_permiso: "", destiny: routes.estiloInterfaz },
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
                        permisos={user?.permisos}
                        codigo_permiso={item.codigo_permiso}
                    />
                ))}
            </div>
        </div>
    );
}

export default Container;