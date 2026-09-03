export const ESTADOS_COMANDA = [
  'abierta',
  'en_preparacion',
  'servida',
  'cerrada',
  'cancelada',
] as const;
export type EstadoComanda = (typeof ESTADOS_COMANDA)[number];

export const ESTADOS_DETALLE_COMANDA = [
  'pendiente',
  'en_preparacion',
  'listo',
  'entregado',
  'cancelado',
] as const;
export type EstadoDetalleComanda = (typeof ESTADOS_DETALLE_COMANDA)[number];
