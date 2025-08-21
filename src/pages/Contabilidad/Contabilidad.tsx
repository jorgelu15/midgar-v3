import Container from "../../features/Contabilidad/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Contabilidad = () => {
        useTitle();
    
    return ( 
        <>
            <Header />
            <Container />
        </>
     );
}
 
export default Contabilidad;