import { Lista } from './Lista';

export interface RespuestaObtenerAmigoDetalle {
    exito: boolean;
    mensaje?: string;
    amigo: {
        id: number;
        nombre: string;
    };
    listas: Lista[];
}