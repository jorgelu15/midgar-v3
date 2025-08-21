import Container from "../../features/Clientes/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Clientes = () => {
    useTitle();

    return (
        <>
            <Header />
            <Container />
        </>
    );
}

export default Clientes;