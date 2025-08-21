import Container from "../../features/EstiloInterfaz/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const EstiloInterfaz = () => {
        useTitle();
    
    return ( 
        <>
            <Header />
            <Container />
        </>
     );
}
 
export default EstiloInterfaz;