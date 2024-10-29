import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { configuracion_app } from '../configuraciones/configuracion_app';

import { RespuestaLogin } from '../interfaces/RespuestaLogin';
import { Login } from '../interfaces/Login';
import { Registro } from '../interfaces/Registro';
import { RespuestaRegistro } from '../interfaces/RespuestaRegistro';

@Injectable
({
  providedIn: 'root'
})

export class loginRegistroLogoutService 
{

  private http = inject(HttpClient)
  private api:string = configuracion_app.api;

  iniciar_sesion(objeto:Login):Observable<RespuestaLogin>
  {
    return this.http.post<RespuestaLogin>
    (`
      ${this.api}auth/signin`, 
      objeto
    );
  }

  registrarse(objeto:Registro):Observable<RespuestaRegistro>
  {
    return this.http.post<RespuestaRegistro>
    (`
      ${this.api}auth/signup`, 
      objeto, 
      { headers: 
        { 
          'Content-Type': 'application/ld+json' 
        } 
      }
    );
  }
}