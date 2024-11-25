import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule
  ],
  templateUrl: './tus-listas.component.html',
  styleUrl: './tus-listas.component.css'
})
export class TusListasComponent implements OnInit {

  private listasService = inject(ListasService);
  listas: Lista[] = [];
  @Output() listaSeleccionada = new EventEmitter<number>();

  formCrearLista: FormGroup;

  constructor() {
    const formBuilder = inject(FormBuilder);
    this.formCrearLista = formBuilder.group({
      nombreLista: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerListas();
  }

  crearAsignarLista() {
    if (this.formCrearLista.invalid) {
      return;
    }

    let objeto: CrearAsignarLista = {
      usuarioID: Number(localStorage.getItem('id')) || 0,
      nombre: this.formCrearLista.value.nombreLista
    };

    this.listasService.crearAsignarLista(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.formCrearLista.reset();
          document.getElementById("mensajeInformativo")!.innerText = data.mensaje + " (" + objeto.nombre + ")";
          this.obtenerListas(); // Actualizar la lista de listas
        }
      },
      error: (error) => {
        this.formCrearLista.reset();
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