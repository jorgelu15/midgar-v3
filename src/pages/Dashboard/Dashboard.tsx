import Container from "../../features/Dashboard/Container";
import { useTitle } from "../../hooks/useTitle";
import Header from "../../layout/Menus/Header";

const Dashboard = () => {
        useTitle();
    
    return ( 
        <>
            <Header />
            <Container />
        </>
    );
}
 
export default Dashboard;