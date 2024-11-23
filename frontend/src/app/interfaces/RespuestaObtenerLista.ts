import { Lista } from './Lista';

export interface RespuestaObtenerLista {
    exito: boolean;
    mensaje: string;
    lista: Lista;
}