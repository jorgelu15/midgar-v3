import type { ClienteDTO } from "./cliente.dto";

export interface CuentaCreditoDTO {
    id_cuenta_credito?: string | null;
    id_inst?: string;
    id_cliente?: string | null;
    cupo_maximo?: number;
    cupo_disponible?: number;
    estado_credito?: 'ACTIVO' | 'EN_MORA' | 'BLOQUEADO';
    dia_corte?: number;
    cuotas_predeterminadas: '1' | '2' | '3' | '6';
    tasa_interes_mensual?: number;
    cobra_intereses?: boolean;
    cobra_cuota_manejo?: boolean;
    valor_cuota_manejo?: number | null;
    deuda_actual?: number;
    dias_mora?: number;
    fecha_ultima_compra?: string | null;
    fecha_ultimo_pago?: string | null;
    monto_ultimo_pago?: number | null;
    clientes?: ClienteDTO;
    updatedAt?: string;
    createdAt?: string;
}
