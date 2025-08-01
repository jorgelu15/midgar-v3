import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import CatalogoCuentas from "./CatalogoCuentas/CatalogoCuentas";
import style from "./container.module.css";


const items = [
    { label: "Dashboard", href: "/" },
];

const Container = () => {
    return (
        <div className="container">
            <Breadcrumb items={items} />
            <div className={style.msg__welcome}>
                <h1>Catalogo de cuentas</h1>
            </div>
            <CatalogoCuentas />
        </div>
    );
}

export default Container;