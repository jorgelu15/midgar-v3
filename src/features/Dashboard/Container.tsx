import { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useShortcuts } from "../../hooks/useShortcodes"; // ajusta la ruta según tu estructura
import style from "./container.module.css";
import vender from "../../assets/vender.png";
import caja from "../../assets/caja.svg";
import clientes from "../../assets/clientes.png";
import InventarioFisico from "../../assets/inventario.png";
import contabilidadIcon from "../../assets/contabilidad.svg";
import fiados from "../../assets/fiado.png";
import stats from "../../assets/stats.png";
import settings from "../../assets/settings.png";
import { routes } from "../../utils/routes";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { useUserInfo } from "../../hooks/useUserInfo";
import SkeletonCard from "../../components/skeleton/SkeletonCard";
import SkeletonWelcome from "../../components/skeleton/SkeletonWelcome";
const CardMenu = lazy(() => import("../../components/cards/CardMenu"));

const menuItems = [
    { shortcode: "1", image: vender, title: "Vender", codigo_permiso: "VENTAS", destiny: routes.vender },
    { shortcode: "2", image: caja, title: "Caja", codigo_permiso: "CAJA", destiny: routes.caja },
    { shortcode: "3", image: clientes, title: "Clientes", codigo_permiso: "CLIENTES", destiny: routes.clientes },
    { shortcode: "4", image: InventarioFisico, title: "Inventario Físico", codigo_permiso: "GESTION_INVENTARIO", destiny: routes.InventarioFisico },
    { shortcode: "5", image: fiados, title: "Fiados", codigo_permiso: "GESTION_FIADOS", destiny: routes.fiados },
    { shortcode: "6", image: stats, title: "Estadísticas", codigo_permiso: "GESTION_ESTADISTICAS", destiny: routes.estadisticas },
    { shortcode: "7", image: contabilidadIcon, title: "Contabilidad", codigo_permiso: "GESTION_CONTABILIDAD", destiny: routes.contabilidad },
    { shortcode: "8", image: settings, title: "Ajustes", codigo_permiso: "GESTION_AJUSTES", destiny: routes.ajustes },
];

const items = [
    { label: "Dashboard", href: "/" },
];

const Container = () => {
    const navigate = useNavigate();
    const { usuarioQuery } = useUserInfo();
    console.log(usuarioQuery.data);
    const user = usuarioQuery.data;
    function obtenerFechaEstilo(): string {
        const fecha = new Date();

        const opciones: Intl.DateTimeFormatOptions = {
            weekday: "long", // <- ahora es literal, no string genérico
            day: "numeric",
            month: "long"
        };

        const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);

        // Capitalizar la primera letra
        return `Hoy es ${fechaFormateada.charAt(0).toUpperCase()}${fechaFormateada.slice(1)}`;
    }


    // Construir los atajos a partir de menuItems
    const shortcuts = menuItems.reduce((map, item) => {
        map[item.shortcode] = () => navigate(item.destiny);
        return map;
    }, {} as Record<string, () => void>);

    useShortcuts(shortcuts);

    return (
        <div className={"container"}>
            <Breadcrumb items={items} />


            {usuarioQuery.isLoading ? (
                <SkeletonWelcome />
            ) : (
                <div className={style.msg__welcome}>
                    <h1>¡Hola Don {user?.nombre}!</h1>
                    <p>{obtenerFechaEstilo()}</p>
                </div>
            )}
            <div className={style.cards}>
                {usuarioQuery.isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    <>
                        {
                            menuItems.map((item, index) => (
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
                            ))
                        }
                    </>
                )}
            </div>
        </div>
    );
};

export default Container;
