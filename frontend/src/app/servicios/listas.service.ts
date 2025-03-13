import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { configuracion_app } from '../configuraciones/configuracion_app';
import { CrearAsignarLista } from '../interfaces/CrearAsignarLista';
import { RespuestaCrearAsignarLista } from '../interfaces/RespuestaCrearAsignarLista';
import { RespuestaObtenerListas } from '../interfaces/RespuestaObtenerListas';
import { RespuestaObtenerLista } from '../interfaces/RespuestaObtenerLista';
import { RespuestaModificarNombreLista } from '../interfaces/RespuestaModificarNombreLista';
import { RespuestaDesasignarLista } from '../interfaces/RespuestaDesasignarLista';
import { RespuestaCambiarVisibilidadLista } from '../interfaces/RespuestaCambiarVisibilidadLista';
import { RespuestaInvitarAmigo } from '../interfaces/RespuestaInvitarAmigo';
import { Elemento } from '../interfaces/Elemento';

@Injectable({ providedIn: 'root' })
export class ListasService {
  private http = inject(HttpClient);
  private api: string = configuracion_app.api;

  obtenerCategorias(): Observable<{ exito: boolean, mensaje: string, categorias: any[] }> {
    return this.http.get<{ exito: boolean, mensaje: string, categorias: any[] }>(
      `${this.api}/obtener-categorias`
    ).pipe(
      catchError(this.handleError)
    );
  }

  crearAsignarLista(objeto: CrearAsignarLista): Observable<RespuestaCrearAsignarLista> {
    return this.http.post<RespuestaCrearAsignarLista>(
      `${this.api}/crear-asignar-lista`,
      objeto
    ).pipe(
      catchError(this.handleError)
    );
  }

  obtenerListas(usuarioID: number): Observable<RespuestaObtenerListas> {
    return this.http.post<RespuestaObtenerListas>(
      `${this.api}/obtener-listas`,
      { usuarioID }
    ).pipe(
      catchError(this.handleError)
    );
  }

  obtenerLista(listaId: number, usuarioId: number): Observable<RespuestaObtenerLista> {
    return this.http.post<RespuestaObtenerLista>(
      `${this.api}/obtener-lista`,
      { lista_id: listaId, usuario_id: usuarioId }
    ).pipe(
      catchError(this.handleError)
    );
  }

  obtenerElementosLista(listaId: number): Observable<{ exito: boolean, mensaje: string, elementos: Elemento[] }> {
    const usuarioId = Number(localStorage.getItem('id')) || 0;
    return this.http.get<{ exito: boolean, mensaje: string, elementos: Elemento[] }>(
      `${this.api}/obtener-elementos-lista/${listaId}?usuario_id=${usuarioId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  modificarNombreLista(id: number, nuevoNombre: string): Observable<RespuestaModificarNombreLista> {
    return this.http.post<RespuestaModificarNombreLista>(
      `${this.api}/modificar-nombre-lista`,
      { id, nuevoNombre }
    ).pipe(
      catchError(this.handleError)
    );
  }

  desasignarLista(listaId: number, usuarioId: number): Observable<RespuestaDesasignarLista> {
    return this.http.post<RespuestaDesasignarLista>(
      `${this.api}/desasignar-lista`,
      { listaId, usuarioId }
    ).pipe(
      catchError(this.handleError)
    );
  }

  cambiarVisibilidadLista(listaId: number, usuarioId: number, publica: boolean): Observable<RespuestaCambiarVisibilidadLista> {
    return this.http.post<RespuestaCambiarVisibilidadLista>(
      `${this.api}/cambiar-visibilidad-lista`,
      { lista_id: listaId, usuario_id: usuarioId, publica }
    ).pipe(
      catchError(this.handleError)
    );
  }

  invitarAmigo(listaId: number | null, amigoId: number, invitadorId: number): Observable<RespuestaInvitarAmigo> {
    return this.http.post<RespuestaInvitarAmigo>(
      `${this.api}/invitar-amigo`,
      { listaId, amigoId, invitadorId }
    ).pipe(
      catchError(this.handleError)
    );
  }

  obtenerColaboradores(listaId: number): Observable<{ exito: boolean, mensaje: string, colaboradores: any[] }> {
    return this.http.get<{ exito: boolean, mensaje: string, colaboradores: any[] }>(
      `${this.api}/obtener-colaboradores/${listaId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.error.mensaje || 'Something bad happened; please try again later.'));
  }
}