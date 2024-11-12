import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { configuracion_app } from '../configuraciones/configuracion_app';

import { RespuestaLogin } from '../interfaces/RespuestaLogin';
import { Login } from '../interfaces/Login';
import { Registro } from '../interfaces/Registro';
import { RespuestaRegistro } from '../interfaces/RespuestaRegistro';
import { ValidarToken } from '../interfaces/ValidarToken';
import { RespuestaValidarToken } from '../interfaces/RespuestaValidarToken';

@Injectable({providedIn: 'root'})

export class accesoService 
{
  private http = inject(HttpClient)
  private api:string = configuracion_app.api;

  login(objeto:Login):Observable<RespuestaLogin>
  {
    return this.http.post<RespuestaLogin>
    (
      `${this.api}login`, 
      objeto
    );
  }

  registro(objeto:Registro):Observable<RespuestaRegistro>
  {
    return this.http.post<RespuestaRegistro>
    (
      `${this.api}registro`, 
      objeto
    );
  }

  validarToken(objeto:ValidarToken):Observable<RespuestaValidarToken>
  {
    return this.http.post<RespuestaValidarToken>
    (
      `${this.api}validar-token`, 
      objeto
    );
  }
}