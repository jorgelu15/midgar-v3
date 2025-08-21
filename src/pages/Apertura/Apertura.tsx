import Header from "../../layout/Menus/Header";
import Container from "../../features/Apertura/Container";
import { useTitle } from "../../hooks/useTitle";



const Apertura = () => {
    useTitle();

    return (
        <>
            <Header />
            <Container />
        </>
    );
}

export default Apertura;