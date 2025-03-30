import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SolicitudesService } from '../../servicios/solicitudes.service';
import { NotificacionesService } from '../../servicios/notificaciones.service';
import { ObtenerSolicitudes } from '../../interfaces/ObtenerSolicitudes';
import { Solicitud, RespuestaObtenerSolicitudes } from '../../interfaces/RespuestaObtenerSolicitudes';
import { AplicarSolicitud } from '../../interfaces/AplicarSolicitud';
import { Subscription } from 'rxjs';

interface NotificacionCombinada extends Solicitud {
    tipoNotificacion: 'amistad' | 'lista';
    descripcion?: string;
}

@Component({
    selector: 'app-notificaciones-menu',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    template: `
    <div class="notificaciones-menu-container">
      <div *ngIf="cargando" class="notificaciones-loading">
        Cargando notificaciones...
      </div>
      
      <div *ngIf="!cargando && notificaciones.length === 0" class="notificaciones-empty">
        No tienes notificaciones pendientes
      </div>
      
      <div *ngIf="!cargando && notificaciones.length > 0" class="notificaciones-list">
        <div *ngFor="let notif of notificaciones" class="notificacion-item">
          <div class="notificacion-icon">
            <mat-icon [ngClass]="{'amistad-icon': notif.tipoNotificacion === 'amistad', 'lista-icon': notif.tipoNotificacion === 'lista'}">
              {{ getTipoIcon(notif.tipoNotificacion) }}
            </mat-icon>
          </div>
          <div class="notificacion-content">
            <div class="notificacion-user">{{ notif.nombre }}</div>
            <div class="notificacion-desc">{{ notif.descripcion }}</div>
          </div>
          <div class="notificacion-actions">
            <button mat-icon-button color="primary" (click)="aceptarSolicitud(notif.nombre, notif.tipoNotificacion)" title="Aceptar">
              <mat-icon>check_circle</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="denegarSolicitud(notif.nombre, notif.tipoNotificacion)" title="Rechazar">
              <mat-icon>cancel</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .notificaciones-menu-container {
      min-width: 300px;
      max-width: 350px;
      padding: 0;
      box-sizing: border-box;
      overflow-x: hidden;
    }
    
    .notificaciones-loading,
    .notificaciones-empty {
      padding: 16px;
      text-align: center;
      color: #757575;
    }
    
    .notificaciones-list {
      max-height: 400px;
    }
    
    .notificacion-item {
      display: flex;
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
      align-items: center;
      overflow: hidden;
    }
    
    .notificacion-icon {
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .amistad-icon {
      color: #AE00CD;
    }
    
    .lista-icon {
      color: #3F51B5;
    }
    
    .notificacion-content {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }
    
    .notificacion-user {
      font-weight: 500;
      color: #AE00CD;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .notificacion-desc {
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .notificacion-actions {
      display: flex;
      margin-left: 8px;
      flex-shrink: 0;
    }
    
    .notificacion-actions button {
      transform: scale(0.85);
    }
    `]
})
export class NotificacionesMenuComponent implements OnInit, OnDestroy {
    notificaciones: NotificacionCombinada[] = [];
    cargando = true;
    private refreshSubscription: Subscription;
    hayNotificaciones = false;

    constructor(
        private solicitudesService: SolicitudesService,
        private notificacionesService: NotificacionesService
    ) {
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
                                descripcion: 'te ha invitado a su lista'
                            }));

                            this.notificaciones = [...notificacionesAmistad, ...notificacionesLista];
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
        let aplicarSolicitud: AplicarSolicitud = {
            nombre,
            IDUsuario: parseInt(localStorage.getItem('id')!, 10),
            tipo
        };
        this.solicitudesService.aceptarSolicitud(aplicarSolicitud).subscribe({
            next: respuesta => {
                console.log('Solicitud aceptada:', respuesta.mensaje);
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