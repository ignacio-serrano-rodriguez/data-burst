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
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
  nombreAmigoBuscar: string = '';
  noSeEncontraronAmigos = false;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.obtenerAmigos();

    this.searchSubject.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente al anterior
    ).subscribe(query => {
      if (query.length > 0) {
        const usuarioID = Number(localStorage.getItem('id')) || 0;
        this.buscarAmigos(query, usuarioID);
      } else {
        this.obtenerAmigos(); // Mostrar todos los amigos si la cadena de búsqueda está vacía
        this.noSeEncontraronAmigos = false; // No mostrar el mensaje si la cadena está vacía
      }
    });
  }

  onNombreAmigoBuscarChange() {
    this.searchSubject.next(this.nombreAmigoBuscar.trim());
  }

  buscarAmigos(query: string, usuarioID: number) {
    this.amigosService.buscarAmigos(query, usuarioID).subscribe({
      next: (data) => {
        if (data.exito) {
          this.amigos = data.amigos.filter(amigo => amigo.nombre.toLowerCase().includes(query.toLowerCase()));
          this.noSeEncontraronAmigos = this.amigos.length === 0 && query.length > 0; // Mostrar el mensaje si no se encontraron amigos y la cadena de búsqueda tiene al menos 1 carácter
        }
      },
      error: (error) => {
        console.error('Error al buscar amigos:', error);
        this.noSeEncontraronAmigos = true; // Mostrar el mensaje en caso de error
        this.amigos = []; // Borrar los amigos mostrados en caso de error
      }
    });
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