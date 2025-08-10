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

    return (
        <AutoLavadoContext.Provider
            value={{
                producto: state.producto,
                msg: state.msg,
                cargando: state.cargando,
                createCuenta,
            }}
        >
            {children}
        </AutoLavadoContext.Provider>
    )
}

export default CuentaProvider;