// titles.ts
import { routes } from "./routes";

export const routeTitles: Record<string, string> = {
  [routes.signin]: "Iniciar Sesión | Midgar ERP",
  [routes.signup]: "Crear Cuenta | Midgar ERP",
  [routes.dashboard]: "Dashboard | Midgar ERP",

  // POS
  [routes.vender]: "POS | Midgar ERP",
  [routes.tienda]: "Tienda | Midgar ERP",
  [routes.factura_manual]: "Factura Manual | Midgar ERP",
  [routes.autolavado]: "Autolavado | Midgar ERP",

  // Caja
  [routes.caja]: "Caja | Midgar ERP",
  [routes.apertura]: "Apertura de Caja | Midgar ERP",
  [routes.cierre]: "Cierre de Caja | Midgar ERP",
  [routes.recogida]: "Recogida | Midgar ERP",

  // Otros
  [routes.clientes]: "Clientes | Midgar ERP",
  [routes.InventarioFisico]: "Inventario Físico | Midgar ERP",
  [routes.fiados]: "Fiados | Midgar ERP",
  [routes.estadisticas]: "Estadísticas | Midgar ERP",

  // Contabilidad
  [routes.contabilidad]: "Contabilidad | Midgar ERP",
  [routes.catalogo]: "Catálogo de Cuentas | Midgar ERP",

  // Ajustes
  [routes.ajustes]: "Ajustes | Midgar ERP",
  [routes.usuariosPermisos]: "Usuarios y Permisos | Midgar ERP",
  [routes.cuentaAcceso]: "Cuenta y Acceso | Midgar ERP",
  [routes.negocio]: "Datos del Negocio | Midgar ERP",
  [routes.config_inventario]: "Configuración de Inventario | Midgar ERP",
  [routes.ventasConfig]: "Configuración de Ventas | Midgar ERP",
  [routes.clientesCreditos]: "Clientes y Créditos | Midgar ERP",
  [routes.configuracionReportes]: "Reportes y Estadísticas | Midgar ERP",
  [routes.estiloInterfaz]: "Estilo e Interfaz | Midgar ERP",
};
