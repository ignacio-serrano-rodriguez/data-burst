import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { configuracion_app } from '../configuraciones/configuracion_app';
import { ObtenerSolicitudes } from '../interfaces/ObtenerSolicitudes';
import { RespuestaObtenerSolicitudes } from '../interfaces/RespuestaObtenerSolicitudes';
import { AplicarSolicitud } from '../interfaces/AplicarSolicitud';
import { RespuestaAplicarSolicitud } from '../interfaces/RespuestaAplicarSolicitud';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private http = inject(HttpClient);
  private api: string = configuracion_app.api;

  obtenerSolicitudes(obtenerSolicitudes: ObtenerSolicitudes): Observable<RespuestaObtenerSolicitudes> {
    return this.http.post<RespuestaObtenerSolicitudes>(
      `${this.api}/obtener-solicitudes`, 
      obtenerSolicitudes
    );
  }

  aceptarSolicitud(aplicarSolicitud: AplicarSolicitud): Observable<RespuestaAplicarSolicitud> {
    return this.http.post<RespuestaAplicarSolicitud>(
      `${this.api}/aceptar-solicitud`, 
      aplicarSolicitud
    );
  }

  denegarSolicitud(aplicarSolicitud: AplicarSolicitud): Observable<RespuestaAplicarSolicitud> {
    return this.http.post<RespuestaAplicarSolicitud>(
      `${this.api}/denegar-solicitud`, 
      aplicarSolicitud
    );
  }
}