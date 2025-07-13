import style from './header.module.css';
import logo from "../../assets/logo.svg";
import dropdown_arrow from "../../assets/dropdown_arrow.png";
const Header = () => {
    return (
        <header className={style.header}>
            <nav className={style.nav__header}>
                <ul className={style.nav__links}>
                    <li className={style.nav__logo}>
                        <a href="/">
                            <img src={logo} alt="Logo" width={60} />
                        </a>
                    </li>
                    <li><a href="/">Tienda La Milanesa</a></li>
                </ul>
                <button className={style.nav__dropdown}>
                    Jorge Guardo<span className={style.nav__dropdown__icon}><img src={dropdown_arrow} alt="dropdown arrow" /></span>
                </button>
            </nav>
        </header>
    );
}

export default Header;