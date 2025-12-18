import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useEffect } from "react";
import { useUserInfo } from "./useUserInfo";

export const useContabilidad = () => {
    const { usuarioQuery } = useUserInfo();
    const queryClient = useQueryClient();

    const fetchPUC = async (pageParam: number = 0) => {
        const res = await api.get(`/contabilidad/cuentas-contables/arbol/${usuarioQuery?.data?.empresa.id_empresa}`, {
            params: { page: pageParam }
        });
        return res.data;
    };

    useEffect(() => {
        if (usuarioQuery?.data?.empresa.id_empresa) {
            queryClient.invalidateQueries({ queryKey: ['puc', usuarioQuery?.data?.empresa.id_empresa] });
        }
    }, [usuarioQuery?.data?.empresa.id_empresa]);

    const pucQuery = useQuery({
        queryKey: ['puc', usuarioQuery?.data?.empresa.id_empresa],
        queryFn: () => fetchPUC(),
        enabled: usuarioQuery?.data?.empresa.id_empresa != null,
        refetchOnWindowFocus: true,
    });




    return {
        pucQuery,
    };
};