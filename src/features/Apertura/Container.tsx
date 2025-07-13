import { useNavigate } from "react-router-dom";
import style from "./container.module.css"
import CardMenu from "../../components/cards/CardMenu";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { routes } from "../../utils/routes";
import volver from "../../assets/volver.svg";
import confirm__wallet from "../../assets/confirm_wallet.svg";
import { useForm } from "../../hooks/useForm";
import { useShortcuts } from "../../hooks/useShortcodes";

const items = [
    { label: "Dashboard", href: routes.dashboard },
    { label: "Caja", href: routes.caja },
    { label: "Apertura", href: routes.apertura }
];

const menuItems = [
    { shortcode: "Escape", image: volver, title: "Volver", destiny: routes.caja },
    { shortcode: "1", image: confirm__wallet, title: "Confirmar", destiny: routes.usuariosPermisos },
];


const Container = () => {
    const navigate = useNavigate();

    const { form, onChangeGeneral } = useForm({
        moneda: "Pesos",
        efectivo: 0,
        tarjetaCredito: 0,
        tarjetaDebito: 0,
        cheque: 0,
        otros: 0
    });

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
                <h1>Apertura</h1>
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

            <div className={style.table_container}>
                <form className={style.form}>
                    <div className={style.form_control}>
                        <label>Moneda</label>
                        <div className={style.password_container}>
                            <input
                                disabled
                                type="text"
                                placeholder="Ingresa la moneda que se manejara"
                                required
                                value={form.moneda}
                                onChange={(e) => onChangeGeneral(e, "moneda")}
                                className={style.password_input}
                            />
                        </div>
                    </div>
                    <div className={style.form_control}>
                        <label>Efectivo</label>
                        <div className={style.password_container}>
                            <input
                                type="text"
                                placeholder="Ingresa el efectivo de apertura"
                                required
                                value={form.efectivo}
                                onChange={(e) => onChangeGeneral(e, "efectivo")}
                                className={style.password_input}
                            />
                        </div>
                    </div>
                    <div className={style.form_control}>
                        <label>Tarjeta crédito</label>
                        <div className={style.password_container}>
                            <input
                                type="text"
                                placeholder="Ingresa el saldo de tarjeta crédito de apertura"
                                required
                                value={form.tarjetaCredito}
                                onChange={(e) => onChangeGeneral(e, "tarjetaCredito")}
                                className={style.password_input}
                            />
                        </div>
                    </div>
                    <div className={style.form_control}>
                        <label>Tarjeta débito</label>
                        <div className={style.password_container}>
                            <input
                                type="text"
                                placeholder="Ingresa el saldo de tarjeta débito de apertura"
                                required
                                value={form.tarjetaDebito}
                                onChange={(e) => onChangeGeneral(e, "tarjetaDebito")}
                                className={style.password_input}
                            />
                        </div>
                    </div>
                    <div className={style.form_control}>
                        <label>Cheque</label>
                        <div className={style.password_container}>
                            <input
                                type="text"
                                placeholder="Ingresa el saldo de cheque de apertura"
                                required
                                value={form.cheque}
                                onChange={(e) => onChangeGeneral(e, "cheque")}
                                className={style.password_input}
                            />
                        </div>
                    </div>
                    <div className={style.form_control}>
                        <label>Otras</label>
                        <div className={style.password_container}>
                            <input
                                type="text"
                                placeholder="Ingresa el efectivo de apertura"
                                required
                                value={form.otros}
                                onChange={(e) => onChangeGeneral(e, "otros")}
                                className={style.password_input}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Container;