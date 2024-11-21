import { HttpClient } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { configuracion_app } from '../configuraciones/configuracion_app';

import { ObtenerSolicitudes } from '../interfaces/ObtenerSolicitudes';
import { RespuestaObtenerSolicitudes } from '../interfaces/RespuestaObtenerSolicitudes';

@Injectable({ providedIn: 'root' })

export class SolicitudesService 
{
  private http = inject(HttpClient);
  private api: string = configuracion_app.api;

  obtenerSolicitudes(objeto: ObtenerSolicitudes): Observable<RespuestaObtenerSolicitudes> 
  {
    return this.http.post<RespuestaObtenerSolicitudes>
    (
      `${this.api}obtener-solicitudes`,
      objeto
    );
  }
}