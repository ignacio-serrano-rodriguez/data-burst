import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { RespuestaLogin } from '../interfaces/RespuestaLogin';
import { Login } from '../interfaces/Login';

const api:string = appsettings.api;

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