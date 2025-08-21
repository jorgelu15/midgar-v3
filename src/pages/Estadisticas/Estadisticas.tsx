import Container from "../../features/Estadisticas/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Estadisticas = () => {
        useTitle();
    
    return ( 
        <>
            <Header />
            <Container />
        </>
     );
}
 
export default Estadisticas;