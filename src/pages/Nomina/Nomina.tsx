import Container from "../../features/Nomina/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Nomina = () => {
    useTitle();

    return (
        <>
            <Header />
            <Container />
        </>
    );
}

export default Nomina;