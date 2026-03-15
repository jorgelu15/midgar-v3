import { useClientes } from "./useClientes";
import { useInventario } from "./useInventario";

export const useTienda = () => {
    const { clientesQuery } = useClientes();
    const { productosQuery } = useInventario();

    

    return {
        clientesQuery,
        productosQuery
    };
}