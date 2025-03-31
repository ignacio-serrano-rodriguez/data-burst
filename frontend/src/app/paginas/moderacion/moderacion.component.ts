import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModeracionService } from '../../servicios/moderacion.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Reporte } from '../../interfaces/Reporte';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-moderacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './moderacion.component.html',
  styleUrls: ['./moderacion.component.css']
})
export class ModeracionComponent implements OnInit {

  @ViewChild('rechazarReporteDialog') rechazarReporteDialog!: TemplateRef<any>;

  reportes: Reporte[] = [];
  reportesPendientes: Reporte[] = [];
  reportesAprobados: Reporte[] = [];
  reportesRechazados: Reporte[] = [];
  cargando = true;
  motivoRechazo = '';
  reporteSeleccionado: Reporte | null = null;
  isMobile = false;

  constructor(
    private router: Router,
    private moderacionService: ModeracionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const permiso = localStorage.getItem('permiso');
      if (permiso !== "2" && permiso !== "3") {
        this.router.navigate(['home']);
      } else {
        this.cargarReportes();
      }
    } else {
      this.router.navigate(['home']);
    }
  }

  cargarReportes() {
    this.cargando = true;
    this.moderacionService.obtenerReportes().subscribe({
      next: (data) => {
        if (data.exito) {
          this.reportes = data.reportes;
          this.filtrarReportes();
        } else {
          this.snackBar.open(data.mensaje || 'Error al cargar reportes', 'Cerrar', {
            duration: 3000
          });
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error obteniendo reportes:', error);
        this.snackBar.open('Error al comunicarse con el servidor', 'Cerrar', {
          duration: 3000
        });
        this.cargando = false;
      }
    });
  }

  filtrarReportes() {
    this.reportesPendientes = this.reportes.filter(r => r.estado === 0);
    this.reportesAprobados = this.reportes.filter(r => r.estado === 1);
    this.reportesRechazados = this.reportes.filter(r => r.estado === 2);
  }

  getEstadoTexto(estado: number): string {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'Aprobado';
      case 2: return 'Rechazado';
      default: return 'Desconocido';
    }
  }

  getEstadoClase(estado: number): string {
    switch (estado) {
      case 0: return 'estado-pendiente';
      case 1: return 'estado-aprobado';
      case 2: return 'estado-rechazado';
      default: return '';
    }
  }

  confirmarAprobacion(reporte: Reporte) {
    this.reporteSeleccionado = reporte;

    const cambios: any = {
      nombre: reporte.nombre_reportado || reporte.elemento.nombre,
      fecha_aparicion: reporte.fecha_aparicion_reportada || reporte.elemento.fecha_aparicion,
      descripcion: reporte.descripcion_reportada || reporte.elemento.descripcion
    };

    if (reporte.categoria_reportada) {
      cambios.categoria_id = reporte.categoria_reportada.id;
    }

    this.moderacionService.aprobarReporte(reporte.id, cambios).subscribe({
      next: (response) => {
        if (response.exito) {
          this.snackBar.open('Reporte aprobado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.cargarReportes();
        } else {
          this.snackBar.open(response.mensaje || 'Error al aprobar reporte', 'Cerrar', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
        this.reporteSeleccionado = null;
      },
      error: (error) => {
        console.error('Error aprobando reporte:', error);
        this.snackBar.open('Error al comunicarse con el servidor', 'Cerrar', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
        this.reporteSeleccionado = null;
      }
    });
  }

  abrirDialogoRechazo(reporte: Reporte) {
    this.reporteSeleccionado = reporte;
    this.motivoRechazo = '';

    const dialogConfig: MatDialogConfig = {
      width: this.isMobile ? '95%' : '500px',
      maxWidth: this.isMobile ? '100vw' : '90vw',
      maxHeight: this.isMobile ? '80vh' : '90vh',
      disableClose: true
    };

    const dialogRef = this.dialog.open(this.rechazarReporteDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.motivoRechazo.trim()) {
        this.rechazarReporte();
      } else {
        this.reporteSeleccionado = null;
      }
    });
  }

  rechazarReporte() {
    if (!this.reporteSeleccionado || !this.motivoRechazo.trim()) {
      return;
    }

    this.moderacionService.rechazarReporte(
      this.reporteSeleccionado.id,
      this.motivoRechazo
    ).subscribe({
      next: (response) => {
        if (response.exito) {
          this.snackBar.open('Reporte rechazado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.cargarReportes();
        } else {
          this.snackBar.open(response.mensaje || 'Error al rechazar reporte', 'Cerrar', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
        this.reporteSeleccionado = null;
        this.motivoRechazo = '';
      },
      error: (error) => {
        console.error('Error rechazando reporte:', error);
        this.snackBar.open('Error al comunicarse con el servidor', 'Cerrar', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
        this.reporteSeleccionado = null;
        this.motivoRechazo = '';
      }
    });
  }
}