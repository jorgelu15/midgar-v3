import { useQuery } from "@tanstack/react-query";
import api from "../config/axios";
import { useContext } from "react";
import autoLavadoContext from "../context/AutoLavado/AutoLavadoContext";
import { useUserInfo } from "./useUserInfo";

export const useCuenta = (id_cuenta_cliente?: string | null) => {
    const { usuarioQuery } = useUserInfo();
    
    const { createCuenta, agregarProductoCuenta }: any = useContext(autoLavadoContext);

    const fetchCuentas = async () => {
        const res = await api.get(`/ventas-y-servicios/cuenta/${usuarioQuery.data?.cliente.id_cliente}`);
        return res.data;
    };

    const fetchCuentaById = async () => {
        const res = await api.get(`/ventas-y-servicios/cuenta/${id_cuenta_cliente}/${usuarioQuery.data?.cliente.id_cliente}`);
        return res.data;
    };

    const cuentasQuery = useQuery({
        queryKey: ["cuenta_cliente", usuarioQuery.data?.cliente.id_cliente],
        queryFn: fetchCuentas,
        refetchOnWindowFocus: true,
        enabled: usuarioQuery.data?.cliente.id_cliente != null
    });

    const cuentaByIdiDQuery = useQuery({
        queryKey: ["cuenta_cliente", usuarioQuery.data?.cliente.id_cliente, id_cuenta_cliente],
        queryFn: fetchCuentaById,
        refetchOnWindowFocus: true,
        enabled: usuarioQuery.data?.cliente.id_cliente != null
    });

    return {
        cuentasQuery,
        cuentaByIdiDQuery,
        createCuenta,
        agregarProductoCuenta
    };
};