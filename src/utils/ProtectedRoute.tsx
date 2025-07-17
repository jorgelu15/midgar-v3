import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { routes } from "./routes";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
    const { isAuthenticated, usuarioAutenticado } = useAuth();
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const verificarAutenticacion = async () => {
            await usuarioAutenticado();
            setCargando(false);
        };

        verificarAutenticacion();
    }, []); // Eliminar isAuthenticated de las dependencias para evitar bucles infinitos

    if (cargando) {
        return <div>Cargando...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to={routes.signin} />;
};

export default ProtectedRoute;