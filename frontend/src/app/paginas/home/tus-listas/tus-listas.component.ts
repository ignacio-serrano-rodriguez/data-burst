import { Component, OnInit, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete'; // Importar MatAutocompleteModule y MatAutocompleteTrigger
import { FormsModule } from '@angular/forms'; // Importar FormsModule

import { ListasService } from '../../../servicios/listas.service';
import { CrearAsignarLista } from '../../../interfaces/CrearAsignarLista';
import { Lista } from '../../../interfaces/Lista';
import { HomeComponent } from '../home.component'; // Importar HomeComponent
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { RecargaService } from '../../../servicios/recarga.service'; // Importar RecargaService

@Component({
  selector: 'app-tus-listas',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule, // Agregar MatIconModule a los imports
    MatAutocompleteModule, // Agregar MatAutocompleteModule a los imports
    CommonModule,
    FormsModule // Agregar FormsModule a los imports
  ],
  templateUrl: './tus-listas.component.html',
  styleUrls: ['./tus-listas.component.css']
})
export class TusListasComponent implements OnInit {
  private listasService = inject(ListasService);
  private homeComponent = inject(HomeComponent); // Inyectar HomeComponent
  private recargaService = inject(RecargaService); // Inyectar RecargaService
  listas: Lista[] = [];
  listasFiltradas: Lista[] = [];
  @Output() listaSeleccionada = new EventEmitter<number>();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger; // Referencia al MatAutocompleteTrigger

  nombreLista: string = '';
  publica: boolean = true; // Variable para el toggle
  noSeEncontraronListas = false;
  listaSeleccionadaId: number | null = null; // Variable para la lista seleccionada

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.obtenerListas();

    this.searchSubject.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente al anterior
    ).subscribe(query => {
      this.buscarListasLocal(query);
    });

    // Suscribirse al evento de recarga de Data Burst
    this.recargaService.recargarDataBurst$.subscribe(() => {
      // No hacer nada para evitar la recarga del componente
    });
  }

  onNombreListaChange() {
    this.searchSubject.next(this.nombreLista.trim());
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
      usuarioID: Number(localStorage.getItem('id')) || 0,
      nombre: nombreLista,
      publica: this.publica // Añadir la propiedad publica
    };

    this.listasService.crearAsignarLista(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.nombreLista = '';
          this.publica = true; // Resetear el toggle a su valor por defecto
          this.obtenerListas(); // Actualizar la lista de listas
          this.noSeEncontraronListas = false; // Asegurarse de que el mensaje no aparezca después de crear una lista
          this.seleccionarLista(data.lista.id); // Cargar directamente la lista creada
        }
      },
      error: (error) => {
        this.nombreLista = '';
        this.publica = true; // Resetear el toggle a su valor por defecto
        this.homeComponent.mostrarMensajeNegativo(error.error.mensaje + " (" + objeto.nombre + ")");
      }
    });
  }

  obtenerListas() {
    const usuarioID = Number(localStorage.getItem('id')) || 0;
    this.listasService.obtenerListas(usuarioID).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.listas = data.listas.map(lista => ({
            ...lista,
            compartida: lista.compartida || false // Inicializar el campo compartida si no está presente
          }));
          this.listasFiltradas = this.listas; // Inicializar listasFiltradas con todas las listas
        }
      },
      error: (error) => {
        console.error('Error al obtener listas:', error);
      }
    });
  }

  seleccionarLista(id: number) {
    this.homeComponent.limpiarMensaje();
    this.listaSeleccionada.emit(id);
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
}