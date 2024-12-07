import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {

  private cerrarSesionSubject = new Subject<void>();
  private recargarHomeSubject = new Subject<void>();
  private recargarEstadisticasSubject = new Subject<void>();

  cerrarSesion$ = this.cerrarSesionSubject.asObservable();
  recargarHome$ = this.recargarHomeSubject.asObservable();
  recargarEstadisticas$ = this.recargarEstadisticasSubject.asObservable();

  cerrarSesion() {
    this.cerrarSesionSubject.next();
  }

  recargarHome() {
    this.recargarHomeSubject.next();
  }

  recargarEstadisticas() {
    this.recargarEstadisticasSubject.next();
  }
}