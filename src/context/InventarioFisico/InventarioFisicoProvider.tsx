import React, { useReducer } from 'react';
import api from "../../config/axios";

import InventarioFisicoContext from './InventarioFisicoContext';
import InventarioFisicoReducer from './InvetarioFisicoReducer';
import type { AxiosProgressEvent } from 'axios';
import type { ProductoRepository } from '../../models/Producto.repository';
import { typeState } from '../../models/types/producto.state';
import type { MovimientoInventarioRepository } from '../../models/MovimientoInventario.repository';
import type { CategoriaDTO } from '../../models/dtos/categoria.dto';



const ProductoProvider = ({ children }: { children: React.ReactNode }) => {

    const initialState = {
        producto: null,
        msg: null,
        cargando: true
    }

    const [state, dispatch] = useReducer(InventarioFisicoReducer, initialState);

    const updateProducto = async (id_producto: number, producto: ProductoRepository, id_inst: string, setProgress: any) => {
        try {
            const res = await api.put(`/inventario-fisico/productos/${id_producto}/${id_inst}`, { cantidad: producto.cantidad }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "Application/json",
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 0));
                    setProgress(percentage);
                }
            });
            console.log(res)

            return res;
        } catch (error) {
            console.log(error)
            dispatch({
                type: typeState.EDITAR_PRODUCT_ERROR,
                payload: error
            })
        }
    }

    const abastecerInventario = async (compra: any, productos: any, id_empresa: string, id_usuario: string, setProgress: any) => {
        try {
            const res = await api.put(`/inventario-fisico/abastecer-inventario/${id_empresa}`, {
                compra,
                productos,
                id_usuario: id_usuario
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "Application/json",
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 0));
                    setProgress(percentage);
                }
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


    const createProducto = async (formData: FormData, setProgress: any) => {
        try {
            const res = await api.post(`/productos`, formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                        const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 0));
                        setProgress(percentage);
                    }
                });

            return res;
        } catch (error) {
            throw error;
        }
    }

    const createExistencias = async (producto: any, id_empresa: any) => {
        try {
            const res = await api.post(`/inventario-fisico/inicializar-producto/${id_empresa}`, { producto }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "Application/json",
                }
            });

            return res;
        } catch (error) {
            throw error;
        }
    }

    const createMovimientoInventarioFisico = async (movimientoInventario: MovimientoInventarioRepository, id_empresa: string) => {
        try {
            const res = await api.post(`/inventario-fisico/kardex/movimiento-producto/${id_empresa}`, {
                movimientoInventario
            }, {
                withCredentials: true
            });

            return res;
        } catch (error: any) {
            console.log(error)
            throw new Error(`${error.response.data.error}`);

        }
    }

    const createCategoria = async (categoria: CategoriaDTO, setProgress: any) => {
        try {
            const res = await api.post(`/inventario-fisico/categorias`, categoria,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "Application/json",
                    },
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

    const createProveedor = async (proveedor: any, setProgress: any) => {
        try {
            const res = await api.post(`/inventario-fisico/proveedores`, proveedor,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "Application/json",
                    },
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

    const createMarca = async (marca: any, setProgress: any) => {
        try {
            const res = await api.post(`/inventario-fisico/marcas`, marca,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "Application/json",
                    },
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

    const createUnidadMedida = async (unidadMedida: any, setProgress: any) => {
        try {
            const res = await api.post(`/inventario-fisico/unidades-medida`, unidadMedida,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "Application/json",
                    },
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

    const deleteProducto = async (id_producto: number, id_inst: string) => {
        try {
            const res = await api.delete(`/inventario-fisico/productos/${id_producto}/${id_inst}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "Application/json",
                }
            });
            console.log(res)
            return res;
        } catch (error) {
            console.log(error)
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
                createMovimientoInventarioFisico,
                createCategoria,
                abastecerInventario,
                createExistencias,
                createProveedor,
                createMarca,
                createUnidadMedida,
                deleteProducto
            }}
        >
            {children}
        </InventarioFisicoContext.Provider>
    )
}

export default ProductoProvider;