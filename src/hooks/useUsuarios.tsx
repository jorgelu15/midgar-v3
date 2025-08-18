import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useAuth } from "./useAuth";
import { useContext } from "react";
import GestionDeUsuariosContext from "../context/gestion-de-usuarios/gestion-de-usuariosContext";
import type { UsuarioDTO } from "../models/dtos/usuario.dto";


export const useUsuarios = (empleado?: string | null) => {
    const { usuario } = useAuth();
    const {
        createCuentaEmpleados,
        updateCuentaEmpleados,
        asignarPermisos,
        quitarPermisos, crearRol }: any = useContext(GestionDeUsuariosContext);
    const queryClient = useQueryClient();

    const fetchUsuario = async () => {
        const res = await api.get(`/gestion-de-usuarios/usuarios/${empleado}`);
        return res.data;
    };

    const fetchUsuariosByCliente = async () => {
        const res = await api.get(`/gestion-de-usuarios/cliente/${usuario?.id_cliente}/usuarios`);
        return res.data;
    };

    const usuariosByClienteQuery = useQuery({
        queryKey: ["usuarios", usuario?.id_cliente],
        queryFn: fetchUsuariosByCliente,
        refetchOnWindowFocus: true,
        enabled: usuario?.id_cliente != null
    });

    const fetchRolesByCliente = async () => {
        const res = await api.get(`/gestion-de-usuarios/cliente/${usuario?.id_cliente}/roles`);
        return res.data;
    };

    const rolesByClienteQuery = useQuery({
        queryKey: ["roles", usuario?.id_cliente],
        queryFn: fetchRolesByCliente,
        refetchOnWindowFocus: true,
        enabled: usuario?.id_cliente != null
    });

    const fetchGetAllPermisosByCliente = async () => {
        const res = await api.get(`/gestion-de-usuarios/cliente/${usuario?.id_cliente}/permisos`);
        return res.data;
    }

    const permisosByClienteQuery = useQuery({
        queryKey: ["permisos", usuario?.id_cliente],
        queryFn: fetchGetAllPermisosByCliente,
        refetchOnWindowFocus: true,
        enabled: usuario?.id_cliente != null
    });

    const usuarioInfoQuery = useQuery({
        queryKey: ["usuario", empleado],
        queryFn: fetchUsuario,
        refetchOnWindowFocus: true,
        enabled: empleado != null
    });




    // esto sirve para crear un empleado y se actualiza el cache en "tiempo real"
    const createEmpleadoMutation = useMutation({
        mutationFn: (usuario: UsuarioDTO) => createCuentaEmpleados(usuario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios", usuario?.id_cliente] });
        }
    });

    const updateEmpleadoMutation = useMutation({
        mutationFn: (usuario: UsuarioDTO) => updateCuentaEmpleados(usuario.id_cliente, usuario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios", usuario?.id_cliente] });
        }
    });

    const asignarPermisosMutation = useMutation({
        mutationFn: (permiso: any) => asignarPermisos(permiso),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permisos", usuario?.id_cliente] });
        }
    });

    const quitarPermisosMutation = useMutation({
        mutationFn: (permiso: any) => quitarPermisos(permiso),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permisos", usuario?.id_cliente] });
        }
    });




    return {
        usuariosByClienteQuery,
        rolesByClienteQuery,
        permisosByClienteQuery,
        usuarioInfoQuery,
        createEmpleadoMutation,
        updateEmpleadoMutation,
        asignarPermisosMutation,
        quitarPermisosMutation,
        crearRol,
        usuario
    };
};