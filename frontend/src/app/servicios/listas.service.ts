import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { configuracion_app } from '../configuraciones/configuracion_app';

import { CrearLista } from '../interfaces/CrearLista';
import { RespuestaCrearLista } from '../interfaces/RespuestaCrearLista';

@Injectable({providedIn: 'root'})

export class ListasService 
{
  private http = inject(HttpClient)
  private api:string = configuracion_app.api;

  login(objeto:CrearLista):Observable<RespuestaCrearLista>
  {
    return this.http.post<RespuestaCrearLista>
    (
      `${this.api}crear-lista`, 
      objeto
    );
  }
}
