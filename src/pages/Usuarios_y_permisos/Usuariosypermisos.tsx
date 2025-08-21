import Container from "../../features/Usuariosypermisos/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Usuariosypermisos = () => {
        useTitle();
    
    return ( 
        <>
            <Header />
            <Container />
        </>
     );
}
 
export default Usuariosypermisos;