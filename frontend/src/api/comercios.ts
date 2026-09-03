import { apiClient } from './client';

export interface Comercio {
  id: string;
  razonSocial: string;
  nombreComercial: string;
  identificadorFiscal: string;
}

export function listComercios() {
  return apiClient.get<Comercio[]>('/comercios').then((r) => r.data);
}
