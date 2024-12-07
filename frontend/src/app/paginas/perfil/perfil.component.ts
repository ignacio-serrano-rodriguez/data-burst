import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DatosComponent } from './datos/datos.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { RecargaService } from '../../servicios/recarga.service';
import { NotificacionesService } from '../../servicios/notificaciones.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    DatosComponent,
    SolicitudesComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnDestroy {
  @ViewChild(DatosComponent) datosComponent!: DatosComponent;
  @ViewChild(SolicitudesComponent) solicitudesComponent!: SolicitudesComponent;

  private recargaSubscription!: Subscription;

  constructor(
    private recargaService: RecargaService,
    private notificacionesService: NotificacionesService
  ) {}

  ngOnInit() {
    this.recargaSubscription = this.recargaService.recargarPerfil$.subscribe(() => {
      this.recargarComponentes();
    });
  }

  ngOnDestroy() {
    if (this.recargaSubscription) {
      this.recargaSubscription.unsubscribe();
    }
  }

  recargarComponentes() {
    this.datosComponent.recargar();
    this.solicitudesComponent.recargar();
    this.notificacionesService.actualizarNumeroSolicitudes();
  }
}