import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

import { AmigosService } from '../../../servicios/amigos.service';
import { AgregarUsuario } from '../../../interfaces/AgregarUsuario';
import { Amigo } from '../../../interfaces/Amigo';
import { HomeComponent } from '../home.component'; // Importar HomeComponent

@Component({
  selector: 'app-tus-amigos',
  standalone: true,
  imports: [
    CommonModule, // Asegúrate de que CommonModule esté importado
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule // Agregar FormsModule a los imports
  ],
  templateUrl: './tus-amigos.component.html',
  styleUrl: './tus-amigos.component.css'
})
export class TusAmigosComponent implements OnInit {

  private amigosService = inject(AmigosService);
  private homeComponent = inject(HomeComponent); // Inyectar HomeComponent
  amigos: Amigo[] = [];
  nombreUsuarioAgregar: string = '';

  ngOnInit(): void {
    this.obtenerAmigos();
  }

  agregarUsuario() {
    const nombreUsuarioAgregar = this.nombreUsuarioAgregar.trim();
    if (!nombreUsuarioAgregar) {
      return;
    }

    let objeto: AgregarUsuario = {
      usuarioID: Number(localStorage.getItem('id')) || 0,
      usuarioAgregar: nombreUsuarioAgregar
    };

    this.amigosService.agregarUsuario(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.nombreUsuarioAgregar = '';
          this.homeComponent.mostrarMensajePositivo(data.mensaje + " (" + objeto.usuarioAgregar + ")");
          this.obtenerAmigos(); // Actualizar la lista de amigos
        }
      },
      error: (error) => {
        this.nombreUsuarioAgregar = '';
        this.homeComponent.mostrarMensajeNegativo(error.error.mensaje + " (" + objeto.usuarioAgregar + ")");
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

  limpiarMensaje() {
    this.homeComponent.limpiarMensaje();
  }

  esNombreUsuarioValido(): boolean {
    return this.nombreUsuarioAgregar.trim().length > 0;
  }
}