export interface Lista {
  id: number;
  nombre: string;
  compartida: boolean;
  publica: boolean;
  categorias?: { id: number, nombre: string }[];
}