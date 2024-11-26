import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule
  ],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'] 
})
export class SolicitudesComponent implements OnInit {

  solicitudesAmistad: Solicitud[] = [];
  solicitudesLista: Solicitud[] = [];

  constructor(private solicitudesService: SolicitudesService, private notificacionesService: NotificacionesService) {} // Inyectar NotificacionesService

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes() {
    const IDUsuario = localStorage.getItem('id'); // Obtener el ID del usuario desde el localStorage
    if (IDUsuario) {
      let solicitud: ObtenerSolicitudes = { id: parseInt(IDUsuario, 10) }; // Crear el objeto de solicitud con el ID del usuario
      this.solicitudesService.obtenerSolicitudes(solicitud).subscribe((respuesta: RespuestaObtenerSolicitudes) => {
        if (respuesta.exito) {
          this.solicitudesAmistad = respuesta.solicitudes.amistad;
          this.solicitudesLista = respuesta.solicitudes.lista;
        } else {
          console.log(respuesta.mensaje);
        }
      });
    } else {
      console.log('No se encontró el ID del usuario en el localStorage.');
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
}