import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { configuracion_app } from '../configuraciones/configuracion_app';
import { AgregarUsuario } from '../interfaces/AgregarUsuario';
import { RespuestaAgregarUsuario } from '../interfaces/RespuestaAgregarUsuario';
import { RespuestaObtenerAmigos } from '../interfaces/RespuestaObtenerAmigos';
import { RespuestaBuscarUsuarios } from '../interfaces/RespuestaBuscarUsuarios'; // Importar la interfaz

@Injectable({ providedIn: 'root' })
export class AmigosService {
  private http = inject(HttpClient);
  private api: string = configuracion_app.api;

  agregarUsuario(objeto: AgregarUsuario): Observable<RespuestaAgregarUsuario> {
    return this.http.post<RespuestaAgregarUsuario>(
      `${this.api}/agregar-usuario`, 
      objeto
    );
  }

  obtenerAmigos(usuarioID: number): Observable<RespuestaObtenerAmigos> {
    return this.http.post<RespuestaObtenerAmigos>(
      `${this.api}/obtener-amigos`, 
      { usuarioID }
    );
  }

  buscarUsuariosNoAgregados(query: string, usuarioID: number): Observable<RespuestaBuscarUsuarios> {
    return this.http.post<RespuestaBuscarUsuarios>(
      `${this.api}/buscar-usuarios-no-agregados`, 
      { query, usuarioID }
    );
  }

  buscarAmigos(query: string, usuarioID: number): Observable<RespuestaObtenerAmigos> {
    return this.http.post<RespuestaObtenerAmigos>(
      `${this.api}/buscar-amigos`, 
      { query, usuarioID }
    );
  }
}