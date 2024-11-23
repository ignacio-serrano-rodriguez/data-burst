import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
    CommonModule
  ],
  templateUrl: './tus-listas.component.html',
  styleUrl: './tus-listas.component.css'
})
export class TusListasComponent implements OnInit {

  private listasService = inject(ListasService);
  listas: Lista[] = [];
  @Output() listaSeleccionada = new EventEmitter<number>();

  ngOnInit(): void {
    this.obtenerListas();
  }

  crearAsignarLista() {
    let objeto: CrearAsignarLista = {
      usuarioID: Number(localStorage.getItem('id')) || 0,
      nombre: (document.getElementById('nombreLista') as HTMLInputElement).value
    };

    this.listasService.crearAsignarLista(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          (document.getElementById("nombreLista") as HTMLInputElement).value = '';
          document.getElementById("mensajeInformativo")!.innerText = data.mensaje + " (" + objeto.nombre + ")";
          this.obtenerListas(); // Actualizar la lista de listas
        }
      },
      error: (error) => {
        (document.getElementById("nombreLista") as HTMLInputElement).value = '';
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
    this.listaSeleccionada.emit(id);
  }
}