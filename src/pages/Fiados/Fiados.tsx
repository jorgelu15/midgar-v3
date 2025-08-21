import Container from "../../features/Fiados/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Fiados = () => {
    useTitle();

    return (
        <>
            <Header />
            <Container />
        </>
    );
}

export default Fiados;