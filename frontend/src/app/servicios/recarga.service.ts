import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {

  private cerrarSesionSubject = new Subject<void>();
  private recargarHomeSubject = new Subject<void>();
  private recargarEstadisticasSubject = new Subject<void>();
  private recargarPerfilSubject = new Subject<void>();
  private recargarDataBurstSubject = new Subject<void>(); // Nuevo Subject para Data Burst

  cerrarSesion$ = this.cerrarSesionSubject.asObservable();
  recargarHome$ = this.recargarHomeSubject.asObservable();
  recargarEstadisticas$ = this.recargarEstadisticasSubject.asObservable();
  recargarPerfil$ = this.recargarPerfilSubject.asObservable();
  recargarDataBurst$ = this.recargarDataBurstSubject.asObservable(); // Observable para Data Burst

  cerrarSesion() {
    this.cerrarSesionSubject.next();
  }

  recargarHome() {
    this.recargarHomeSubject.next();
  }

  recargarEstadisticas() {
    this.recargarEstadisticasSubject.next();
  }

  recargarPerfil() {
    this.recargarPerfilSubject.next();
  }

  recargarDataBurst() {
    this.recargarDataBurstSubject.next(); // Emitir evento para Data Burst
  }
}