import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EstadisticasService {
    private apiUrl = 'http://127.0.0.1:8000/api/generar-estadisticas';

    constructor(private http: HttpClient) { }

    generarEstadisticas(categoria: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { categoria });
    }
}