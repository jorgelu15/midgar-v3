import React from 'react';
import api from "../../config/axios";
import GestionDeClientesContext from './gestion-de-clientesContext';
import type { ClienteDTO } from '../../models/dtos/cliente.dto';



const GestionDeClientesProvider = ({ children }: { children: React.ReactNode }) => {

    const createCliente = async (cliente: ClienteDTO) => {
        try {
            const res = await api.post('/clientes', cliente, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }


    const updateCliente = async (cliente: ClienteDTO) => {
        try {
            const res = await api.put(`/clientes/actualizar/${cliente.cedula}`, cliente, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }

    const deleteCliente = async (cedula: string) => {
        try {
            const res = await api.delete(`/clientes/${cedula}`, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }

    return (
        <GestionDeClientesContext.Provider
            value={{
                createCliente,
                updateCliente,
                deleteCliente
            }}
        >
            {children}
        </GestionDeClientesContext.Provider>
    )
}

export default GestionDeClientesProvider;