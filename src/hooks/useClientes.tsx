import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import GestionDeClientesContext from "../context/gestion-de-clientes/gestion-de-clientesContext";

import { useUserInfo } from "./useUserInfo";
import { useContext } from "react";
import type { ClienteDTO } from "../models/dtos/cliente.dto";

export const useClientes = () => {
    const { usuarioQuery } = useUserInfo();
    const {
        createCliente,
        updateCliente,
        deleteCliente
    }: any = useContext(GestionDeClientesContext);
    const queryClient = useQueryClient();

    const fetchClientes = async () => {
        const res = await api.get(`/clientes/${usuarioQuery.data?.empresa.id_empresa}`);
        return res.data;
    };

    const clientesQuery = useQuery({
        queryKey: ["clientes", usuarioQuery.data?.empresa.id_empresa],
        queryFn: fetchClientes,
        refetchOnWindowFocus: true,
        enabled: usuarioQuery.data?.empresa.id_empresa != null
    });

    const createClienteMutation = useMutation({
        mutationFn: (cliente: ClienteDTO) => createCliente(cliente),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clientes", usuarioQuery.data?.empresa.id_empresa] });
        }
    });

    const updateClienteMutation = useMutation({
        mutationFn: (cliente: ClienteDTO) => updateCliente(cliente),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clientes", usuarioQuery.data?.empresa.id_empresa] });
        }
    });

    const deleteClienteMutation = useMutation({
        mutationFn: (cedula: string) => deleteCliente(cedula),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clientes", usuarioQuery.data?.empresa.id_empresa] });
        }
    });

    return {
        clientesQuery,
        createClienteMutation,
        updateClienteMutation,
        deleteClienteMutation
    }
}