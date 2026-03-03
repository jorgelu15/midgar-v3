// ─────────────────────────────────────────────
//  useTienda.ts
//  Hook principal. Centraliza estado de la factura
//  y todas las mutaciones / queries con React Query.
// ─────────────────────────────────────────────

import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { routes } from "../../../utils/routes";
import {
  getProductoByCodigo,
  getClienteByCedula,
  getMediosDePago,
  registrarVenta,
  type Cliente,
  type Pago,
} from "./tienda.service";
import type { ProductoRepository } from "../../../models/Producto.repository";

export type ModoBusqueda = "cliente" | "producto";

export function useTienda() {
  const navigate = useNavigate();

  // ── Estado de la factura ───────────────────────
  const [productosFactura, setProductosFactura] = useState<
    ProductoRepository[]
  >([]);
  const [ultimoProducto, setUltimoProducto] =
    useState<ProductoRepository | null>(null);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [modoBusqueda, setModoBusqueda] = useState<ModoBusqueda>("cliente");

  // ── Estado del totalizar ───────────────────────
  const [modoTotalizar, setModoTotalizar] = useState(false);
  const [filtroMedio, setFiltroMedio] = useState("");
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [medioSeleccionado, setMedioSeleccionado] = useState<string | null>(
    null
  );
  const [montoMedio, setMontoMedio] = useState("");

  // ── Ref del input ──────────────────────────────
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ── Cálculos derivados ─────────────────────────
  const total = productosFactura.reduce(
    (sum, p) => sum + p.precio_venta * (p.cantidad || 1),
    0
  );
  const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
  const faltante = total - totalPagado;

  // ── React Query: medios de pago ────────────────
  const { data: mediosDePago = [] } = useQuery({
    queryKey: ["mediosDePago"],
    queryFn: getMediosDePago,
  });

  // ── Mutación: buscar cliente ───────────────────
  const buscarClienteMutation = useMutation({
    mutationFn: getClienteByCedula,
    onSuccess: (cliente) => {
      setClienteSeleccionado(cliente);
      setModoBusqueda("producto");
    },
    onError: (err: Error) => alert(err.message),
  });

  // ── Mutación: buscar producto ──────────────────
  const buscarProductoMutation = useMutation({
    mutationFn: ({ codigo }: { codigo: string; cantidad: number }) =>
      getProductoByCodigo(codigo),
    onSuccess: (producto, variables) => {
      const { cantidad } = variables;
      setProductosFactura((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((p) => p.codigo === producto.codigo);
        if (index !== -1) {
          updated[index].cantidad = (updated[index].cantidad || 0) + cantidad;
          if (updated[index].cantidad! <= 0) updated.splice(index, 1);
        } else {
          if (cantidad <= 0) return prev;
          updated.push({ ...producto, cantidad });
        }
        return updated;
      });
      setUltimoProducto({ ...producto, cantidad });
    },
    onError: (err: Error) => alert(err.message),
  });

  // ── Mutación: registrar venta ──────────────────
  const registrarVentaMutation = useMutation({
    mutationFn: registrarVenta,
    onSuccess: () => {
      alert("Venta completada correctamente");
      vaciarFactura();
    },
    onError: (err: Error) => alert(err.message),
  });

  // ── Acciones ───────────────────────────────────
  const handleBuscar = useCallback(
    (input: string) => {
      if (!input.trim()) return;

      if (modoBusqueda === "cliente") {
        buscarClienteMutation.mutate(input.trim());
        return;
      }

      const match = input.trim().match(/^([0-9]+)(\*(-?[0-9.]+))?$/);
      if (!match) {
        alert("Formato inválido. Usa: codigo o codigo*cantidad");
        return;
      }
      const codigo = match[1];
      const cantidad = parseFloat(match[3]) || 1;
      buscarProductoMutation.mutate({ codigo, cantidad });
    },
    [modoBusqueda]
  );

  const handleEliminarUltimo = useCallback(() => {
    setProductosFactura((prev) => {
      const updated = prev.slice(0, -1);
      setUltimoProducto(updated.length ? updated[updated.length - 1] : null);
      return updated;
    });
  }, []);

  const handleAbrirTotalizar = useCallback(() => {
    if (!clienteSeleccionado) return alert("Debe seleccionar un cliente");
    if (productosFactura.length === 0) return alert("No hay productos");
    setModoTotalizar(true);
  }, [clienteSeleccionado, productosFactura]);

  const handleAgregarPago = useCallback(() => {
    const monto = parseFloat(montoMedio);
    if (!medioSeleccionado || isNaN(monto) || monto <= 0) return;
    setPagos((prev) => [...prev, { medio: medioSeleccionado, monto }]);
    setMedioSeleccionado(null);
    setMontoMedio("");
  }, [medioSeleccionado, montoMedio]);

  const handleConfirmarVenta = useCallback(() => {
    if (faltante > 0) return alert("Aún falta dinero para completar la venta");
    if (!clienteSeleccionado) return;
    registrarVentaMutation.mutate({
      productos: productosFactura,
      cliente: clienteSeleccionado,
      pagos,
      total,
      fecha: new Date().toISOString(),
    });
  }, [faltante, clienteSeleccionado, productosFactura, pagos, total]);

  const vaciarFactura = useCallback(() => {
    setProductosFactura([]);
    setUltimoProducto(null);
    setClienteSeleccionado(null);
    setModoBusqueda("cliente");
    setModoTotalizar(false);
    setPagos([]);
    setMedioSeleccionado(null);
    setMontoMedio("");
    setFiltroMedio("");
  }, []);

  const handleEscape = useCallback(() => {
    if (modoTotalizar && !medioSeleccionado) {
      setModoTotalizar(false);
      setPagos([]);
      setFiltroMedio("");
    } else if (medioSeleccionado) {
      setMedioSeleccionado(null);
      setMontoMedio("");
    } else {
      navigate(routes.vender);
    }
  }, [modoTotalizar, medioSeleccionado, navigate]);

  return {
    // estado
    productosFactura,
    ultimoProducto,
    clienteSeleccionado,
    modoBusqueda,
    setModoBusqueda,
    modoTotalizar,
    filtroMedio,
    setFiltroMedio,
    pagos,
    medioSeleccionado,
    setMedioSeleccionado,
    montoMedio,
    setMontoMedio,
    mediosDePago,
    total,
    faltante,
    inputRef,
    // acciones
    handleBuscar,
    handleEliminarUltimo,
    handleAbrirTotalizar,
    handleAgregarPago,
    handleConfirmarVenta,
    vaciarFactura,
    handleEscape,
    // estado de carga
    isBuscandoCliente: buscarClienteMutation.isPending,
    isBuscandoProducto: buscarProductoMutation.isPending,
    isConfirmando: registrarVentaMutation.isPending,
  };
}
