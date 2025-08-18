import React from 'react';
import api from "../../config/axios";
import GestionDeUsuariosContext from './gestion-de-usuariosContext';
import type { UsuarioDTO } from '../../models/dtos/usuario.dto';



const GestionDeUsuariosProvider = ({ children }: { children: React.ReactNode }) => {

    const createCuentaEmpleados = async (usuario: UsuarioDTO) => {
        try {
            const res = await api.post('/gestion-de-usuarios/cuentas-empleados', usuario, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }


    const updateCuentaEmpleados = async (id_cliente: number, usuario: UsuarioDTO) => {
        try {
            const res = await api.put(`/gestion-de-usuarios/cuentas-empleados/${id_cliente}`, usuario, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }

    const asignarPermisos = async (permiso: any) => {
        try {
            const res = await api.post(`/gestion-de-usuarios/permisos/asignar/${permiso.id_usuario}`, permiso, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }

    const quitarPermisos = async (permiso: any) => {
        console.log(permiso)
        try {
            const res = await api.delete(`/gestion-de-usuarios/permisos/quitar/${permiso.id_rol}`, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }

    const crearRol = async (rol: any) => {
        try {
            console.log(rol);
            const res = await api.post('/gestion-de-usuarios/roles', rol, {
                withCredentials: true
            });
            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }

    return (
        <GestionDeUsuariosContext.Provider
            value={{
                createCuentaEmpleados,
                updateCuentaEmpleados,
                asignarPermisos,
                quitarPermisos,
                crearRol
            }}
        >
            {children}
        </GestionDeUsuariosContext.Provider>
    )
}

export default GestionDeUsuariosProvider;