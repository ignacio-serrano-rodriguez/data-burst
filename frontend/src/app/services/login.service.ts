import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { RespuestaLogin } from '../interfaces/RespuestaLogin';
import { Login } from '../interfaces/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient)
  private apiUrl:string = appsettings.apiUrl;

  constructor() {}

  login(objeto:Login):Observable<RespuestaLogin>{

    return this.http.post<RespuestaLogin>(`${this.apiUrl}/auth/signin`, objeto);
    
  }
}