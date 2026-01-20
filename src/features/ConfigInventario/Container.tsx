import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { routes } from "../../utils/routes";
import style from "./container.module.css";

import GestionCategorias from "./GestionCategorias/GestionCategorias";
import GestionMarcas from "./GestionMarcas/GestionMarcas";
import GestionProveedores from "./GestionProveedores/GestionProveedores";
import GestionUnidadMedida from "./GestionUnidadMedida/GestionUnidadMedida";

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
                <GestionMarcas />
                <GestionProveedores />
                <GestionUnidadMedida />
            </div>
        </div>
    );
}

export default Container;