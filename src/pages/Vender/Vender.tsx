import Container from "../../features/Vender/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Vender = () => {
        useTitle();
    
    return (
        <>
            <Header />
            <Container />
        </>
    );
}

export default Vender;
