import { useContext } from "react"
import authContext from "../context/authentication/authContext";

export const useAuth = () => {
    const { isAuthenticated, usuario, msg, cargando, signIn, signUp, enableMFA, verifyMFA, usuarioAutenticado, logOut }: any = useContext(authContext);
rev
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