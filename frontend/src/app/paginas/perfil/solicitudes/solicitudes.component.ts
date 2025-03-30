// Update solicitudes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudesService } from '../../../servicios/solicitudes.service';
import { NotificacionesService } from '../../../servicios/notificaciones.service';
import { AplicarSolicitud } from '../../../interfaces/AplicarSolicitud';
import { ObtenerSolicitudes } from '../../../interfaces/ObtenerSolicitudes';
import { Solicitud, RespuestaObtenerSolicitudes } from '../../../interfaces/RespuestaObtenerSolicitudes';
import { RespuestaAplicarSolicitud } from '../../../interfaces/RespuestaAplicarSolicitud';

interface NotificacionCombinada extends Solicitud {
  tipoNotificacion: 'amistad' | 'lista';
  descripcion?: string;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  displayedColumns: string[] = ['tipo', 'nombre', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<NotificacionCombinada>([]);

  hayNotificaciones = false;

  constructor(private solicitudesService: SolicitudesService, private notificacionesService: NotificacionesService) { }

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes() {
    if (typeof localStorage !== 'undefined') {
      const IDUsuario = localStorage.getItem('id');
      if (IDUsuario) {
        let solicitud: ObtenerSolicitudes = { id: parseInt(IDUsuario, 10) };
        this.solicitudesService.obtenerSolicitudes(solicitud).subscribe((respuesta: RespuestaObtenerSolicitudes) => {
          if (respuesta.exito) {
            const notificacionesAmistad = respuesta.solicitudes.amistad.map(s => ({
              ...s,
              tipoNotificacion: 'amistad' as const,
              descripcion: 'quiere ser tu amigo'
            }));

            const notificacionesLista = respuesta.solicitudes.lista.map(s => ({
              ...s,
              tipoNotificacion: 'lista' as const,
              descripcion: 'te ha invitado a su lista'
            }));

            const notificacionesCombinadas = [...notificacionesAmistad, ...notificacionesLista];
            this.dataSource.data = notificacionesCombinadas;
            this.hayNotificaciones = notificacionesCombinadas.length > 0;
          } else {
            console.log(respuesta.mensaje);
            this.dataSource.data = [];
            this.hayNotificaciones = false;
          }
        });
      } else {
        console.log('No se encontró el ID del usuario en el localStorage.');
      }
    } else {
      console.log('localStorage no está disponible.');
    }
  }

  aceptarSolicitud(nombre: string, tipo: string) {
    let aplicarSolicitud: AplicarSolicitud = {
      nombre,
      IDUsuario: parseInt(localStorage.getItem('id')!, 10),
      tipo
    };
    this.solicitudesService.aceptarSolicitud(aplicarSolicitud).subscribe((respuesta: RespuestaAplicarSolicitud) => {
      console.log('Solicitud aceptada:', respuesta.mensaje);
      this.obtenerSolicitudes();
      this.notificacionesService.actualizarNumeroSolicitudes();
    });
  }

  denegarSolicitud(nombre: string, tipo: string) {
    let aplicarSolicitud: AplicarSolicitud = {
      nombre,
      IDUsuario: parseInt(localStorage.getItem('id')!, 10),
      tipo
    };
    this.solicitudesService.denegarSolicitud(aplicarSolicitud).subscribe((respuesta: RespuestaAplicarSolicitud) => {
      console.log('Solicitud denegada:', respuesta.mensaje);
      this.obtenerSolicitudes();
      this.notificacionesService.actualizarNumeroSolicitudes();
    });
  }

  getTipoIcon(tipo: string): string {
    return tipo === 'amistad' ? 'person' : 'list';
  }

  recargar() {
    this.obtenerSolicitudes();
  }
}