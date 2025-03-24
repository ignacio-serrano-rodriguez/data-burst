import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { configuracion_app } from '../configuraciones/configuracion_app';

@Injectable({
    providedIn: 'root'
})
export class ModeracionService {
    private http = inject(HttpClient);
    private api: string = configuracion_app.api;

    obtenerReportes(): Observable<any> {
        return this.http.get<any>(`${this.api}/obtener-reportes`);
    }

    aprobarReporte(reporteId: number, cambios: any): Observable<any> {
        const usuarioId = Number(localStorage.getItem('id')) || 0;
        return this.http.post<any>(`${this.api}/aprobar-reporte`, {
            reporte_id: reporteId,
            usuario_id: usuarioId,
            cambios
        });
    }

    rechazarReporte(reporteId: number, comentarioRechazo: string): Observable<any> {
        const usuarioId = Number(localStorage.getItem('id')) || 0;
        return this.http.post<any>(`${this.api}/rechazar-reporte`, {
            reporte_id: reporteId,
            usuario_id: usuarioId,
            comentario: comentarioRechazo
        });
    }
}   