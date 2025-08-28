import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useAuth } from "./useAuth";
import { useContext } from "react";
import InventarioFisicoContext from "../context/InventarioFisico/InventarioFisicoContext";
import type { CategoriaDTO } from "../models/dtos/categoria.dto";

export const useInventario = (id_producto?: string | undefined) => {
    const { usuario } = useAuth();
    const { updateProducto, createProducto, createMovimientoInventarioFisico, createCategoria }: any = useContext(InventarioFisicoContext);
    const queryClient = useQueryClient();
    const fetchProductos = async (id_inst: string) => {
        const res = await api.get(`/inventario-fisico/productos/${id_inst}`);
        return res.data;
    };


    const fetchValorInventarioFisico = async (id_inst: string) => {
        const res = await api.get(`/inventario-fisico/valor-inventario/${id_inst}`);
        return res.data;
    };

    const fetchGananciaEstimada = async (id_inst: string) => {
        const res = await api.get(`/inventario-fisico/ganancia-estimada/${id_inst}`);
        return res.data;
    }

    const fetchProductosAgotados = async (id_inst: string) => {
        const res = await api.get(`/inventario-fisico/productos-agotados/${id_inst}`);
        return res.data;
    }

    const fetchGetAllMovimientosInventario = async (id_producto?: string, id_inst?: string) => {
        const res = await api.get(`/inventario-fisico/movimientos-producto/${id_producto}/${id_inst}`);
        return res.data;
    }

    const fetchGetAllCategoriasByCliente = async (id_cliente?: string) => {
        const res = await api.get(`/inventario-fisico/cliente/${id_cliente}/categorias`);
        return res.data;
    }

    const categoriasQuery = useQuery({
        queryKey: ["categorias", usuario?.id_cliente],
        queryFn: () => fetchGetAllCategoriasByCliente(usuario?.id_cliente), // Ya no recibe page
        enabled: usuario?.id_cliente != null,
        refetchOnWindowFocus: true
    });

    const productosQuery = useQuery({
        queryKey: ["productos", usuario?.id_cliente],
        queryFn: () => fetchProductos(usuario?.id_cliente), // Ya no recibe page
        enabled: usuario?.id_cliente != null,
        refetchOnWindowFocus: true
    });

    const valorInventarioFisicoQuery = useQuery({
        queryKey: ['valor_inventario_fisico', usuario?.id_cliente],
        queryFn: () => fetchValorInventarioFisico(usuario?.id_cliente),
        enabled: usuario?.id_cliente != null,
        refetchOnWindowFocus: true

    });

    const gananciaEstimadaQuery = useQuery({
        queryKey: ['ganancia_estimada', usuario?.id_cliente],
        queryFn: () => fetchGananciaEstimada(usuario?.id_cliente),
        enabled: usuario?.id_cliente != null,
        refetchOnWindowFocus: true

    });

    const productosAgotadosQuery = useQuery({
        queryKey: ['productos_agotados', usuario?.id_cliente],
        queryFn: () => fetchProductosAgotados(usuario?.id_cliente),
        enabled: usuario?.id_cliente != null,
        refetchOnWindowFocus: true

    });

    const movimientosInventarioQuery = useQuery({
        queryKey: ['movimientos_inventario', id_producto],
        queryFn: () => fetchGetAllMovimientosInventario(id_producto, usuario?.id_cliente),
        enabled: usuario?.id_cliente != null && !!id_producto,
        refetchOnWindowFocus: true

    })

    //mutarions
    const createCategoriaMutation = useMutation({
        mutationFn: (categoria: CategoriaDTO) => createCategoria(categoria),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categorias", usuario?.id_cliente] });
        }
    });


    return {
        productosQuery,
        valorInventarioFisicoQuery,
        gananciaEstimadaQuery,
        productosAgotadosQuery,
        movimientosInventarioQuery,
        categoriasQuery,
        updateProducto,
        createProducto,
        createMovimientoInventarioFisico,
        createCategoriaMutation
    };
};