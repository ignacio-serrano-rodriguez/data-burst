import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {
  private recargarComponentesSubject = new Subject<void>();
  private cerrarSesionSubject = new Subject<void>();
  private recargarEstadisticasSubject = new Subject<void>();

  recargarComponentes$ = this.recargarComponentesSubject.asObservable();
  cerrarSesion$ = this.cerrarSesionSubject.asObservable();
  recargarEstadisticas$ = this.recargarEstadisticasSubject.asObservable();

  recargarComponentes() {
    this.recargarComponentesSubject.next();
  }

  cerrarSesion() {
    this.cerrarSesionSubject.next();
  }

  recargarEstadisticas() {
    this.recargarEstadisticasSubject.next();
  }
}