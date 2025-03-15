export interface Elemento {
    id: number;
    nombre: string;
    fecha_aparicion: string;
    descripcion: string;
    momento_creacion: string;
    usuario_id: number;
    positivo: boolean | null;
    comentario: string | null;
    usuariosComentariosPositivos: {
        usuario_id: number;
        usuario: string;
        positivo: boolean | null;
        comentario: string | null;
    }[];
}