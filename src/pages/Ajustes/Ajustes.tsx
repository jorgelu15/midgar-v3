import Container from "../../features/Ajustes/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Ajustes = () => {
    useTitle();
    return ( 
        <>
            <Header />
            <Container />
        </>
     );
}
 
export default Ajustes;