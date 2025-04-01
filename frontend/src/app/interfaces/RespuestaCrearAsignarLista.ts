import { Lista } from './Lista';

export interface RespuestaCrearAsignarLista {
  exito: boolean;
  mensaje: string;
  lista: Lista;
}