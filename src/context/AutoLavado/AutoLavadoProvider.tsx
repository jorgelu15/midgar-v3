import React from 'react';
import api from "../../config/axios";

import AutoLavadoContext from './AutoLavadoContext';
import type { AxiosProgressEvent } from 'axios';
import type { CuentaLavado } from '../../models/CuentaLavado';



const CuentaProvider = ({ children }: { children: React.ReactNode }) => {



    const createCuenta = async (cuenta: CuentaLavado, id_inst: number, setProgress: any) => {
        try {
            const res = await api.post(`/ventas-y-servicios/cuenta`, {cuenta: cuenta, id_inst: id_inst},
            {
                withCredentials: true,
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 0));
                    setProgress(percentage);
                }
            });

            return res;
        } catch (error) {
            console.log(error)
        }
    }

    const agregarProductoCuenta = async (id_producto: number, cantidad: number, id_inst: number, id_cuenta_cliente: number, setProgress: any) => {
        try {
            const res = await api.post(`/ventas-y-servicios/cuenta/agregar-producto`, {producto: { id_producto: id_producto, cantidad: cantidad}, id_inst: id_inst, id_cuenta_cliente: id_cuenta_cliente},
            {
                withCredentials: true,
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 0));
                    setProgress(percentage);
                }
            });

            return res;
        } catch (error) {
            console.log(error)
        }
    }

    const cerrarCuenta = async (factura: any, setProgress: any) => {
        try {
            const res = await api.post(`/ventas-y-servicios/cuenta/cerrar`, {factura: factura},
            {
                withCredentials: true,
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 0));
                    setProgress(percentage);
                }
            });
            return res;
        } catch (error) {
            console.log(error)
        }
    }

    const cancelarCuenta = async (id_cuenta_cliente: number, id_inst: number) => {
        try {
            const res = await api.delete(`/ventas-y-servicios/cuenta/cancelar/${id_cuenta_cliente}/${id_inst}`);
            return res;
        } catch (error) {
            console.log(error)
        }
    }

    const descargarInventario = async (id_cliente: string, id_usuario: number, producto: any, setProgress: any) => {
        try {
            const res = await api.post(`/ventas-y-servicios/cuenta/descargar/producto/${id_cliente}/${id_usuario}`, {producto: producto},
            {
                withCredentials: true,
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 0));
                    setProgress(percentage);
                }
            });
            console.log(res)
            return res;
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AutoLavadoContext.Provider
            value={{
                createCuenta,
                agregarProductoCuenta,
                cancelarCuenta,
                cerrarCuenta,
                descargarInventario
            }}
        >
            {children}
        </AutoLavadoContext.Provider>
    )
}

export default CuentaProvider;