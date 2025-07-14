import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import SelectFont from "../../components/fuente/SelectFont";
import ThemeSelector from "../../components/Tema/ThemeSelector";
import { routes } from "../../utils/routes";
import style from "./container.module.css";


const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Ajustes", href: routes.ajustes },
    { label: "Estilo e interfaz", href: routes.estiloInterfaz }
];

const Container = () => {

    return (
        <div className="container">
            <Breadcrumb items={items} />
            <div className={style.fuente}>
                <p className={style.title}>Tamaño de fuente</p>
                <SelectFont />
            </div>
            <div className={style.fuente}>
                <p className={style.title}>Color de fondo</p>
                <ThemeSelector />
            </div>
        </div>
    );
}

export default Container;