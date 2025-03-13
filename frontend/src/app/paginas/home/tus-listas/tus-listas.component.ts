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
    MatOptionModule
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

  nombreLista: string = '';
  publica: boolean = false;
  noSeEncontraronListas = false;
  listaSeleccionadaId: number | null = null;

  // Nuevas propiedades para categorías
  categorias: Categoria[] = [];
  categoriasPrincipales: Categoria[] = [];
  categoriaSeleccionada: number | null = null;
  categoriasSeleccionadas: Categoria[] = [];

  ngOnInit(): void {
    this.obtenerListas();
    this.obtenerCategorias();
  }

  seleccionarCategoria() {
    if (this.categoriaSeleccionada) {
      // Clear any previous selections
      this.categoriasSeleccionadas = [];

      // Find the selected category
      const categoria = this.categorias.find(cat => cat.id === this.categoriaSeleccionada);

      if (categoria) {
        // Add directly to selected categories
        this.categoriasSeleccionadas = [categoria];
      }
    }
  }

  // Método para obtener categorías
  obtenerCategorias() {
    this.listasService.obtenerCategorias().subscribe({
      next: (data) => {
        if (data.exito) {
          this.categorias = data.categorias;
          // Only get the main categories (where categoria_padre_id is null)
          this.categoriasPrincipales = this.categorias.filter(cat => cat.categoria_padre_id === null);
        }
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
        this.homeComponent.mostrarMensajeNegativo('Error al cargar categorías. Por favor, intente de nuevo.');
      }
    });
  }

  // Método para obtener subcategorías de una categoría principal
  obtenerSubcategorias(categoriaId: number): Categoria[] {
    return this.categorias.filter(cat => cat.categoria_padre_id === categoriaId);
  }

  agregarCategoria() {
    if (this.categoriaSeleccionada && !this.yaEstaSeleccionada(this.categoriaSeleccionada)) {
      const categoria = this.categorias.find(cat => cat.id === this.categoriaSeleccionada);
      if (categoria) {
        this.categoriasSeleccionadas.push(categoria);

        // Opcional: Mantener la categoría seleccionada para facilitar la adición de más categorías
        // O limpiarlo si prefieres que el usuario seleccione nuevamente
        // this.categoriaSeleccionada = null; 
      }
    }
  }

  yaEstaSeleccionada(categoriaId: number): boolean {
    return this.categoriasSeleccionadas.some(cat => cat.id === categoriaId);
  }

  eliminarCategoria(categoriaId: number) {
    this.categoriasSeleccionadas = [];
    this.categoriaSeleccionada = null;
  }

  obtenerNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nombre : '';
  }

  tieneCategoriaSeleccionada(): boolean {
    return this.categoriasSeleccionadas.length > 0;
  }

  obtenerNombreCategoriaPadre(categoriaId: number): string {
    const categoria = this.categorias.find(cat => cat.id === categoriaId);
    if (categoria && categoria.categoria_padre_id) {
      const categoriaPadre = this.categorias.find(cat => cat.id === categoria.categoria_padre_id);
      return categoriaPadre ? categoriaPadre.nombre : '';
    }
    return '';
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
    if (!nombreLista || this.categoriasSeleccionadas.length === 0) {
      return;
    }

    let objeto: CrearAsignarLista = {
      usuarioID: this.getUsuarioID(),
      nombre: nombreLista,
      publica: this.publica,
      categorias: this.categoriasSeleccionadas.map(cat => cat.id) // Incluir categorías seleccionadas
    };

    this.listasService.crearAsignarLista(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.nombreLista = '';
          this.publica = false;
          this.categoriasSeleccionadas = []; // Limpiar categorías seleccionadas
          this.categoriaSeleccionada = null;
          this.obtenerListas();
          this.noSeEncontraronListas = false;
          this.seleccionarLista(data.lista);
        }
      },
      error: (error) => {
        this.nombreLista = '';
        this.publica = false;
        this.homeComponent.mostrarMensajeNegativo(error.error.mensaje + " (" + objeto.nombre + ")");
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

  togglePublica() {
    this.publica = !this.publica;
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

    // Lista existente en el array de listas
    const listaExistente = this.listas.find(
      lista => lista.nombre.toLowerCase() === this.nombreLista.trim().toLowerCase()
    );

    if (!nombreListaValido) {
      return "Ingrese un nombre para la lista";
    } else if (!tieneCategorias) {
      return "Seleccione al menos una categoría";
    } else if (listaExistente) {
      return "Asignar a lista existente";
    } else {
      return "Crear nueva lista";
    }
  }
}