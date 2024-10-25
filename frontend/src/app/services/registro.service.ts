import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaRegistro } from '../interfaces/RespuestaRegistro';
import { Registro } from '../interfaces/Registro';

@Injectable({
  providedIn: 'root'
})

export class RegistroService {

  private http = inject(HttpClient)
  private apiUrl:string = appsettings.apiUrl;

  constructor() {}

  registrarse(objeto:Registro):Observable<RespuestaRegistro>{

    return this.http.post<RespuestaRegistro>(`
      ${this.apiUrl}/usuarios`, 
      objeto, 
      { headers: { 'Content-Type': 'application/ld+json' } });
  }

}