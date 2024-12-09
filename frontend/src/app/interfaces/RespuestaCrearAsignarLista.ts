import { Lista } from './Lista';

export interface RespuestaCrearAsignarLista {
  exito: boolean;
  mensaje: string;
  lista: Lista; // Asegurarse de que la propiedad lista esté presente
}