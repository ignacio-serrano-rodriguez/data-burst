export interface Lista {
  id: number;
  nombre: string;
  compartida: boolean;
  publica: boolean;
  categoria?: {
    id: number;
    nombre: string;
  };
}