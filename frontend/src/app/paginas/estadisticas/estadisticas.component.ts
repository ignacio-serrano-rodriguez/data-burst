import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    FormsModule
  ],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, AfterViewInit {
  categoria: string = '';
  displayedColumns: string[] = ['orden', 'masAgregado', 'masGustado', 'menosGustado'];
  dataSource = new MatTableDataSource<Estadistica>([]);
  noEstadisticas: boolean = true; // Iniciar como true para no mostrar la tabla
  isLoading: boolean = false; // Nueva propiedad para indicador de carga

  // Propiedades para manejar la paginación del servidor
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  isFirstSearch: boolean = true;
  busquedaRealizada: boolean = false; // Nueva propiedad para rastrear si ya se hizo una búsqueda

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit() {
    // Inicialización de variables
  }

  ngAfterViewInit() {
    // No asignar this.dataSource.paginator = this.paginator
  }

  obtenerEstadisticas(resetPage: boolean = false): void {
    if (resetPage) {
      this.pageIndex = 0;
      this.isFirstSearch = true;
    }

    this.isLoading = true; // Activar indicador de carga
    this.busquedaRealizada = true; // Marcar que se ha realizado una búsqueda

    console.log('Buscando estadísticas para categoría:', this.categoria, 'Página:', this.pageIndex + 1);

    this.estadisticasService.generarEstadisticas(
      this.categoria,
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

          // Solo actualizar el totalItems en la primera búsqueda o si es mayor que el existente
          if (this.isFirstSearch) {
            // Obtener el total máximo de los tres tipos de datos
            const maxTotal = Math.max(
              response.masAgregado.total || 0,
              response.masGustado.total || 0,
              response.menosGustado.total || 0
            );

            // Si tenemos datos pero total=0, establecer al menos un valor mínimo
            this.totalItems = maxTotal > 0 ? maxTotal : 32;
            this.isFirstSearch = false;

            console.log(`Estableciendo total inicial: ${this.totalItems}`);
          }

          this.noEstadisticas = false;
        } else {
          this.noEstadisticas = true;
        }

        // Forzar la actualización del paginador después de un pequeño retraso
        setTimeout(() => {
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            // Forzar la actualización del paginador
            this.paginator._changePageSize(this.pageSize);
          }
          this.isLoading = false; // Desactivar indicador de carga
        }, 0);
      },
      error: (error) => {
        console.error('Error al generar estadísticas:', error);
        this.noEstadisticas = true;
        this.isLoading = false; // Desactivar indicador de carga
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    console.log('Evento de paginación:', event);
    console.log(`Total de elementos según paginador: ${event.length}`);

    // Guardamos el pageIndex anterior para debug
    const oldPageIndex = this.pageIndex;

    // Actualizamos el índice de página
    this.pageIndex = event.pageIndex;
    this.pageSize = 10;

    console.log(`Navegando de página ${oldPageIndex} a página ${this.pageIndex}`);

    // Llamar a obtenerEstadisticas sin reiniciar la página
    this.obtenerEstadisticas(false);
  }

  combinarDatos(masAgregado: any, masGustado: any, menosGustado: any): Estadistica[] {
    const maxLength = Math.max(
      masAgregado.items?.length || 0,
      masGustado.items?.length || 0,
      menosGustado.items?.length || 0
    );

    const combinedData: Estadistica[] = [];
    const baseIndex = this.pageIndex * this.pageSize; // Calcular el índice base según la página

    for (let i = 0; i < maxLength; i++) {
      combinedData.push({
        orden: baseIndex + i + 1, // El orden comienza desde el índice base + 1
        masAgregado: masAgregado.items[i] ? masAgregado.items[i].nombre : '',
        masGustado: masGustado.items[i] ? masGustado.items[i].nombre : '',
        menosGustado: menosGustado.items[i] ? menosGustado.items[i].nombre : ''
      });
    }

    return combinedData;
  }
}