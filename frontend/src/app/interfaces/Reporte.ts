export interface Reporte {
    id: number;
    usuario: {
        id: number;
        nombre: string;
    };
    elemento: {
        id: number;
        nombre: string;
        fecha_aparicion: string;
        descripcion: string;
        categoria?: {
            id: number;
            nombre: string;
        };
    };
    nombre_reportado: string | null;
    fecha_aparicion_reportada: string | null;
    descripcion_reportada: string | null;
    categoria_reportada?: {
        id: number;
        nombre: string;
    } | null;
    momento_reporte: string;
    estado: number;
    moderador: {
        id: number;
        nombre: string;
    } | null;
    momento_procesado: string | null;
    comentario_moderador: string | null;
    gestionado: boolean;
}