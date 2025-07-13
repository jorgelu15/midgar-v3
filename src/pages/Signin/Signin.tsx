import { Link, useNavigate } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from "react-toastify";
import logo from '../../assets/Logodark.png';
import style from './signin.module.css';
import eye from "../../assets/eye.png";
import noEye from "../../assets/noeye.png";
import { routes } from '../../utils/routes';
import { useForm } from '../../hooks/useForm';
import { useState } from 'react';
const Signin = () => {
    const navigate = useNavigate();
    const { form, onChangeGeneral } = useForm({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onAuthenticate = (e: any) => {
        e.preventDefault();

        if (form.email.trim() === "" || form.password.trim() === "") {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        navigate(routes.dashboard)

        // signIn(form.email, form.password).then((data: any) => {
        //     if (data.status === 200) {
        //         navigate(rutas.verifyMFA+`?userId=${data.data.token.userId}`);
        //     }
        // }).catch((error: any) => {
        //     toast.error(error.response?.data?.error);
        // });
    };
    return (
        <div className={style.container}>
            <div className={style.account}>
                <div className={style.logo}>
                    <img src={logo} />
                </div>
                <h1>Iniciar sesión</h1>
                <div className={style.box_account}>
                    <div className={style.form_control}>
                        <label>Correo electrónico</label>
                        <input
                            required
                            value={form.email}
                            onChange={(e) => onChangeGeneral(e, "email")}
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                        />
                    </div>
                    <div className={style.form_control}>
                        <label>Contraseña</label>
                        <div className={style.password_container}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => onChangeGeneral(e, "password")}
                                placeholder="Ingresa tu contraseña"
                                required
                                className={style.password_input}
                            />
                            <img
                                src={showPassword ? noEye : eye}
                                width={24}
                                onClick={() => setShowPassword(!showPassword)}
                                className={style.eye_icon}
                            />
                        </div>
                    </div>
                </div>
                <button onClick={onAuthenticate} className={`btn btn_primary`} style={{ justifyContent: "center" }}>Iniciar sesión</button>
                <div className={style.divider}>O</div>
                <p className={style.register}>¿Aun no tiene una cuenta? <Link to={routes.signup}>Solicitala gratis</Link></p>
                <p className={style.register}>Ingresa con todas la credenciales a todos los productos de Midgar</p>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    );
}

export default Signin;