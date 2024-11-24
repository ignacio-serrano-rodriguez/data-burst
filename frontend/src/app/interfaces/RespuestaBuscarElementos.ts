import { Elemento } from './Elemento';

export interface RespuestaBuscarElementos {
    exito: boolean;
    mensaje: string;
    elementos: Elemento[];
}