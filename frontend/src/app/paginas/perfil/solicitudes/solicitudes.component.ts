import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitudesService } from '../../../servicios/solicitudes.service';
import { Solicitud, RespuestaObtenerSolicitudes } from '../../../interfaces/RespuestaObtenerSolicitudes';
import { ObtenerSolicitudes } from '../../../interfaces/ObtenerSolicitudes';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'] // Corregido aquí
})
export class SolicitudesComponent implements OnInit {

  solicitudesAmistad: Solicitud[] = [];
  solicitudesLista: Solicitud[] = [];

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    const usuarioId = localStorage.getItem('id'); // Obtener el ID del usuario desde el localStorage
    if (usuarioId) {
      const solicitud: ObtenerSolicitudes = { id: parseInt(usuarioId, 10) }; // Crear el objeto de solicitud con el ID del usuario
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

  aceptarSolicitud(solicitud: Solicitud) {
    console.log('Solicitud aceptada:', solicitud);
    // Lógica para aceptar la solicitud
  }

  denegarSolicitud(solicitud: Solicitud) {
    console.log('Solicitud denegada:', solicitud);
    // Lógica para denegar la solicitud
  }
}