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
import Inventario from "../pages/Inventario/Inventario";
import Usuariosypermisos from "../pages/Usuarios_y_permisos/Usuariosypermisos";
import Caja from "../pages/Caja/Caja";
import Apertura from "../pages/Apertura/Apertura";
import Recogida from "../pages/Recogida/Recogida";
import Cierre from "../pages/Cierre/Cierre";



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
        path: routes.dashboard,
        element: <Suspense fallback={<p>Loading...</p>}><Dashboard /></Suspense>,
    },
    {
        path: routes.vender,
        element: <Suspense fallback={<p>Loading...</p>}><Vender /></Suspense>,
    },
    {
        path: routes.caja,
        element: <Suspense fallback={<p>Loading...</p>}><Caja /></Suspense>,
    },
    {
        path: routes.clientes,
        element: <Suspense fallback={<p>Loading...</p>}><Clientes /></Suspense>,
    },
    {
        path: routes.inventario,
        element: <Suspense fallback={<p>Loading...</p>}><Inventario /></Suspense>,
    },
    {
        path: routes.fiados,
        element: <Suspense fallback={<p>Loading...</p>}><Fiados /></Suspense>,
    },
    {
        path: routes.estadisticas,
        element: <Suspense fallback={<p>Loading...</p>}><Estadisticas /></Suspense>,
    },
    {
        path: routes.ajustes,
        element: <Suspense fallback={<p>Loading...</p>}><Ajustes /></Suspense>,
    },
    {
        path: routes.usuariosPermisos,
        element: <Suspense fallback={<p>Loading...</p>}><Usuariosypermisos /></Suspense>,
    },
    {
        path: routes.apertura,
        element: <Suspense fallback={<p>Loading...</p>}><Apertura /></Suspense>,
    },
    {
        path: routes.recogida,
        element: <Suspense fallback={<p>Loading...</p>}><Recogida /></Suspense>
    },
    {
        path: routes.cierre,
        element: <Suspense fallback={<p>Loading...</p>}><Cierre /></Suspense>
    }
]);
const Navigator = () => {
    return ( 
        <RouterProvider router={router} />
     );
}

export default Navigator;