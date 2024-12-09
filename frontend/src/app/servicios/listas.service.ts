import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { configuracion_app } from '../configuraciones/configuracion_app';
import { CrearAsignarLista } from '../interfaces/CrearAsignarLista';
import { RespuestaCrearAsignarLista } from '../interfaces/RespuestaCrearAsignarLista';
import { RespuestaObtenerListas } from '../interfaces/RespuestaObtenerListas';
import { RespuestaObtenerLista } from '../interfaces/RespuestaObtenerLista';
import { RespuestaModificarNombreLista } from '../interfaces/RespuestaModificarNombreLista'; // Importar la interfaz
import { RespuestaDesasignarLista } from '../interfaces/RespuestaDesasignarLista'; // Importar la interfaz
import { RespuestaCambiarVisibilidadLista } from '../interfaces/RespuestaCambiarVisibilidadLista'; // Importar la interfaz
import { RespuestaInvitarAmigo } from '../interfaces/RespuestaInvitarAmigo'; // Importar la interfaz
import { Elemento } from '../interfaces/Elemento';

@Injectable({ providedIn: 'root' })
export class ListasService {
  private http = inject(HttpClient);
  private api: string = configuracion_app.api;

  crearAsignarLista(objeto: CrearAsignarLista): Observable<RespuestaCrearAsignarLista> {
    return this.http.post<RespuestaCrearAsignarLista>(
      `${this.api}/crear-asignar-lista`, 
      objeto
    );
  }

  obtenerListas(usuarioID: number): Observable<RespuestaObtenerListas> {
    return this.http.post<RespuestaObtenerListas>(
      `${this.api}/obtener-listas`, 
      { usuarioID }
    );
  }

  obtenerLista(listaId: number, usuarioId: number): Observable<RespuestaObtenerLista> {
    return this.http.post<RespuestaObtenerLista>(
      `${this.api}/obtener-lista`, 
      { lista_id: listaId, usuario_id: usuarioId }
    );
  }

  obtenerElementosLista(listaId: number): Observable<{ exito: boolean, mensaje: string, elementos: Elemento[] }> {
    const usuarioId = Number(localStorage.getItem('id')) || 0;
    return this.http.get<{ exito: boolean, mensaje: string, elementos: Elemento[] }>(
      `${this.api}/obtener-elementos-lista/${listaId}?usuario_id=${usuarioId}`
    );
  }

  modificarNombreLista(id: number, nuevoNombre: string): Observable<RespuestaModificarNombreLista> {
    return this.http.post<RespuestaModificarNombreLista>(
      `${this.api}/modificar-nombre-lista`, 
      { id, nuevoNombre }
    );
  }

  desasignarLista(listaId: number, usuarioId: number): Observable<RespuestaDesasignarLista> {
    return this.http.post<RespuestaDesasignarLista>(
      `${this.api}/desasignar-lista`, 
      { listaId, usuarioId }
    );
  }

  cambiarVisibilidadLista(listaId: number, usuarioId: number, publica: boolean): Observable<RespuestaCambiarVisibilidadLista> {
    return this.http.post<RespuestaCambiarVisibilidadLista>(
      `${this.api}/cambiar-visibilidad-lista`,
      { lista_id: listaId, usuario_id: usuarioId, publica }
    );
  }

  invitarAmigo(listaId: number | null, amigoId: number, invitadorId: number): Observable<RespuestaInvitarAmigo> {
    return this.http.post<RespuestaInvitarAmigo>(
      `${this.api}/invitar-amigo`,
      { listaId, amigoId, invitadorId }
    );
  }

  obtenerColaboradores(listaId: number): Observable<{ exito: boolean, mensaje: string, colaboradores: any[] }> {
    return this.http.get<{ exito: boolean, mensaje: string, colaboradores: any[] }>(
      `${this.api}/obtener-colaboradores/${listaId}`
    );
  }
}