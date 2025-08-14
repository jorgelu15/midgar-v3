import React, { useReducer } from 'react';
import api from "../../config/axios";

import AutoLavadoContext from './AutoLavadoContext';
import AutoLavadoReducer from './AutoLavadoReducer';
import type { AxiosProgressEvent } from 'axios';
import type { CuentaLavado } from '../../models/CuentaLavado';
import { typeState } from '../../models/types/producto.state';
import type { MovimientoInventarioRepository } from '../../models/MovimientoInventario.repository';



const CuentaProvider = ({ children }: { children: React.ReactNode }) => {

    const initialState = {
        cuenta: null,
        msg: null,
        cargando: true
    }

    const [state, dispatch] = useReducer(AutoLavadoReducer, initialState);

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

    return (
        <AutoLavadoContext.Provider
            value={{
                producto: state.producto,
                msg: state.msg,
                cargando: state.cargando,
                createCuenta,
                agregarProductoCuenta
            }}
        >
            {children}
        </AutoLavadoContext.Provider>
    )
}

export default CuentaProvider;