import { typeState } from "../../models/types/producto.state";


export default (state: any, action: any) => {
    switch (action.type) {
        case typeState.INSERTAR_PRODUCT_EXITOSO:
            const producto = action.payload.producto;
            return {
                ...state,
                producto: producto
            };
        default:
            return state;
    }
};