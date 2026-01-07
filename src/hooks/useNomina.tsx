import { useQuery } from "@tanstack/react-query";
import api from "../config/axios";
import { useUserInfo } from "./useUserInfo";

export const useNomina = () => {
    const { usuarioQuery } = useUserInfo();

    const getNomina = async (id_usuario: number) => {
        const res = await api.get(`/nomina/${id_usuario}`);
        return res.data;
    };

    const nominaQuery = useQuery({
        queryKey: ["nomina", usuarioQuery.data?.id_usuario],
        queryFn: () => getNomina(usuarioQuery.data?.empresa.id_empresa),
        enabled: usuarioQuery.data?.empresa.id_empresa != null,
        refetchOnWindowFocus: true,
    });


    return {
        nominaQuery
    }
}