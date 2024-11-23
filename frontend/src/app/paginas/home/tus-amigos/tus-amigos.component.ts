import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AmigosService } from '../../../servicios/amigos.service';
import { AgregarUsuario } from '../../../interfaces/AgregarUsuario';
import { Amigo } from '../../../interfaces/Amigo';

@Component({
  selector: 'app-tus-amigos',
  standalone: true,
  imports: [
    CommonModule, // Asegúrate de que CommonModule esté importado
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './tus-amigos.component.html',
  styleUrl: './tus-amigos.component.css'
})
export class TusAmigosComponent implements OnInit {

  private amigosService = inject(AmigosService);
  amigos: Amigo[] = [];

  ngOnInit(): void {
    this.obtenerAmigos();
  }

  agregarUsuario() {
    let objeto: AgregarUsuario = {
      usuarioID: Number(localStorage.getItem('id')) || 0,
      usuarioAgregar: (document.getElementById('nombreUsuarioAgregar') as HTMLInputElement).value
    };

    this.amigosService.agregarUsuario(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          (document.getElementById("nombreUsuarioAgregar") as HTMLInputElement).value = '';
          document.getElementById("mensajeInformativo")!.innerText = data.mensaje + " (" + objeto.usuarioAgregar + ")";
          this.obtenerAmigos(); // Actualizar la lista de amigos
        }
      },
      error: (error) => {
        (document.getElementById("nombreUsuarioAgregar") as HTMLInputElement).value = '';
        document.getElementById("mensajeInformativo")!.innerText = error.error.mensaje + " (" + objeto.usuarioAgregar + ")";
      }
    });
  }

  obtenerAmigos() {
    const usuarioID = Number(localStorage.getItem('id')) || 0;
    this.amigosService.obtenerAmigos(usuarioID).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.amigos = data.amigos;
        }
      },
      error: (error) => {
        console.error('Error al obtener amigos:', error);
      }
    });
  }
}