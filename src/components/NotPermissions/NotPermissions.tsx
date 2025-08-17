import { Link } from "react-router-dom";
import style from "./notpermissions.module.css"
import { routes } from "../../utils/routes";
import acceso_denegado from "../../assets/acceso_denegado.svg";
const NotPermissions = () => {
    return (
        <div className="container">

            <div className={style.notpermissions}>
                <div className={style.msg_alert}>
                    <img src={acceso_denegado} alt="acceso denegado" className={style.img} />
                    <div className={style.text}>
                        <h1>Acceso denegado</h1>
                        <p>Lo sentimos, no tienes permiso para acceder a esta página.</p>
                        <Link to={routes.dashboard} className="btn btn_primary" style={{width: "fit-content"}}>Volver al inicio</Link>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default NotPermissions;