import { useQuery } from "@tanstack/react-query";
import api from "../config/axios";
import { useAuth } from "./useAuth";

export const useUserInfo = () => {
    const { usuario } = useAuth();

    const fetchUsuario = async () => {
        const res = await api.get(`/gestion-de-usuarios/usuarios/${usuario?.id_usuario}`);
        return res.data;
    };

    const usuarioQuery = useQuery({
        queryKey: ["usuario", usuario?.id_usuario],
        queryFn: fetchUsuario,
        refetchOnWindowFocus: true,
        enabled: usuario?.id_usuario != null
    });
    
    return {
        usuarioQuery
    };
};