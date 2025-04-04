import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { EstadisticasService } from '../../servicios/estadisticas.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface Estadistica {
  orden: number;
  masAgregado: string;
  masGustado: string;
  menosGustado: string;
}

interface EstadisticaItem {
  nombre: string | null;
  total: number;
}

interface EstadisticaResponse {
  masAgregado: {
    items: EstadisticaItem[];
    total: number;
  };
  masGustado: {
    items: EstadisticaItem[];
    total: number;
  };
  menosGustado: {
    items: EstadisticaItem[];
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
    MatAutocompleteModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  isMobile = false;

  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  categoriaBusqueda: string = '';
  categoriaSeleccionada: number | null = null;
  categoriaSeleccionadaObj: Categoria | null = null;

  displayedColumns: string[] = ['orden', 'masAgregado', 'masGustado', 'menosGustado'];
  dataSource = new MatTableDataSource<Estadistica>([]);
  noEstadisticas: boolean = true;
  isLoading: boolean = false;

  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  isFirstSearch: boolean = true;
  busquedaRealizada: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('categoriaInput') categoriaInput!: ElementRef;
  @ViewChild('autoCategoria') autocompleteCategorias!: MatAutocompleteTrigger;

  constructor(
    private estadisticasService: EstadisticasService,
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
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.isLoading = true;
    this.estadisticasService.obtenerCategorias().subscribe({
      next: (response) => {
        if (response.exito && response.categorias) {
          this.categorias = response.categorias;
          this.categoriasFiltradas = this.categorias;
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

  filtrarCategorias(): void {
    if (this.categoriaBusqueda) {
      this.categoriasFiltradas = this.categorias.filter(
        cat => cat.nombre.toLowerCase().includes(this.categoriaBusqueda.toLowerCase())
      );
    } else {
      this.categoriasFiltradas = this.categorias;
    }
  }

  limpiarCategoriaInput(): void {
    this.categoriaBusqueda = '';
    this.categoriasFiltradas = this.categorias;
    this.categoriaSeleccionada = null;
    this.categoriaSeleccionadaObj = null;
    this.noEstadisticas = true;
    this.busquedaRealizada = false;

    if (this.categoriaInput) {
      this.categoriaInput.nativeElement.blur();
    }
  }

  abrirDesplegableCategoria(): void {
    if (this.autocompleteCategorias) {
      this.autocompleteCategorias.openPanel();
    }
  }

  onCategoriaSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedName = event.option.value;
    const categoria = this.categorias.find(cat => cat.nombre === selectedName);

    if (categoria) {
      this.categoriaSeleccionada = categoria.id;
      this.categoriaSeleccionadaObj = categoria;
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

    this.estadisticasService.generarEstadisticas(
      this.categoriaSeleccionada,
      this.pageIndex + 1,
      this.pageSize
    ).subscribe({
      next: (response: EstadisticaResponse) => {
        console.log('Respuesta del servidor:', response);

        const hasRealData = this.hasActualData(response);

        if (hasRealData) {
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
          this.dataSource.data = [];
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

  private hasActualData(response: EstadisticaResponse): boolean {
    const hasAgregadoData = response.masAgregado?.items?.some((item: EstadisticaItem) =>
      item.nombre !== null && item.total > 0
    ) || false;

    const hasGustadoData = response.masGustado?.items?.some((item: EstadisticaItem) =>
      item.nombre !== null && item.total > 0
    ) || false;

    const hasMenosGustadoData = response.menosGustado?.items?.some((item: EstadisticaItem) =>
      item.nombre !== null && item.total > 0
    ) || false;

    const hasTotals = (response.masAgregado?.total > 0) ||
      (response.masGustado?.total > 0) ||
      (response.menosGustado?.total > 0);

    return hasAgregadoData || hasGustadoData || hasMenosGustadoData || hasTotals;
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = 10;
    this.obtenerEstadisticas(false);
  }

  combinarDatos(
    masAgregado: { items: EstadisticaItem[], total: number },
    masGustado: { items: EstadisticaItem[], total: number },
    menosGustado: { items: EstadisticaItem[], total: number }
  ): Estadistica[] {
    const filteredMasAgregado = (masAgregado?.items || [])
      .filter((item: EstadisticaItem) => item.nombre !== null && item.total > 0);

    const filteredMasGustado = (masGustado?.items || [])
      .filter((item: EstadisticaItem) => item.nombre !== null && item.total > 0);

    const filteredMenosGustado = (menosGustado?.items || [])
      .filter((item: EstadisticaItem) => item.nombre !== null && item.total > 0);

    const maxLength = Math.max(
      filteredMasAgregado.length,
      filteredMasGustado.length,
      filteredMenosGustado.length
    );

    if (maxLength === 0) {
      return [];
    }

    const combinedData: Estadistica[] = [];
    const baseIndex = this.pageIndex * this.pageSize;

    for (let i = 0; i < maxLength; i++) {
      combinedData.push({
        orden: baseIndex + i + 1,
        masAgregado: filteredMasAgregado[i] ? filteredMasAgregado[i].nombre || '' : '',
        masGustado: filteredMasGustado[i] ? filteredMasGustado[i].nombre || '' : '',
        menosGustado: filteredMenosGustado[i] ? filteredMenosGustado[i].nombre || '' : ''
      });
    }

    return combinedData;
  }
}