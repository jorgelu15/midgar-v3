import Container from "../../features/Autolavado/Container";
import { useTitle } from "../../hooks/useTitle";

const Autolavado = () => {
    useTitle();
    return ( 
        <>
            <Container />
        </>
     );
}
 
export default Autolavado;