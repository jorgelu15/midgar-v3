import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";
import { useContext } from "react";
import InventarioFisicoContext from "../context/InventarioFisico/InventarioFisicoContext";
import type { CategoriaDTO } from "../models/dtos/categoria.dto";
import { useUserInfo } from "./useUserInfo";

export const useInventario = (id_producto?: string | undefined) => {
    const { usuarioQuery } = useUserInfo();
    const {
        updateProducto,
        abastecerInventario,
        createProducto,
        createMovimientoInventarioFisico,
        createCategoria,
        createExistencias,
        createProveedor,
        createMarca,
        createUnidadMedida
    }: any = useContext(InventarioFisicoContext);
    const queryClient = useQueryClient();

    const user = usuarioQuery.data;

    const fetchProductos = async (id_inst: string) => {
        const res = await api.get(`/inventario-fisico/existencias/${id_inst}`);
        return res.data;
    };


    const fetchValorInventarioFisico = async (id_inst: string) => {
        const res = await api.get(`/inventario-fisico/existencias/valor/${id_inst}`);
        return res.data;
    };

    const fetchGananciaEstimada = async (id_inst: string) => {
        const res = await api.get(`/inventario-fisico/existencias/ganancia-estimada/${id_inst}`);
        return res.data;
    }

    const fetchProductosAgotados = async (id_inst: string) => {
        const res = await api.get(`/inventario-fisico/existencias/productos-agotados/${id_inst}`);
        return res.data;
    }

    const fetchGetAllMovimientosInventario = async (id_producto?: string, id_inst?: string) => {
        const res = await api.get(`/inventario-fisico/kardex/movimientos-producto/${id_producto}/${id_inst}`);
        return res.data;
    }

    const fetchGetAllCategoriasByCliente = async (id_empresa?: string) => {
        const res = await api.get(`/productos/cliente/${id_empresa}/categorias`);
        return res.data;
    }

    const fetchProveedores = async (id_empresa: string) => {
        const res = await api.get(`/inventario-fisico/proveedores/${id_empresa}`);
        return res.data;
    };

    const fetchMarcas = async (id_empresa: string) => {
        const res = await api.get(`/inventario-fisico/marcas/${id_empresa}`);
        return res.data;
    };

    const fetchUnidadesMedida = async (id_empresa: string) => {
        const res = await api.get(`/inventario-fisico/unidades-medida/${id_empresa}`);
        return res.data;
    };

    const categoriasQuery = useQuery({
        queryKey: ["categorias", user?.empresa?.id_empresa],
        queryFn: () => fetchGetAllCategoriasByCliente(user?.empresa?.id_empresa), // Ya no recibe page
        enabled: user?.empresa?.id_empresa != null,
        refetchOnWindowFocus: true
    });

    const productosQuery = useQuery({
        queryKey: ["productos", user?.empresa?.id_empresa],
        queryFn: () => fetchProductos(user?.empresa?.id_empresa), // Ya no recibe page
        enabled: user?.empresa?.id_empresa != null,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 10,     // 10 min
        gcTime: 1000 * 60 * 60,
    });

    const valorInventarioFisicoQuery = useQuery({
        queryKey: ['valor_inventario_fisico', user?.empresa?.id_empresa],
        queryFn: () => fetchValorInventarioFisico(user?.empresa?.id_empresa),
        enabled: user?.empresa?.id_empresa != null,
        refetchOnWindowFocus: true

    });

    const gananciaEstimadaQuery = useQuery({
        queryKey: ['ganancia_estimada', user?.empresa?.id_empresa],
        queryFn: () => fetchGananciaEstimada(user?.empresa?.id_empresa),
        enabled: user?.empresa?.id_empresa != null,
        refetchOnWindowFocus: true

    });

    const productosAgotadosQuery = useQuery({
        queryKey: ['productos_agotados', user?.empresa?.id_empresa],
        queryFn: () => fetchProductosAgotados(user?.empresa?.id_empresa),
        enabled: user?.empresa?.id_empresa != null,
        refetchOnWindowFocus: true

    });

    const movimientosInventarioQuery = useQuery({
        queryKey: ['movimientos_inventario', id_producto],
        queryFn: () => fetchGetAllMovimientosInventario(id_producto, user?.empresa?.id_empresa),
        enabled: user?.empresa?.id_empresa != null && !!id_producto,
        refetchOnWindowFocus: true

    })

    const proveedoresQuery = useQuery({
        queryKey: ["proveedores", user?.empresa?.id_empresa],
        queryFn: () => fetchProveedores(user?.empresa?.id_empresa),
        enabled: user?.empresa?.id_empresa != null,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 10,     // 10 min
        gcTime: 1000 * 60 * 60,
    });

    const marcasQuery = useQuery({
        queryKey: ["marcas", user?.empresa?.id_empresa],
        queryFn: () => fetchMarcas(user?.empresa?.id_empresa),
        enabled: user?.empresa?.id_empresa != null,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 10,     // 10 min
        gcTime: 1000 * 60 * 60,
    });

    const unidadesMedidaQuery = useQuery({
        queryKey: ["unidades_medida", user?.empresa?.id_empresa],
        queryFn: () => fetchUnidadesMedida(user?.empresa?.id_empresa),
        enabled: user?.empresa?.id_empresa != null,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 10,     // 10 min
        gcTime: 1000 * 60 * 60,
    });


    //mutarions
    const createCategoriaMutation = useMutation({
        mutationFn: (categoria: CategoriaDTO) => createCategoria(categoria),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categorias", user?.empresa?.id_empresa] });
        }
    });

    const createProveedorMutation = useMutation({
        mutationFn: (proveedor: any) => createProveedor(proveedor),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["proveedores", user?.empresa?.id_empresa] });
        }
    });

    const createMarcaMutation = useMutation({
        mutationFn: (marca: any) => createMarca(marca),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["marcas", user?.empresa?.id_empresa] });
        }
    }); 

    const createUnidadMedidaMutation = useMutation({
        mutationFn: (unidadMedida: any) => createUnidadMedida(unidadMedida),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["unidades_medida", user?.empresa?.id_empresa] });
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
        createCategoriaMutation,
        abastecerInventario,
        createExistencias,
        proveedoresQuery,
        createProveedorMutation,
        createMarcaMutation,
        marcasQuery,
        unidadesMedidaQuery,
        createUnidadMedidaMutation
    };
};