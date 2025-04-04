import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SolicitudesService } from '../../servicios/solicitudes.service';
import { NotificacionesService } from '../../servicios/notificaciones.service';
import { ObtenerSolicitudes } from '../../interfaces/ObtenerSolicitudes';
import { Solicitud, RespuestaObtenerSolicitudes } from '../../interfaces/RespuestaObtenerSolicitudes';
import { AplicarSolicitud } from '../../interfaces/AplicarSolicitud';
import { Subscription } from 'rxjs';
import { AmigosService } from '../../servicios/amigos.service';
import { ListasService } from '../../servicios/listas.service';
import { RecargaService } from '../../servicios/recarga.service';

interface NotificacionCombinada extends Solicitud {
  tipoNotificacion: 'amistad' | 'lista';
  descripcion?: string;
}

@Component({
  selector: 'app-notificaciones-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './notificaciones-menu.component.html',
  styleUrls: ['./notificaciones-menu.component.css']
})
export class NotificacionesMenuComponent implements OnInit, OnDestroy {
  notificaciones: NotificacionCombinada[] = [];
  cargando = true;
  private refreshSubscription: Subscription;
  hayNotificaciones = false;

  private solicitudesService = inject(SolicitudesService);
  private notificacionesService = inject(NotificacionesService);
  private amigosService = inject(AmigosService);
  private listasService = inject(ListasService);
  private recargaService = inject(RecargaService);

  constructor() {
    this.refreshSubscription = this.notificacionesService.refreshNotifications$.subscribe(() => {
      this.cargarNotificaciones();
    });
  }

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  cargarNotificaciones() {
    this.cargando = true;
    if (typeof localStorage !== 'undefined') {
      const IDUsuario = localStorage.getItem('id');
      if (IDUsuario) {
        let solicitud: ObtenerSolicitudes = { id: parseInt(IDUsuario, 10) };
        this.solicitudesService.obtenerSolicitudes(solicitud).subscribe({
          next: (respuesta: RespuestaObtenerSolicitudes) => {
            this.cargando = false;
            if (respuesta.exito) {
              const notificacionesAmistad = respuesta.solicitudes.amistad.map(s => ({
                ...s,
                tipoNotificacion: 'amistad' as const,
                descripcion: 'quiere ser tu amigo'
              }));

              const notificacionesLista = respuesta.solicitudes.lista.map(s => ({
                ...s,
                tipoNotificacion: 'lista' as const,
                descripcion: `${s.invitador} te ha invitado`
              }));

              this.notificaciones = [...notificacionesAmistad, ...notificacionesLista].slice(0, 4);
              this.hayNotificaciones = this.notificaciones.length > 0;
            } else {
              console.log(respuesta.mensaje);
              this.notificaciones = [];
              this.hayNotificaciones = false;
            }
          },
          error: (error) => {
            console.error('Error al cargar notificaciones:', error);
            this.cargando = false;
            this.notificaciones = [];
            this.hayNotificaciones = false;
          }
        });
      }
    }
  }

  aceptarSolicitud(nombre: string, tipo: string) {
    const usuarioID = parseInt(localStorage.getItem('id')!, 10);
    let aplicarSolicitud: AplicarSolicitud = {
      nombre,
      IDUsuario: usuarioID,
      tipo
    };

    this.solicitudesService.aceptarSolicitud(aplicarSolicitud).subscribe({
      next: respuesta => {
        console.log('Solicitud aceptada:', respuesta.mensaje);

        if (tipo === 'amistad') {
          this.amigosService.obtenerAmigos(usuarioID).subscribe();
        } else if (tipo === 'lista') {
          this.listasService.obtenerListas(usuarioID).subscribe();
        }

        this.recargaService.recargarDataBurst();

        this.cargarNotificaciones();
        this.notificacionesService.actualizarNumeroSolicitudes();
      },
      error: (error) => {
        console.error('Error al aceptar solicitud:', error);
      }
    });
  }

  denegarSolicitud(nombre: string, tipo: string) {
    let aplicarSolicitud: AplicarSolicitud = {
      nombre,
      IDUsuario: parseInt(localStorage.getItem('id')!, 10),
      tipo
    };
    this.solicitudesService.denegarSolicitud(aplicarSolicitud).subscribe({
      next: respuesta => {
        console.log('Solicitud denegada:', respuesta.mensaje);
        this.cargarNotificaciones();
        this.notificacionesService.actualizarNumeroSolicitudes();
      },
      error: (error) => {
        console.error('Error al denegar solicitud:', error);
      }
    });
  }

  getTipoIcon(tipo: string): string {
    return tipo === 'amistad' ? 'person' : 'list';
  }

  recargar() {
    this.cargarNotificaciones();
  }
}