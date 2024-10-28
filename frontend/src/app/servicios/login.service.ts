import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { configuracion_app } from '../configuraciones/configuracion_app';
import { Observable } from 'rxjs';
import { RespuestaLogin } from '../interfaces/RespuestaLogin';
import { Login } from '../interfaces/Login';

const api:string = configuracion_app.api;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient)

  constructor() {}

  login(objeto:Login):Observable<RespuestaLogin>{

    return this.http.post<RespuestaLogin>(`${api}auth/signin`, objeto);
    
  }
}