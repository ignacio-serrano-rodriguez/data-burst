export interface Elemento {
    id: number;
    nombre: string;
    fecha_aparicion: string;
    informacion_extra: string;
    puntuacion: number;
    descripcion: string;
    momento_creacion: string;
    usuario_id: number; // Añadir el usuario_id
    positivo: boolean | null; // Añadir el campo positivo
    comentario: string | null; // Añadir el campo comentario
    usuariosComentariosPositivos: {
        usuario_id: number; // Añadir el usuario_id
        usuario: string;
        positivo: boolean | null;
        comentario: string | null;
    }[]; // Añadir el campo usuariosComentariosPositivos
}