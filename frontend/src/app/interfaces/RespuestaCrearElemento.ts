import { Elemento } from './Elemento';

export interface RespuestaCrearElemento {
    exito: boolean;
    mensaje: string;
    elemento: Elemento;
}