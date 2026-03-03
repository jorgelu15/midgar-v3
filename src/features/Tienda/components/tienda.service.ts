// ─────────────────────────────────────────────
//  tienda.service.ts
//  Reemplaza los mocks por llamadas reales a tu API.
//  React Query usará estas funciones directamente.
// ─────────────────────────────────────────────

import type { ProductoRepository } from "../../../models/Producto.repository";

export interface Cliente {
  cedula: string;
  nombre: string;
}

export interface MedioPago {
  nombre: string;
  shortcode: string;
}

export interface Pago {
  medio: string;
  monto: number;
}

export interface VentaPayload {
  productos: ProductoRepository[];
  cliente: Cliente;
  pagos: Pago[];
  total: number;
  fecha: string;
}

// ── Productos ──────────────────────────────────
export async function getProductoByCodigo(
  codigo: string
): Promise<ProductoRepository> {
  // TODO: reemplazar por fetch real
  // const res = await fetch(`/api/productos?codigo=${codigo}`);
  // if (!res.ok) throw new Error("Producto no encontrado");
  // return res.json();

  const mock: ProductoRepository[] = [
    {
      id_producto: 1,
      id_existencia: 1,
      id_empresa: 1,
      codigo: "123",
      nombre: "Coca-Cola 400ml",
      precio_venta: 3500,
      cantidad: 0,
      cantidad_minima: 0,
      categoria_id: 1,
      costo: 2500,
      estado: 0,
      foto_url:
        "https://licoresmedellin.com/cdn/shop/files/GASEOSA_COCA_COLA_ORIGINAL_MEDIANA_1_5L.jpg",
      impuesto_id: 1,
      marca_id: 1,
      proveedor_id: 1,
      unidad_medida_id: 1
    },
  ];

  const found = mock.find((p) => p.codigo === codigo);
  if (!found) throw new Error("Producto no encontrado");
  return found;
}

// ── Clientes ───────────────────────────────────
export async function getClienteByCedula(cedula: string): Promise<Cliente> {
  // TODO: reemplazar por fetch real
  // const res = await fetch(`/api/clientes?cedula=${cedula}`);
  // if (!res.ok) throw new Error("Cliente no encontrado");
  // return res.json();

  const mock: Cliente[] = [
    { cedula: "45512237", nombre: "Delia Rosa Romero Florez" },
    { cedula: "12345678", nombre: "Carlos Perez" },
  ];

  const found = mock.find((c) => c.cedula === cedula);
  if (!found) throw new Error("Cliente no encontrado");
  return found;
}

// ── Medios de pago ─────────────────────────────
export async function getMediosDePago(): Promise<MedioPago[]> {
  // TODO: reemplazar por fetch real
  // const res = await fetch("/api/medios-pago");
  // return res.json();

  return [
    { nombre: "Efectivo", shortcode: "F3" },
    { nombre: "Nequi", shortcode: "F4" },
    { nombre: "Transferencia", shortcode: "F5" },
    { nombre: "Tarjeta", shortcode: "F6" },
    { nombre: "Otro", shortcode: "F7" },
  ];
}

// ── Registrar venta ────────────────────────────
export async function registrarVenta(payload: VentaPayload): Promise<void> {
  // TODO: reemplazar por fetch real
  // const res = await fetch("/api/ventas", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Error al registrar la venta");

  console.log("Venta registrada:", payload);
}
