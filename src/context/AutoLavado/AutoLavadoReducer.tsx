import { typeState } from "../../models/types/cuenta.state";


export default (state: any, action: any) => {
    switch (action.type) {
        case typeState.INSERTAR_CUENTA_EXITOSO:
            const cuenta = action.payload.cuenta;
            return {
                ...state,
                cuenta: cuenta
            };
        default:
            return state;
    }
};