import style from './header.module.css';
import logo from "../../assets/logo.svg";
import turnoff from "../../assets/turnoff.svg";
import { routes } from '../../utils/routes';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
const Header = () => {
    const { logOut } = useAuth();
    return (
        <header className={style.header}>
            <nav className={style.nav__header}>
                <ul className={style.nav__links}>
                    <li className={style.nav__logo}>
                        <Link to={routes.dashboard}>
                            <img src={logo} alt="Logo" width={60} />
                        </Link>
                    </li>
                    <li><Link to={routes.dashboard}>Tienda La Milanesa</Link></li>
                </ul>
                <button className={style.nav__dropdown} onClick={() => logOut() }>
                    <img src={turnoff} alt="dropdown arrow" className={style.nav__dropdown__icon} />
                </button>
            </nav>
        </header>
    );
}

export default Header;