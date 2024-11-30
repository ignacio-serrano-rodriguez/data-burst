import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Importar MatCheckboxModule
import { FormsModule } from '@angular/forms'; // Importar FormsModule

import { ListasService } from '../../../servicios/listas.service';
import { CrearAsignarLista } from '../../../interfaces/CrearAsignarLista';
import { Lista } from '../../../interfaces/Lista';
import { HomeComponent } from '../home.component'; // Importar HomeComponent
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-tus-listas',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule, // Agregar MatCheckboxModule a los imports
    CommonModule,
    FormsModule // Agregar FormsModule a los imports
  ],
  templateUrl: './tus-listas.component.html',
  styleUrl: './tus-listas.component.css'
})
export class TusListasComponent implements OnInit {
  private listasService = inject(ListasService);
  private homeComponent = inject(HomeComponent); // Inyectar HomeComponent
  listas: Lista[] = [];
  @Output() listaSeleccionada = new EventEmitter<number>();

  nombreLista: string = '';
  nombreListaBuscar: string = '';
  publica: boolean = true; // Variable para el checkbox
  noSeEncontraronListas = false;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.obtenerListas();

    this.searchSubject.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente al anterior
    ).subscribe(query => {
      if (query.length > 0) {
        const usuarioID = Number(localStorage.getItem('id')) || 0;
        this.buscarListas(query, usuarioID);
      } else {
        this.obtenerListas(); // Mostrar todas las listas si la cadena de búsqueda está vacía
        this.noSeEncontraronListas = false; // No mostrar el mensaje si la cadena está vacía
      }
    });
  }

  onNombreListaBuscarChange() {
    this.searchSubject.next(this.nombreListaBuscar.trim());
  }

  buscarListas(query: string, usuarioID: number) {
    this.listasService.buscarListas(query, usuarioID).subscribe({
      next: (data) => {
        if (data.exito) {
          this.listas = data.listas.filter(lista => lista.nombre.toLowerCase().includes(query.toLowerCase()));
          this.noSeEncontraronListas = this.listas.length === 0 && query.length > 0; // Mostrar el mensaje si no se encontraron listas y la cadena de búsqueda tiene al menos 1 carácter
        }
      },
      error: (error) => {
        console.error('Error al buscar listas:', error);
        this.noSeEncontraronListas = true; // Mostrar el mensaje en caso de error
        this.listas = []; // Borrar las listas mostradas en caso de error
      }
    });
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
          this.publica = true; // Resetear el checkbox a su valor por defecto
          this.homeComponent.mostrarMensajePositivo(data.mensaje + " (" + objeto.nombre + ")");
          this.obtenerListas(); // Actualizar la lista de listas
        }
      },
      error: (error) => {
        this.nombreLista = '';
        this.publica = true; // Resetear el checkbox a su valor por defecto
        this.homeComponent.mostrarMensajeNegativo(error.error.mensaje + " (" + objeto.nombre + ")");
      }
    });
  }

  obtenerListas() {
    const usuarioID = Number(localStorage.getItem('id')) || 0;
    this.listasService.obtenerListas(usuarioID).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.listas = data.listas;
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
}