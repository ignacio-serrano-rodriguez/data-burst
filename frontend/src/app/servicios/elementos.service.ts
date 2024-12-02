import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { configuracion_app } from '../configuraciones/configuracion_app';
import { Elemento } from '../interfaces/Elemento';
import { RespuestaBuscarElementos } from '../interfaces/RespuestaBuscarElementos';
import { RespuestaCrearElemento } from '../interfaces/RespuestaCrearElemento';
import { RespuestaAsignarElemento } from '../interfaces/RespuestaAsignarElemento';

@Injectable({ providedIn: 'root' })
export class ElementosService {
  private http = inject(HttpClient);
  private api: string = configuracion_app.api;

  buscarElementos(query: string): Observable<RespuestaBuscarElementos> {
    return this.http.post<RespuestaBuscarElementos>(
      `${this.api}/buscar-elementos`, 
      { query }
    );
  }

  crearElemento(elemento: Elemento): Observable<RespuestaCrearElemento> {
    return this.http.post<RespuestaCrearElemento>(
      `${this.api}/crear-elemento`, 
      elemento
    );
  }

  asignarElemento(listaId: number, elementoId: number): Observable<RespuestaAsignarElemento> {
    return this.http.post<RespuestaAsignarElemento>(
      `${this.api}/asignar-elemento`, 
      { lista_id: listaId, elemento_id: elementoId }
    );
  }

  quitarElemento(listaId: number, elementoId: number): Observable<{ exito: boolean, mensaje: string }> {
    return this.http.post<{ exito: boolean, mensaje: string }>(
      `${this.api}/quitar-elemento`, 
      { lista_id: listaId, elemento_id: elementoId }
    );
  }

  toggleLikeDislike(listaId: number, elementoId: number, positivo: boolean | null): Observable<{ exito: boolean, mensaje: string }> {
    return this.http.post<{ exito: boolean, mensaje: string }>(
      `${this.api}/toggle-like-dislike`, 
      { lista_id: listaId, elemento_id: elementoId, positivo }
    );
  }

  actualizarComentario(listaId: number, elementoId: number, comentario: string): Observable<{ exito: boolean, mensaje: string }> {
    return this.http.post<{ exito: boolean, mensaje: string }>(
      `${this.api}/actualizar-comentario`, 
      { lista_id: listaId, elemento_id: elementoId, comentario }
    );
  }
}