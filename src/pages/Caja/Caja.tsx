import Container from "../../features/Caja/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Caja = () => {
    useTitle();

    return (
        <>
            <Header />
            <Container />
        </>
    );
}

export default Caja;