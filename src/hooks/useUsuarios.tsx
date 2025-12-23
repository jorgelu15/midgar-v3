import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useAuth } from "./useAuth";
import { useContext } from "react";
import GestionDeUsuariosContext from "../context/gestion-de-usuarios/gestion-de-usuariosContext";
import type { UsuarioDTO } from "../models/dtos/usuario.dto";


export const useUsuarios = (empleado?: string | null, id_rol?: string | null) => {
    const { usuario } = useAuth();
    const {
        createCuentaEmpleados,
        updateCuentaEmpleados,
        asignarPermisos,
        quitarPermisos, crearRol, asignarRol
     }: any = useContext(GestionDeUsuariosContext);
    const queryClient = useQueryClient();

    const fetchUsuario = async () => {
        const res = await api.get(`/gestion-de-usuarios/usuarios/${empleado}`);
        return res.data;
    };
    
    const fetchUsuariosByCliente = async () => {
        const res = await api.get(`/gestion-de-usuarios/empresa/${usuario?.id_empresa}/usuarios`);
        return res.data;
    };

    const fetchRolesByCliente = async () => {
        const res = await api.get(`/gestion-de-usuarios/empresa/${usuario?.id_empresa}/roles`);
        return res.data;
    };

     const fetchGetAllPermisosByCliente = async () => {
        const res = await api.get(`/gestion-de-usuarios/empresa/${usuario?.id_empresa}/permisos`);
        return res.data;
    }

    const fetchPermisosByRol = async () => {
        const res = await api.get(`/gestion-de-usuarios/empresa/${usuario?.id_empresa}/rol/${id_rol}`);
        return res.data;
    };

    const usuariosByClienteQuery = useQuery({
        queryKey: ["usuarios", usuario?.id_empresa],
        queryFn: fetchUsuariosByCliente,
        refetchOnWindowFocus: true,
        enabled: usuario?.id_empresa != null
    });

    const rolesByClienteQuery = useQuery({
        queryKey: ["roles", usuario?.id_empresa],
        queryFn: fetchRolesByCliente,
        refetchOnWindowFocus: true,
        enabled: usuario?.id_empresa != null
    });

    const permisosByClienteQuery = useQuery({
        queryKey: ["permisos", usuario?.id_empresa],
        queryFn: fetchGetAllPermisosByCliente,
        refetchOnWindowFocus: true,
        enabled: usuario?.id_empresa != null
    });

    const usuarioInfoQuery = useQuery({
        queryKey: ["usuario", empleado],
        queryFn: fetchUsuario,
        refetchOnWindowFocus: true,
        enabled: empleado != null
    });

    const permisosByRolQuery = useQuery({
        queryKey: ["permisos", empleado],
        queryFn: () => fetchPermisosByRol(),
        refetchOnWindowFocus: true,
        enabled: id_rol != null
    });


    // esto sirve para crear un empleado y se actualiza el cache en "tiempo real"
    const createEmpleadoMutation = useMutation({
        mutationFn: (usuario: UsuarioDTO) => createCuentaEmpleados(usuario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios", usuario?.id_empresa] });
        }
    });

    const updateEmpleadoMutation = useMutation({
        mutationFn: (usuario: UsuarioDTO) => updateCuentaEmpleados(usuario?.id_empresa, usuario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios", usuario?.id_empresa] });
        }
    });

    const asignarPermisosMutation = useMutation({
        mutationFn: (permiso: any) => asignarPermisos(permiso),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permisos", usuario?.id_empresa] });
        }
    });

    const asignarRolMutation = useMutation({
        mutationFn: (rol: any) => asignarRol(rol),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles", usuario?.empresa?.id_empresa] });
        }
    });

    const quitarPermisosMutation = useMutation({
        mutationFn: (permiso: any) => quitarPermisos(permiso),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permisos", usuario?.id_empresa] });
        }
    });




    return {
        usuariosByClienteQuery,
        rolesByClienteQuery,
        permisosByClienteQuery,
        permisosByRolQuery,
        usuarioInfoQuery,
        createEmpleadoMutation,
        updateEmpleadoMutation,
        asignarPermisosMutation,
        quitarPermisosMutation,
        crearRol,
        usuario,
        asignarRolMutation
    };
};