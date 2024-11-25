import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

import { ListasService } from '../../../servicios/listas.service';
import { CrearAsignarLista } from '../../../interfaces/CrearAsignarLista';
import { Lista } from '../../../interfaces/Lista';

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
          document.getElementById("mensajeInformativo")!.innerText = data.mensaje + " (" + objeto.nombre + ")";
          this.obtenerListas(); // Actualizar la lista de listas
        }
      },
      error: (error) => {
        this.nombreLista = '';
        document.getElementById("mensajeInformativo")!.innerText = error.error.mensaje + " (" + objeto.nombre + ")";
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
    this.limpiarMensaje();
    this.listaSeleccionada.emit(id);
  }

  limpiarMensaje() {
    document.getElementById("mensajeInformativo")!.innerText = '';
  }

  esNombreListaValido(): boolean {
    return this.nombreLista.trim().length > 0;
  }
}