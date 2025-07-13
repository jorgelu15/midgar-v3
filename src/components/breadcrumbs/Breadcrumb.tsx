import style from "./breadcrumb.module.css";

type Crumb = {
    label: string;
    href?: string; // si no se pasa, se considera como "actual"
};

type BreadcrumbProps = {
    items: Crumb[];
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <nav className={style.breadcrumb}>
            {items?.map((item, index) => (
                <span key={index}>
                    {item.href ? (
                        <a href={item.href} style={{marginRight: "10px"}}>{item.label}</a>
                    ) : (
                        <span className={style.current}>{item.label}</span>
                    )}
                    {index < items.length - 1 && <span>/</span>}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;
