import { useQuery } from "@tanstack/react-query";
import api from "../config/axios";
import { useAuth } from "./useAuth";
import { useContext } from "react";
import autoLavadoContext from "../context/AutoLavado/AutoLavadoContext";

export const useCuenta = (id_cuenta_cliente?: string | undefined) => {
    const { usuario } = useAuth();
    const { createCuenta }: any = useContext(autoLavadoContext);

    const fetchCuentas = async () => {
        const res = await api.get(`/ventas-y-servicios/cuenta/${usuario?.id_inst}`);
        return res.data;
    };

    const cuentasQuery = useQuery({
        queryKey: ["cuenta_cliente", usuario?.id_inst],
        queryFn: fetchCuentas,
        refetchOnWindowFocus: true,
        enabled: usuario?.id_inst != null
    });
    return {
        cuentasQuery,
        createCuenta
    };
};