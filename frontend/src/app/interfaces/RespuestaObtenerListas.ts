import { Lista } from './Lista';

export interface RespuestaObtenerListas 
{
    exito: boolean;
    mensaje: string;
    listas: Lista[];
}