import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { configuracion_app } from '../configuraciones/configuracion_app';
import { AgregarUsuario } from '../interfaces/AgregarUsuario';
import { RespuestaAgregarUsuario } from '../interfaces/RespuestaAgregarUsuario';
import { RespuestaObtenerAmigos } from '../interfaces/RespuestaObtenerAmigos';
import { RespuestaBuscarUsuarios } from '../interfaces/RespuestaBuscarUsuarios';

@Injectable({ providedIn: 'root' })
export class AmigosService {
  private http = inject(HttpClient);
  private api: string = configuracion_app.api;

  agregarUsuario(objeto: AgregarUsuario): Observable<RespuestaAgregarUsuario> {
    return this.http.post<RespuestaAgregarUsuario>(
      `${this.api}/agregar-usuario`,
      objeto
    ).pipe(
      catchError(this.handleError)
    );
  }

  obtenerAmigos(usuarioID: number): Observable<RespuestaObtenerAmigos> {
    return this.http.post<RespuestaObtenerAmigos>(
      `${this.api}/obtener-amigos`,
      { usuarioID }
    ).pipe(
      catchError(this.handleError)
    );
  }

  buscarUsuariosNoAgregados(query: string, usuarioID: number): Observable<RespuestaBuscarUsuarios> {
    return this.http.post<RespuestaBuscarUsuarios>(
      `${this.api}/buscar-usuarios-no-agregados`,
      { query, usuarioID }
    ).pipe(
      catchError(this.handleError)
    );
  }

  buscarAmigosNoManipulanLista(query: string, usuarioID: number, listaID: number): Observable<RespuestaObtenerAmigos> {
    return this.http.post<RespuestaObtenerAmigos>(
      `${this.api}/buscar-amigos-no-manipulan-lista`,
      { query, usuarioID, listaID }
    ).pipe(
      catchError(this.handleError)
    );
  }

  obtenerAmigoPorNombre(nombreAmigo: string): Observable<{ exito: boolean, amigo: { id: number, nombre: string } }> {
    return this.http.get<{ exito: boolean, amigo: { id: number, nombre: string } }>(
      `${this.api}/obtener-amigo-por-nombre/${nombreAmigo}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  eliminarAmistad(usuarioID: number, amigoID: number): Observable<{ exito: boolean, mensaje: string }> {
    return this.http.post<{ exito: boolean, mensaje: string }>(
      `${this.api}/eliminar-amistad`,
      { usuarioID, amigoID }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.error.mensaje || 'Something bad happened; please try again later.'));
  }
}