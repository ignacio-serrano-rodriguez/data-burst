import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {
  private recargarPerfilSource = new Subject<void>();
  private recargarDataBurstSource = new Subject<void>();
  private recargarEstadisticasSource = new Subject<void>();
  private recargarModeracionSource = new Subject<void>();
  private recargarAdministracionSource = new Subject<void>();
  private cerrarSesionSource = new Subject<void>();
  private recargarHomeSource = new Subject<void>();

  recargarPerfil$ = this.recargarPerfilSource.asObservable();
  recargarDataBurst$ = this.recargarDataBurstSource.asObservable();
  recargarEstadisticas$ = this.recargarEstadisticasSource.asObservable();
  recargarModeracion$ = this.recargarModeracionSource.asObservable();
  recargarAdministracion$ = this.recargarAdministracionSource.asObservable();
  cerrarSesion$ = this.cerrarSesionSource.asObservable();
  recargarHome$ = this.recargarHomeSource.asObservable();

  recargarPerfil() {
    this.recargarPerfilSource.next();
  }

  recargarDataBurst() {
    this.recargarDataBurstSource.next();
  }

  recargarEstadisticas() {
    this.recargarEstadisticasSource.next();
  }

  recargarModeracion() {
    this.recargarModeracionSource.next();
  }

  recargarAdministracion() {
    this.recargarAdministracionSource.next();
  }

  cerrarSesion() {
    this.cerrarSesionSource.next();
  }

  recargarHome() {
    this.recargarHomeSource.next();
  }
}