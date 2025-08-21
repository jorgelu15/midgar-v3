import Container from "../../features/CatalogoCuentas/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const CatalogoCuentas = () => {
    useTitle();

    return (
        <>
            <Header />
            <Container />
        </>
    );
}

export default CatalogoCuentas;