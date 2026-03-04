import React from 'react';
import api from "../../config/axios";
import GestionDeVentasContext from './gestion-de-ventasContext';
import type { ClienteDTO } from '../../models/dtos/cliente.dto';



const GestionDeVentasProvider = ({ children }: { children: React.ReactNode }) => {

    const confirmarVenta = async (cliente: ClienteDTO, id_empresa: string) => {
        try {
            const res = await api.post(`/clientes/${id_empresa}`, cliente, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }

    return (
        <GestionDeVentasContext.Provider
            value={{
                confirmarVenta
            }}
        >
            {children}
        </GestionDeVentasContext.Provider>
    )
}

export default GestionDeVentasProvider;