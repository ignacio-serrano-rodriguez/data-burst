import { Component, OnInit, ViewChild, Output, EventEmitter, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';

import { ListasService } from '../../../servicios/listas.service';
import { CrearAsignarLista } from '../../../interfaces/CrearAsignarLista';
import { Lista } from '../../../interfaces/Lista';
import { HomeComponent } from '../home.component';

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
    FormsModule
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

  ngOnInit(): void {
    this.obtenerListas();
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
    if (!nombreLista) {
      return;
    }

    let objeto: CrearAsignarLista = {
      usuarioID: this.getUsuarioID(),
      nombre: nombreLista,
      publica: this.publica
    };

    this.listasService.crearAsignarLista(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.nombreLista = '';
          this.publica = false;
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

    // Lista existente en el array de listas
    const listaExistente = this.listas.find(
      lista => lista.nombre.toLowerCase() === this.nombreLista.trim().toLowerCase()
    );

    if (!nombreListaValido) {
      return "Ingrese un nombre para la lista";
    } else if (listaExistente) {
      return "Asignar a lista existente";
    } else {
      return "Crear nueva lista";
    }
  }
}