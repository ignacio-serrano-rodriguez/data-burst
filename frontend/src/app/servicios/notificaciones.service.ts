import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SolicitudesService } from './solicitudes.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private nuevasSolicitudesSubject = new BehaviorSubject<number>(0);
  nuevasSolicitudes$ = this.nuevasSolicitudesSubject.asObservable();

  private refreshNotificationsSubject = new Subject<void>();
  refreshNotifications$ = this.refreshNotificationsSubject.asObservable();

  private intervalId: any;

  constructor(private solicitudesService: SolicitudesService) { }

  actualizarNumeroSolicitudes() {
    const usuarioId = Number(localStorage.getItem('id'));
    if (usuarioId) {
      this.solicitudesService.obtenerNumeroSolicitudes(usuarioId).subscribe({
        next: (data) => {
          this.nuevasSolicitudesSubject.next(data.nuevasSolicitudes);
          this.refreshNotificationsSubject.next();
        },
        error: (error) => {
          console.error('Error al obtener el número de nuevas solicitudes:', error);
        }
      });
    }
  }

  iniciarRevisionPeriodica(intervalo: number = 60000) {
    this.detenerRevisionPeriodica();
    this.intervalId = setInterval(() => {
      this.actualizarNumeroSolicitudes();
    }, intervalo);
  }

  detenerRevisionPeriodica() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}