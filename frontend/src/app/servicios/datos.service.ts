import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { configuracion_app } from '../configuraciones/configuracion_app';

import { ModificarDatosUsuario } from '../interfaces/ModificarDatosUsuario';
import { RespuestaModificarDatosUsuario } from '../interfaces/RespuestaModificarDatosUsuario';

@Injectable({providedIn: 'root'})

export class DatosService 
{
  private http = inject(HttpClient)
  private api:string = configuracion_app.api;

  modificarDatosUsuario(objeto:ModificarDatosUsuario):Observable<RespuestaModificarDatosUsuario>
  {
    return this.http.post<RespuestaModificarDatosUsuario>
    (
      `${this.api}modificar-datos-usuario`, 
      objeto
    );
  }
}
