export interface Elemento {
    id: number;
    nombre: string;
    fecha_aparicion: string;
    descripcion: string;
    momento_creacion: string;
    usuario_id: number;
    puntuacion: boolean | null;
    comentario: string | null;
    usuariosComentariosPuntuaciones: {
        usuario_id: number;
        usuario: string;
        puntuacion: boolean | null;
        comentario: string | null;
    }[];
}