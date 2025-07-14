import style from './header.module.css';
import logo from "../../assets/logo.svg";
import dropdown_arrow from "../../assets/dropdown_arrow.png";
import { routes } from '../../utils/routes';
import { Link } from 'react-router-dom';
const Header = () => {
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
                <button className={style.nav__dropdown}>
                    Jorge Guardo<span className={style.nav__dropdown__icon}><img src={dropdown_arrow} alt="dropdown arrow" /></span>
                </button>
            </nav>
        </header>
    );
}

export default Header;