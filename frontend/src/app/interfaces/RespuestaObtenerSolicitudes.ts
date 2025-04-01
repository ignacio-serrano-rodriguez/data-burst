export interface Solicitud {
    nombre: string;
    invitador?: string;
}

export interface Solicitudes {
    amistad: Solicitud[];
    lista: Solicitud[];
}

export interface RespuestaObtenerSolicitudes {
    exito: boolean;
    mensaje: string;
    solicitudes: Solicitudes;
}