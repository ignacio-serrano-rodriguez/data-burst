import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { configuracion_app } from '../configuraciones/configuracion_app';

export interface RespuestaObtenerUsuarios {
    exito: boolean;
    usuarios: {
        id: number;
        usuario: string;
        mail: string | null;
        permiso: string | null;
    }[];
    error?: string;
}

@Injectable({ providedIn: 'root' })
export class AdministracionService {
    private http = inject(HttpClient);
    private api = configuracion_app.api;

    obtenerUsuarios(): Observable<RespuestaObtenerUsuarios> {
        return this.http.post<RespuestaObtenerUsuarios>(
            `${this.api}/obtener-usuarios`,
            {}
        ).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.error('Error al obtener usuarios:', error);
        return throwError(() =>
            new Error(error.error.mensaje || 'No se pudieron obtener los usuarios.')
        );
    }
}