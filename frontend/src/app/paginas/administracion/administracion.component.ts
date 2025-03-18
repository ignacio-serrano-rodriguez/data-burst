import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AdministracionService, RespuestaObtenerUsuarios } from '../../servicios/administracion.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Usuario {
  id: number;
  usuario: string;
  mail: string | null;
  permiso: string;
}

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {
  displayedColumns: string[] = ['usuario', 'mail', 'permiso'];
  dataSource = new MatTableDataSource<Usuario>([]);
  isLoading: boolean = false;
  searchTerm: string = '';

  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  allUsuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private administracionService: AdministracionService
  ) { }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const permiso = localStorage.getItem('permiso');
      if (permiso !== "3") {
        this.router.navigate(['home']);
        return;
      }
    } else {
      this.router.navigate(['home']);
      return;
    }

    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;

    this.administracionService.obtenerUsuarios().subscribe({
      next: (resp: RespuestaObtenerUsuarios) => {
        if (resp.exito && resp.usuarios) {
          const usuariosNormalizados = resp.usuarios.map(usuario => ({
            ...usuario,
            permiso: usuario.permiso !== null ? String(usuario.permiso) : '1'
          }));

          this.allUsuarios = [...usuariosNormalizados];
          this.usuariosFiltrados = [...usuariosNormalizados];
          this.totalItems = usuariosNormalizados.length;

          this.actualizarVistaPaginacion();

          setTimeout(() => {
            if (this.paginator) {
              this.paginator.pageIndex = this.pageIndex;
              this.paginator._changePageSize(this.pageSize);
            }
            this.isLoading = false;
          }, 0);
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.usuariosFiltrados = [...this.allUsuarios];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.usuariosFiltrados = this.allUsuarios.filter(usuario => {
        const usuarioMatch = usuario.usuario?.toLowerCase().includes(searchTermLower);
        const mailMatch = usuario.mail?.toLowerCase().includes(searchTermLower);
        return usuarioMatch || mailMatch;
      });
    }

    this.totalItems = this.usuariosFiltrados.length;
    this.pageIndex = 0;

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    this.actualizarVistaPaginacion();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  actualizarVistaPaginacion(): void {
    const inicio = this.pageIndex * this.pageSize;
    const fin = inicio + this.pageSize;
    this.dataSource.data = this.usuariosFiltrados.slice(inicio, fin);
  }

  handlePageEvent(event: PageEvent): void {
    console.log('Evento de paginación:', event);
    this.pageIndex = event.pageIndex;
    this.pageSize = 10;
    this.actualizarVistaPaginacion();
  }

  actualizarPermiso(usuario: Usuario): void {
    if (usuario.id === 1) {
      console.log('No se puede modificar el permiso del administrador principal (ID 1)');
      return;
    }

    console.log(`Actualizando permiso del usuario ${usuario.usuario} a ${usuario.permiso}`);
    this.administracionService.actualizarPermiso(usuario.id, usuario.permiso).subscribe({
      next: (resp) => {
        if (resp.exito) {
          const usuarioEnArray = this.usuariosFiltrados.find(u => u.id === usuario.id);
          if (usuarioEnArray) {
            usuarioEnArray.permiso = usuario.permiso;
          }

          console.log('Permiso actualizado correctamente');
        } else {
          console.error('Error al actualizar permiso:', resp.error);
        }
      },
      error: (err) => {
        console.error('Error al actualizar permiso:', err);
      }
    });
  }

  obtenerNombrePermiso(permiso: string): string {
    switch (permiso) {
      case '0': return 'Ninguno';
      case '1': return 'Normal';
      case '2': return 'Moderador';
      case '3': return 'Administrador';
      default: return 'Desconocido';
    }
  }
}