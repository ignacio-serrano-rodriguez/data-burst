import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SolicitudesService } from './solicitudes.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private nuevasSolicitudesSubject = new BehaviorSubject<number>(0);
  nuevasSolicitudes$ = this.nuevasSolicitudesSubject.asObservable();
  private intervalId: any;

  constructor(private solicitudesService: SolicitudesService) {}

  actualizarNumeroSolicitudes() {
    const usuarioId = Number(localStorage.getItem('id'));
    if (usuarioId) {
      this.solicitudesService.obtenerNumeroSolicitudes(usuarioId).subscribe({
        next: (data) => {
          this.nuevasSolicitudesSubject.next(data.nuevasSolicitudes);
        },
        error: (error) => {
          console.error('Error al obtener el número de nuevas solicitudes:', error);
        }
      });
    }
  }

  iniciarRevisionPeriodica(intervalo: number = 60000) { // Intervalo en milisegundos, por defecto 1 minuto
    this.detenerRevisionPeriodica(); // Detener cualquier revisión periódica existente
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