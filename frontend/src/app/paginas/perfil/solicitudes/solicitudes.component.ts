import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudesService } from '../../../servicios/solicitudes.service';
import { NotificacionesService } from '../../../servicios/notificaciones.service'; // Importar NotificacionesService
import { AplicarSolicitud } from '../../../interfaces/AplicarSolicitud';
import { ObtenerSolicitudes } from '../../../interfaces/ObtenerSolicitudes';
import { Solicitud, RespuestaObtenerSolicitudes } from '../../../interfaces/RespuestaObtenerSolicitudes';
import { RespuestaAplicarSolicitud } from '../../../interfaces/RespuestaAplicarSolicitud';

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

  displayedColumns: string[] = ['nombre', 'acciones'];
  dataSourceAmistad = new MatTableDataSource<Solicitud>([]);
  dataSourceLista = new MatTableDataSource<Solicitud>([]);

  constructor(private solicitudesService: SolicitudesService, private notificacionesService: NotificacionesService) { }

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes() {
    if (typeof localStorage !== 'undefined') {
      const IDUsuario = localStorage.getItem('id'); // Obtener el ID del usuario desde el localStorage
      if (IDUsuario) {
        let solicitud: ObtenerSolicitudes = { id: parseInt(IDUsuario, 10) }; // Crear el objeto de solicitud con el ID del usuario
        this.solicitudesService.obtenerSolicitudes(solicitud).subscribe((respuesta: RespuestaObtenerSolicitudes) => {
          if (respuesta.exito) {
            this.dataSourceAmistad.data = respuesta.solicitudes.amistad;
            this.dataSourceLista.data = respuesta.solicitudes.lista;
          } else {
            console.log(respuesta.mensaje);
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
      this.obtenerSolicitudes(); // Vuelve a cargar las solicitudes
      this.notificacionesService.actualizarNumeroSolicitudes(); // Actualizar el número de solicitudes en la cabecera
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
      this.obtenerSolicitudes(); // Vuelve a cargar las solicitudes
      this.notificacionesService.actualizarNumeroSolicitudes(); // Actualizar el número de solicitudes en la cabecera
    });
  }

  recargar() {
    this.obtenerSolicitudes();
  }
}