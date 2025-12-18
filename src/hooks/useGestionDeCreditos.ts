import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import GestionDeCreditosContext from "../context/gestion-de-creditos/gestion-de-creditosContext";

import { useUserInfo } from "./useUserInfo";
import { useContext } from "react";
import type { CuentaCreditoDTO } from "../models/dtos/cuenta-credito.dto";

export const useGestionDeCreditos = () => {
    const { usuarioQuery } = useUserInfo();
    const {
        createCredito,
        updateCredito,
        deleteCredito
    }: any = useContext(GestionDeCreditosContext);
    const queryClient = useQueryClient();

    const fetchCreditos = async () => {
        const res = await api.get(`/gestion-de-creditos/creditos/${usuarioQuery.data?.empresa.id_empresa}`);
        return res.data;
    };

    const cuentaCreditoQuery = useQuery({
        queryKey: ["cuentasCredito", usuarioQuery.data?.empresa.id_empresa],
        queryFn: fetchCreditos,
        refetchOnWindowFocus: true,
        enabled: usuarioQuery.data?.empresa.id_empresa != null
    });

    const createCreditoMutation = useMutation({
        mutationFn: (cuentaCredito: CuentaCreditoDTO) => createCredito(cuentaCredito),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clientes", usuarioQuery.data?.empresa.id_empresa] });
        }
    });

    const updateCreditoMutation = useMutation({
        mutationFn: (cuentaCredito: CuentaCreditoDTO) => updateCredito(cuentaCredito),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cuentasCredito", usuarioQuery.data?.empresa.id_empresa] });
        }
    });

    const deleteCreditoMutation = useMutation({
        mutationFn: (id_cuenta_credito: string) => deleteCredito(id_cuenta_credito),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cuentasCredito", usuarioQuery.data?.empresa.id_empresa] });
        }
    });

    return {
        cuentaCreditoQuery,
        createCreditoMutation,
        updateCreditoMutation,
        deleteCreditoMutation
    }
}