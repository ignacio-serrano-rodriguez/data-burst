import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SolicitudesService } from './solicitudes.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private nuevasSolicitudesSubject = new BehaviorSubject<number>(0);
  nuevasSolicitudes$ = this.nuevasSolicitudesSubject.asObservable();

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
}