import Container from "../../features/Inventario/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const InventarioFisico = () => {
        useTitle();

    
    return ( 
        <>
            <Header />
            <Container />
        </>
     );
}
 
export default InventarioFisico;