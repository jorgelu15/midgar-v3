import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

export const useContabilidad = () => {
    const { usuario } = useAuth();
    const queryClient = useQueryClient();

    const fetchPUC = async (pageParam: number = 0) => {
        const res = await api.get(`/contabilidad/cuentas-contables/arbol/${usuario?.id_inst}`, {
            params: { page: pageParam }
        });
        return res.data;
    };

    useEffect(() => {
        if (usuario?.id_inst) {
            queryClient.invalidateQueries({ queryKey: ['puc', usuario.id_inst] });
        }
    }, [usuario?.id_inst]);

    const pucQuery = useQuery({
        queryKey: ['puc', usuario?.id_inst],
        queryFn: () => fetchPUC(),
        enabled: usuario?.id_inst != null,
        refetchOnWindowFocus: true,
    });




    return {
        pucQuery,
    };
};