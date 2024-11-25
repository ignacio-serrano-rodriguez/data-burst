import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

import { ListasService } from '../../../servicios/listas.service';
import { CrearAsignarLista } from '../../../interfaces/CrearAsignarLista';
import { Lista } from '../../../interfaces/Lista';
import { HomeComponent } from '../home.component'; // Importar HomeComponent

@Component({
  selector: 'app-tus-listas',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
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

  ngOnInit(): void {
    this.obtenerListas();
  }

  crearAsignarLista() {
    const nombreLista = this.nombreLista.trim();
    if (!nombreLista) {
      return;
    }

    let objeto: CrearAsignarLista = {
      usuarioID: Number(localStorage.getItem('id')) || 0,
      nombre: nombreLista
    };

    this.listasService.crearAsignarLista(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.nombreLista = '';
          this.homeComponent.mostrarMensajePositivo(data.mensaje + " (" + objeto.nombre + ")");
          this.obtenerListas(); // Actualizar la lista de listas
        }
      },
      error: (error) => {
        this.nombreLista = '';
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
}