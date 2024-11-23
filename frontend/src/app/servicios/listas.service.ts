import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { configuracion_app } from '../configuraciones/configuracion_app';
import { CrearAsignarLista } from '../interfaces/CrearAsignarLista';
import { RespuestaCrearAsignarLista } from '../interfaces/RespuestaCrearAsignarLista';
import { RespuestaObtenerListas } from '../interfaces/RespuestaObtenerListas';
import { RespuestaObtenerLista } from '../interfaces/RespuestaObtenerLista';

@Injectable({ providedIn: 'root' })
export class ListasService {
  private http = inject(HttpClient);
  private api: string = configuracion_app.api;

  crearAsignarLista(objeto: CrearAsignarLista): Observable<RespuestaCrearAsignarLista> {
    return this.http.post<RespuestaCrearAsignarLista>(
      `${this.api}crear-asignar-lista`, 
      objeto
    );
  }

  obtenerListas(usuarioID: number): Observable<RespuestaObtenerListas> {
    return this.http.post<RespuestaObtenerListas>(
      `${this.api}obtener-listas`, 
      { usuarioID }
    );
  }

  obtenerLista(id: number): Observable<RespuestaObtenerLista> {
    return this.http.get<RespuestaObtenerLista>(
      `${this.api}obtener-lista/${id}`
    );
  }
}