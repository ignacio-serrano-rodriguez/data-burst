import { Amigo } from './Amigo';

export interface RespuestaObtenerAmigos 
{
    exito: boolean;
    mensaje: string;
    amigos: Amigo[];
}