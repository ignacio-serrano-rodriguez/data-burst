import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { configuracion_app } from '../configuraciones/configuracion_app';
import { Elemento } from '../interfaces/Elemento';
import { RespuestaBuscarElementos } from '../interfaces/RespuestaBuscarElementos';
import { RespuestaCrearElemento } from '../interfaces/RespuestaCrearElemento';

@Injectable({ providedIn: 'root' })
export class ElementosService {
  private http = inject(HttpClient);
  private api: string = configuracion_app.api;

  buscarElementos(query: string): Observable<RespuestaBuscarElementos> {
    return this.http.get<RespuestaBuscarElementos>(
      `${this.api}/buscar-elementos?query=${query}`
    );
  }

  crearElemento(elemento: Elemento): Observable<RespuestaCrearElemento> {
    return this.http.post<RespuestaCrearElemento>(
      `${this.api}/crear-elemento`, 
      elemento
    );
  }
}