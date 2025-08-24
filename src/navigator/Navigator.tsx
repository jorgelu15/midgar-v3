import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "../utils/routes";
import { Suspense } from "react";
import Signin from "../pages/Signin/Signin";
import Signup from "../pages/Signup/Signup";
import Dashboard from "../pages/Dashboard/Dashboard";
import Vender from "../pages/Vender/Vender";
import Clientes from "../pages/Clientes/Clientes";
import Fiados from "../pages/Fiados/Fiados";
import Estadisticas from "../pages/Estadisticas/Estadisticas";
import Ajustes from "../pages/Ajustes/Ajustes";
import InventarioFisico from "../pages/InventarioFisico/InventarioFisico";
import Usuariosypermisos from "../pages/Usuarios_y_permisos/Usuariosypermisos";
import Caja from "../pages/Caja/Caja";
import Apertura from "../pages/Apertura/Apertura";
import Recogida from "../pages/Recogida/Recogida";
import Cierre from "../pages/Cierre/Cierre";
import Tienda from "../pages/Tienda/Tienda";
import EstiloInterfaz from "../pages/EstiloInterfaz/EstiloInterfaz";
import ProtectedRoute from "../utils/ProtectedRoute";
import Contabilidad from "../pages/Contabilidad/Contabilidad";
import CatalogoCuentas from "../pages/CatalogoCuentas/CatalogoCuentas";
import Autolavado from "../pages/Autolavado/Autolavado";
import ConfigInventario from "../pages/ConfigInventario/ConfigInventario";



const router = createBrowserRouter([
    {
        path: routes.signin,
        element: <Suspense fallback={<p>Loading...</p>}><Signin /></Suspense>,
    },
    {
        path: routes.signup,
        element: <Suspense fallback={<p>Loading...</p>}><Signup /></Suspense>,
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.dashboard,
                element: <Suspense fallback={<p>Loading...</p>}><Dashboard /></Suspense>
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.vender,
                element: <Suspense fallback={<p>Loading...</p>}><Vender /></Suspense>,
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.caja,
                element: <Suspense fallback={<p>Loading...</p>}><Caja /></Suspense>,
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.clientes,
                element: <Suspense fallback={<p>Loading...</p>}><Clientes /></Suspense>,
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.InventarioFisico,
                element: <Suspense fallback={<p>Loading...</p>}><InventarioFisico /></Suspense>,
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.fiados,
                element: <Suspense fallback={<p>Loading...</p>}><Fiados /></Suspense>,
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.estadisticas,
                element: <Suspense fallback={<p>Loading...</p>}><Estadisticas /></Suspense>,
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.ajustes,
                element: <Suspense fallback={<p>Loading...</p>}><Ajustes /></Suspense>,
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.usuariosPermisos,
                element: <Suspense fallback={<p>Loading...</p>}><Usuariosypermisos /></Suspense>,
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.apertura,
                element: <Suspense fallback={<p>Loading...</p>}><Apertura /></Suspense>,
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.recogida,
                element: <Suspense fallback={<p>Loading...</p>}><Recogida /></Suspense>
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.cierre,
                element: <Suspense fallback={<p>Loading...</p>}><Cierre /></Suspense>
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.tienda,
                element: <Suspense fallback={<p>Loading...</p>}><Tienda /></Suspense>
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.estiloInterfaz,
                element: <Suspense fallback={<p>Loading...</p>}><EstiloInterfaz /></Suspense>
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.contabilidad,
                element: <Contabilidad />
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.catalogo,
                element: <CatalogoCuentas />
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.autolavado,
                element: <Autolavado />
            }
        ]
    },
    {
        path: routes.signin,
        element: <ProtectedRoute />,
        children: [
            {
                path: routes.config_inventario,
                element: <ConfigInventario />
            }
        ]
    }
]);
const Navigator = () => {
    return (
        <RouterProvider router={router} />
    );
}

export default Navigator;