import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NotificacionesService } from '../servicios/notificaciones.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { RecargaService } from '../servicios/recarga.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit, OnDestroy {
  @Input() nombreUsuario: string = '';
  @Input() rutaActual: string = '';
  mostrarModeracion: boolean = false;
  mostrarAdministracion: boolean = false;
  permisoUsuario: string = "1";
  nuevasSolicitudes: number = 0;

  constructor(
    private notificacionesService: NotificacionesService,
    private router: Router,
    private recargaService: RecargaService
  ) { }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      this.nombreUsuario = localStorage.getItem('usuario') || "usuario";

      if (this.nombreUsuario) {
        this.nombreUsuario = this.nombreUsuario;

        this.permisoUsuario = localStorage.getItem('permiso') || "1";

        if (this.permisoUsuario == "2") {
          this.mostrarModeracion = true;
        } else if (this.permisoUsuario == "3") {
          this.mostrarModeracion = true;
          this.mostrarAdministracion = true;
        } else {
          this.mostrarModeracion = false;
          this.mostrarAdministracion = false;
        }

        this.notificacionesService.nuevasSolicitudes$.subscribe(nuevasSolicitudes => {
          this.nuevasSolicitudes = nuevasSolicitudes;
        });

        this.notificacionesService.actualizarNumeroSolicitudes();
        this.notificacionesService.iniciarRevisionPeriodica();
      }

      this.router.events.pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.rutaActual = event.urlAfterRedirects;
      });
    }
  }

  ngOnDestroy() {
    this.notificacionesService.detenerRevisionPeriodica();
  }

  cerrarSesion() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/']).then(() => {
      this.recargaService.cerrarSesion();
    });
  }

  recargarPerfil() {
    this.router.navigate(['/perfil']).then(() => {
      this.recargaService.recargarPerfil();
    });
  }

  recargarHome() {
    this.router.navigate(['/home']).then(() => {
      this.recargaService.recargarDataBurst();
    });
  }

  recargarEstadisticas() {
    this.router.navigate(['/estadisticas']).then(() => {
      this.recargaService.recargarEstadisticas();
    });
  }

  recargarModeracion() {
    this.router.navigate(['/moderacion']).then(() => {
      this.recargaService.recargarModeracion();
    });
  }

  recargarAdministracion() {
    this.router.navigate(['/administracion']).then(() => {
      this.recargaService.recargarAdministracion();
    });
  }
}