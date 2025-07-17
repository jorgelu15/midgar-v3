const typeState = {
    LOGIN_EXITOSO: 'LOGIN_EXITOSO',
    LOGIN_ERROR: 'LOGIN_ERROR',
    REGISTRO_EXITOSO: 'REGISTRO_EXITOSO',
    REGISTRO_ERROR: 'REGISTRO_ERROR',
    USUARIO_AUTENTICADO: 'USUARIO_AUTENTICADO',
    CERRAR_SESION: 'CERRAR_SESION',
}

export default (state: any, action: any) => {
    switch (action.type) {
        case typeState.LOGIN_EXITOSO:
        case typeState.USUARIO_AUTENTICADO:
            const usuario = action.payload.user;
            return {
                ...state,
                usuario: usuario,
                isAuthenticated: action.payload.authenticated,
            };
        case typeState.CERRAR_SESION:
            return {
                ...state,
                usuario: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};