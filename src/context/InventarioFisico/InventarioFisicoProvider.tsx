import React, { useReducer } from 'react';
import api from "../../config/axios";

import InventarioFisicoContext from './InventarioFisicoContext';
import InventarioFisicoReducer from './InvetarioFisicoReducer';
import type { AxiosProgressEvent } from 'axios';
import type { ProductoRepository } from '../../models/Producto.repository';
import { typeState } from '../../models/types/producto.state';
import type { MovimientoInventarioRepository } from '../../models/MovimientoInventario.repository';



const ProductoProvider = ({ children }: { children: React.ReactNode }) => {

    const initialState = {
        producto: null,
        msg: null,
        cargando: true
    }

    const [state, dispatch] = useReducer(InventarioFisicoReducer, initialState);

    const updateProducto = async (id_producto: number, producto: ProductoRepository) => {
        try {
            const res = await api.put(`/inventario-fisico/productos/${id_producto}`, producto, {
                withCredentials: true
            });

            return res;
        } catch (error) {
            console.log(error)
            dispatch({
                type: typeState.EDITAR_PRODUCT_ERROR,
                payload: error
            })
        }
    }


    const createProducto = async (producto: ProductoRepository, id_inst: string, setProgress: any) => {
        try {
            const res = await api.post(`/inventario-fisico/productos`, {
                producto: producto,
                id_inst: id_inst
            }, {
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

    const createMovimientoInventarioFisico = async (movimientoInventario: MovimientoInventarioRepository, id_inst: string) => {
        try {
            const res = await api.post(`/inventario-fisico/movimiento-producto/${id_inst}`, {
                movimientoInventario
            }, {
                withCredentials: true
            });
            console.log(res)

            return res;
        } catch (error: any) {
            console.log(error)
            throw new Error(`${error.response.data.error}`);

        }
    }

    return (
        <InventarioFisicoContext.Provider
            value={{
                producto: state.producto,
                msg: state.msg,
                cargando: state.cargando,
                updateProducto,
                createProducto,
                createMovimientoInventarioFisico
            }}
        >
            {children}
        </InventarioFisicoContext.Provider>
    )
}

export default ProductoProvider;