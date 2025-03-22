import { Component, OnInit, ViewChild, Output, EventEmitter, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ViewChildren, QueryList } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { ListasService } from '../../../servicios/listas.service';
import { CrearAsignarLista } from '../../../interfaces/CrearAsignarLista';
import { Lista } from '../../../interfaces/Lista';
import { HomeComponent } from '../home.component';

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria_padre_id: number | null;
}

@Component({
  selector: 'app-tus-listas',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatChipsModule,
    MatOptionModule,
    MatSlideToggleModule
  ],
  templateUrl: './tus-listas.component.html',
  styleUrls: ['./tus-listas.component.css']
})
export class TusListasComponent implements OnInit {

  private listasService = inject(ListasService);
  private homeComponent = inject(HomeComponent);

  listas: Lista[] = [];
  listasFiltradas: Lista[] = [];

  @Output() listaSeleccionada = new EventEmitter<Lista>();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  @ViewChild('nombreListaInput') nombreListaInput!: ElementRef;
  @ViewChild('categoriaInput') categoriaInput!: ElementRef;
  @ViewChild('autoCategoria') autocompleteCategorias!: MatAutocompleteTrigger;
  @ViewChildren(MatOption) options!: QueryList<MatOption>;

  nombreLista: string = '';
  publica: boolean = false;
  noSeEncontraronListas = false;
  listaSeleccionadaId: number | null = null;
  categoriaBusqueda: string = '';
  categoriasFiltradas: Categoria[] = [];
  categorias: Categoria[] = [];
  categoriasPrincipales: Categoria[] = [];
  categoriaSeleccionada: number | null = null;
  categoriaSeleccionadaObj: Categoria | null = null;

  ngOnInit(): void {
    this.obtenerListas();
    this.obtenerCategorias();
  }

  seleccionarCategoria() {
    if (this.categoriaSeleccionada) {
      const categoria = this.categorias.find(cat => cat.id === this.categoriaSeleccionada);
      if (categoria) {
        this.categoriaSeleccionadaObj = categoria;
        this.categoriaBusqueda = categoria.nombre;
      }
    }
  }

  obtenerCategorias() {
    this.listasService.obtenerCategorias().subscribe({
      next: (data) => {
        if (data.exito) {
          this.categorias = data.categorias;
          this.categoriasPrincipales = this.categorias;
          this.categoriasFiltradas = this.categorias;
        }
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
        this.homeComponent.mostrarMensajeNegativo('Error al cargar categorías. Por favor, intente de nuevo.');
      }
    });
  }

  filtrarCategorias(busqueda: string) {
    if (busqueda) {
      this.categoriasFiltradas = this.categorias.filter(
        cat => cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    } else {
      this.categoriasFiltradas = this.categorias;
    }
  }

  limpiarCategoriaInput() {
    this.categoriaBusqueda = '';
    this.categoriasFiltradas = this.categorias;
    this.categoriaSeleccionada = null;
    this.categoriaSeleccionadaObj = null;

    if (this.categoriaInput) {
      this.categoriaInput.nativeElement.blur();
    }
  }

  abrirDesplegableCategoria() {
    if (this.autocompleteCategorias) {
      this.autocompleteCategorias.openPanel();
    }
  }

  onCategoriaSelected(event: MatAutocompleteSelectedEvent) {
    const selectedName = event.option.value;
    const categoria = this.categorias.find(cat => cat.nombre === selectedName);

    if (categoria) {
      this.categoriaSeleccionada = categoria.id;
      this.categoriaSeleccionadaObj = categoria;
    }
  }

  tieneCategoriaSeleccionada(): boolean {
    return this.categoriaSeleccionada !== null;
  }

  obtenerNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nombre : '';
  }

  abrirDesplegable() {
    this.autocompleteTrigger.openPanel();
  }

  buscarListasLocal(query: string) {
    if (query.length > 0) {
      this.listasFiltradas = this.listas.filter(lista => lista.nombre.toLowerCase().includes(query.toLowerCase()));
      this.noSeEncontraronListas = this.listasFiltradas.length === 0;
    } else {
      this.listasFiltradas = this.listas;
      this.noSeEncontraronListas = false;
    }
  }

  crearAsignarLista() {
    const nombreLista = this.nombreLista.trim();
    if (!nombreLista || !this.categoriaSeleccionada) {
      return;
    }

    let objeto: CrearAsignarLista = {
      usuarioID: this.getUsuarioID(),
      nombre: nombreLista,
      publica: this.publica,
      categoria_id: this.categoriaSeleccionada
    };

    this.listasService.crearAsignarLista(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.nombreLista = '';
          this.publica = false;

          if (data.lista) {
            if (!data.lista.categoria && this.categoriaSeleccionadaObj) {
              data.lista.categoria = {
                id: this.categoriaSeleccionadaObj.id,
                nombre: this.categoriaSeleccionadaObj.nombre
              };
            }

            this.categoriaSeleccionada = null;
            this.categoriaSeleccionadaObj = null;
            this.categoriaBusqueda = '';
            this.obtenerListas();
            this.noSeEncontraronListas = false;
            this.seleccionarLista(data.lista);
          }
        }
      },
      error: (error) => {
        console.error('Error al crear/asignar lista:', error);
      }
    });
  }

  obtenerListas() {
    const usuarioID = this.getUsuarioID();
    this.listasService.obtenerListas(usuarioID).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.listas = data.listas.map(lista => ({
            ...lista,
            compartida: lista.compartida || false
          }));
          this.listasFiltradas = this.listas;
        }
      },
      error: (error) => {
        console.error('Error al obtener listas:', error);
      }
    });
  }

  seleccionarLista(lista: Lista) {
    this.homeComponent.limpiarMensaje();
    this.listaSeleccionada.emit(lista);
  }

  esNombreListaValido(): boolean {
    return this.nombreLista.trim().length > 0;
  }

  limpiarMensaje() {
    this.homeComponent.limpiarMensaje();
  }

  togglePublica(event: any) {
    this.publica = event.checked;
  }

  salirDelInput() {
    if (this.nombreLista.trim() === '') {
      this.nombreListaInput.nativeElement.blur();
    } else {
      this.nombreLista = '';
      this.listasFiltradas = this.listas;
      this.noSeEncontraronListas = false;
      setTimeout(() => {
        this.autocompleteTrigger.openPanel();
      }, 0);
    }
  }

  private getUsuarioID(): number {
    if (typeof localStorage !== 'undefined') {
      return Number(localStorage.getItem('id')) || 0;
    }
    return 0;
  }

  obtenerTituloBotonAnadir(): string {
    const nombreListaValido = this.esNombreListaValido();
    const tieneCategorias = this.tieneCategoriaSeleccionada();

    const listaExistente = this.listas.find(
      lista => lista.nombre.toLowerCase() === this.nombreLista.trim().toLowerCase()
    );

    if (!nombreListaValido) {
      return "Ingrese un nombre para la lista";
    } else if (!tieneCategorias) {
      return "Seleccione una categoría";
    } else if (listaExistente) {
      return "Asignar a lista existente";
    } else {
      return "Crear nueva lista";
    }
  }
}