import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { routes } from "../../utils/routes";
import style from "./container.module.css";

import GestionCategorias from "./GestionCategorias/GestionCategorias";
import GestionProveedores from "./GestionProveedores/GestionProveedores";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Configuración de inventario", href: routes.config_inventario },

];

const Container = () => {
    return (
        <div className="container">
            <Breadcrumb items={items} />
            <div className={style.msg__welcome}>
                <h1>Configuración de inventario</h1>
            </div>
            <div className={style.cards}>
                <GestionCategorias />
                <GestionProveedores />
            </div>

        </div>
    );
}

export default Container;