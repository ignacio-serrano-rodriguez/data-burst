import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatIconModule } from '@angular/material/icon';
import { SolicitudesService } from '../servicios/solicitudes.service'; // Ajustar la ruta del servicio

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
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent implements OnInit {
  @Input() nombreUsuario: string = '';
  mostrarAdministracion: boolean = false;
  permisoUsuario: string = "1";
  nuevasSolicitudes: number = 0;

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit() {
    this.nombreUsuario = localStorage.getItem('usuario') || "usuario";

    if (this.nombreUsuario) {
      this.nombreUsuario = this.nombreUsuario;

      this.permisoUsuario = localStorage.getItem('permiso') || "1";

      if (this.permisoUsuario == "2") {
        console.log(localStorage.getItem('permiso'));
        this.mostrarAdministracion = true;
      } else {
        this.mostrarAdministracion = false;
      }

      const usuarioId = Number(localStorage.getItem('id'));
      if (usuarioId) {
        this.solicitudesService.obtenerNumeroSolicitudes(usuarioId).subscribe({
          next: (data) => {
            this.nuevasSolicitudes = data.nuevasSolicitudes;
          },
          error: (error) => {
            console.error('Error al obtener el número de nuevas solicitudes:', error);
          }
        });
      }
    }
  }

  cerrarSesion() {
    localStorage.clear();
    window.location.href = '/';
  }

  verSolicitudes() {
    window.location.href = '/perfil';
  }
}