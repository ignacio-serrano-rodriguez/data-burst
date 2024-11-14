import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { configuracion_app } from '../configuraciones/configuracion_app';

import { AgregarUsuario } from '../interfaces/AgregarUsuario';
import { RespuestaAgregarUsuario } from '../interfaces/RespuestaAgregarUsuario';

@Injectable({providedIn: 'root'})

export class AmigosService 
{
  private http = inject(HttpClient)
  private api:string = configuracion_app.api;

  agregarUsuario(objeto:AgregarUsuario):Observable<RespuestaAgregarUsuario>
  {
    return this.http.post<RespuestaAgregarUsuario>
    (
      `${this.api}agregar-usuario`, 
      objeto
    );
  }
}
