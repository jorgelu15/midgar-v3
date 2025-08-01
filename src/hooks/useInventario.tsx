import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "../config/axios";
import { useAuth } from "./useAuth";
import { useContext } from "react";
import InventarioFisicoContext from "../context/InventarioFisico/InventarioFisicoContext";

export const useInventario = (id_producto?: string | undefined) => {
    const { usuario } = useAuth();
    const { updateProducto, createProducto, createMovimientoInventarioFisico }: any = useContext(InventarioFisicoContext);

    const fetchProductos = async (pageParam: number = 0) => {
        const res = await api.get(`/inventario-fisico/productos/${usuario?.id_inst}`, {
            params: { page: pageParam }
        });
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


    const productosQuery = useInfiniteQuery({
        queryKey: ['productos', usuario?.id_inst],
        queryFn: ({ pageParam = 0 }) => fetchProductos(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            // Ajusta esto según la estructura real de tu API
            return lastPage?.length > 0 ? allPages.length : undefined;
        },
        refetchOnWindowFocus: true
    });

    const valorInventarioFisicoQuery = useQuery({
        queryKey: ['valor_inventario_fisico', usuario?.id_inst],
        queryFn: () => fetchValorInventarioFisico(usuario?.id_inst),
        enabled: usuario?.id_inst != null,
        refetchOnWindowFocus: true

    });

    const gananciaEstimadaQuery = useQuery({
        queryKey: ['ganancia_estimada', usuario?.id_inst],
        queryFn: () => fetchGananciaEstimada(usuario?.id_inst),
        enabled: usuario?.id_inst != null,
        refetchOnWindowFocus: true

    });

    const productosAgotadosQuery = useQuery({
        queryKey: ['productos_agotados', usuario?.id_inst],
        queryFn: () => fetchProductosAgotados(usuario?.id_inst),
        enabled: usuario?.id_inst != null,
        refetchOnWindowFocus: true

    });

    const movimientosInventarioQuery = useQuery({
        queryKey: ['movimientos_inventario', id_producto],
        queryFn: () => fetchGetAllMovimientosInventario(id_producto, usuario?.id_inst),
        enabled: usuario?.id_inst != null && !!id_producto,
        refetchOnWindowFocus: true

    })


    return {
        productosQuery,
        valorInventarioFisicoQuery,
        gananciaEstimadaQuery,
        productosAgotadosQuery,
        movimientosInventarioQuery,
        updateProducto,
        createProducto,
        createMovimientoInventarioFisico
    };
};