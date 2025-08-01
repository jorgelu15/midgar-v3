import { useContext } from "react"
import authContext from "../context/Authentication/authContext";

export const useAuth = () => {
    const { isAuthenticated, usuario, msg, cargando, signIn, signUp, enableMFA, verifyMFA, usuarioAutenticado, logOut }: any = useContext(authContext);

    return {
        isAuthenticated,
        usuario,
        msg,
        cargando,
        signIn,
        signUp,
        enableMFA,
        verifyMFA,
        usuarioAutenticado,
        logOut
    }
}