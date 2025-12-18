export interface ProductoRepository {
    id_existencia: number,
    id_inst: number,
    id_producto: number,
    cantidad: number,
    cantidad_minima: number,
    precio_venta: number,
    costo: number,
    estado: number,
    codigo: string,
    nombre: string,
    categoria_id: number,
    marca_id: number,
    unidad_medida_id: number,
    impuesto_id: number,
    proveedor_id: number,
    foto_url: string
}