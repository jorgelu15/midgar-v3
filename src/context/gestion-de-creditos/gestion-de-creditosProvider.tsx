import React from 'react';
import api from "../../config/axios";
import GestionDeCreditosContext from './gestion-de-creditosContext';
import type { CuentaCreditoDTO } from '../../models/dtos/cuenta-credito.dto';



const GestionDeCreditosProvider = ({ children }: { children: React.ReactNode }) => {

    const createCredito = async (credito: CuentaCreditoDTO) => {
        try {
            const res = await api.post('/gestion-de-creditos/creditos', credito, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }


    const updateCredito = async (credito: CuentaCreditoDTO) => {
        try {
            const res = await api.put(`/gestion-de-creditos/creditos/${credito.id_cuenta_credito}`, credito, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }

    const deleteCredito = async (id_cuenta_credito: number) => {
        try {
            const res = await api.delete(`/gestion-de-creditos/creditos/${id_cuenta_credito}`, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }

    return (
        <GestionDeCreditosContext.Provider
            value={{
                createCredito,
                updateCredito,
                deleteCredito
            }}
        >
            {children}
        </GestionDeCreditosContext.Provider>
    )
}

export default GestionDeCreditosProvider;