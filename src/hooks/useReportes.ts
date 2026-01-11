import api from "../config/axios";
import { useQuery } from "@tanstack/react-query";
import { useUserInfo } from "./useUserInfo";
export const useReportes = () => {
    const { usuarioQuery } = useUserInfo();

    const getBalanceDelDiaByEmpresa = async (id_empresa?: string) => {
        const res = await api.get(`/reportes/balance-del-dia/${id_empresa}`);
        return res.data;
    }

    const getVentaPromedioDelDiaByEmpresa = async (id_empresa?: string) => {
        const res = await api.get(`/reportes/venta-promedio-del-dia/${id_empresa}`);
        return res.data;
    }

    const getNumeroVentasDelDiaByEmpresa = async (id_empresa?: string) => {
        const res = await api.get(`/reportes/numero-ventas-del-dia/${id_empresa}`);
        return res.data;
    }

    const balanceDelDiaQuery = useQuery({
        queryKey: ["balanceDelDia", usuarioQuery.data?.empresa.id_empresa],
        queryFn: () => getBalanceDelDiaByEmpresa(usuarioQuery.data?.empresa.id_empresa),
        enabled: usuarioQuery.data?.empresa.id_empresa != null,
        refetchOnWindowFocus: true,
    });

    const ventaPromedioQuery = useQuery({
        queryKey: ["ventaPromedio", usuarioQuery.data?.empresa.id_empresa],
        queryFn: () => getVentaPromedioDelDiaByEmpresa(usuarioQuery.data?.empresa.id_empresa),
        enabled: usuarioQuery.data?.empresa.id_empresa != null,
        refetchOnWindowFocus: true,
    })

    const numeroVentasDelDiaQuery = useQuery({
        queryKey: ["numeroVentasDelDia", usuarioQuery.data?.empresa.id_empresa],
        queryFn: () => getNumeroVentasDelDiaByEmpresa(usuarioQuery.data?.empresa.id_empresa),
        enabled: usuarioQuery.data?.empresa.id_empresa != null,
        refetchOnWindowFocus: true,
    })
    return {
        balanceDelDiaQuery,
        ventaPromedioQuery,
        numeroVentasDelDiaQuery
    }
}