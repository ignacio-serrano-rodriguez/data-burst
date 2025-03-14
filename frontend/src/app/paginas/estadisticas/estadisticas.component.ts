import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { EstadisticasService } from '../../servicios/estadisticas.service';

interface Estadistica {
  orden: number;
  masAgregado: string;
  masGustado: string;
  menosGustado: string;
}

interface EstadisticaResponse {
  masAgregado: {
    items: any[];
    total: number;
  };
  masGustado: {
    items: any[];
    total: number;
  };
  menosGustado: {
    items: any[];
    total: number;
  };
}

interface Categoria {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, AfterViewInit {
  categorias: Categoria[] = [];
  categoriaSeleccionada: number | null = null;
  displayedColumns: string[] = ['orden', 'masAgregado', 'masGustado', 'menosGustado'];
  dataSource = new MatTableDataSource<Estadistica>([]);
  noEstadisticas: boolean = true;
  isLoading: boolean = false;

  // Propiedades para manejar la paginación del servidor
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  isFirstSearch: boolean = true;
  busquedaRealizada: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  ngAfterViewInit() {
    // No asignamos paginator ya que usamos paginación en el servidor
  }

  cargarCategorias(): void {
    this.isLoading = true;
    this.estadisticasService.obtenerCategorias().subscribe({
      next: (response) => {
        if (response.exito && response.categorias) {
          this.categorias = response.categorias;
        } else {
          console.error('Error al cargar categorías:', response.mensaje);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
        this.isLoading = false;
      }
    });
  }

  onCategoriaChange(): void {
    if (this.categoriaSeleccionada !== null) {
      this.obtenerEstadisticas(true);
    }
  }

  obtenerEstadisticas(resetPage: boolean = false): void {
    if (!this.categoriaSeleccionada) return;

    if (resetPage) {
      this.pageIndex = 0;
      this.isFirstSearch = true;
    }

    this.isLoading = true;
    this.busquedaRealizada = true;

    console.log('Buscando estadísticas para categoría ID:', this.categoriaSeleccionada, 'Página:', this.pageIndex + 1);

    this.estadisticasService.generarEstadisticas(
      this.categoriaSeleccionada,
      this.pageIndex + 1,
      this.pageSize
    ).subscribe({
      next: (response: EstadisticaResponse) => {
        console.log('Respuesta del servidor:', response);

        const hasData = (response.masAgregado?.items?.length > 0) ||
          (response.masGustado?.items?.length > 0) ||
          (response.menosGustado?.items?.length > 0);

        if (hasData) {
          this.dataSource.data = this.combinarDatos(response.masAgregado, response.masGustado, response.menosGustado);

          if (this.isFirstSearch) {
            const maxTotal = Math.max(
              response.masAgregado.total || 0,
              response.masGustado.total || 0,
              response.menosGustado.total || 0
            );
            this.totalItems = maxTotal > 0 ? maxTotal : 32;
            this.isFirstSearch = false;
          }

          this.noEstadisticas = false;
        } else {
          this.noEstadisticas = true;
        }

        setTimeout(() => {
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator._changePageSize(this.pageSize);
          }
          this.isLoading = false;
        }, 0);
      },
      error: (error) => {
        console.error('Error al generar estadísticas:', error);
        this.noEstadisticas = true;
        this.isLoading = false;
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = 10;
    this.obtenerEstadisticas(false);
  }

  combinarDatos(masAgregado: any, masGustado: any, menosGustado: any): Estadistica[] {
    const maxLength = Math.max(
      masAgregado.items?.length || 0,
      masGustado.items?.length || 0,
      menosGustado.items?.length || 0
    );

    const combinedData: Estadistica[] = [];
    const baseIndex = this.pageIndex * this.pageSize;

    for (let i = 0; i < maxLength; i++) {
      combinedData.push({
        orden: baseIndex + i + 1,
        masAgregado: masAgregado.items[i] ? masAgregado.items[i].nombre : '',
        masGustado: masGustado.items[i] ? masGustado.items[i].nombre : '',
        menosGustado: menosGustado.items[i] ? menosGustado.items[i].nombre : ''
      });
    }

    return combinedData;
  }
}