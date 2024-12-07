import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { Router } from '@angular/router';

import { AmigosService } from '../../../servicios/amigos.service';
import { AgregarUsuario } from '../../../interfaces/AgregarUsuario';
import { Amigo } from '../../../interfaces/Amigo';
import { HomeComponent } from '../home.component'; // Importar HomeComponent
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MensajeDialogoComponent } from './mensaje-dialogo/mensaje-dialogo.component'; // Importar el componente de diálogo

@Component({
  selector: 'app-tus-amigos',
  standalone: true,
  imports: [
    CommonModule, // Asegúrate de que CommonModule esté importado
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule // Agregar MatDialogModule a los imports
  ],
  templateUrl: './tus-amigos.component.html',
  styleUrls: ['./tus-amigos.component.css']
})
export class TusAmigosComponent implements OnInit {

  private amigosService = inject(AmigosService);
  private homeComponent = inject(HomeComponent); // Inyectar HomeComponent
  private router = inject(Router);
  private dialog = inject(MatDialog); // Inyectar MatDialog
  amigos: { id: number, nombre: string }[] = [];
  usuariosNoAgregados: { id: number, nombre: string }[] = [];
  nombreUsuarioAgregar: string = '';
  nombreAmigoBuscar: string = '';
  noSeEncontraronAmigos = false;
  noSeEncontraronUsuarios = false;

  private searchSubjectAgregar = new Subject<string>();
  private searchSubjectBuscar = new Subject<string>();

  ngOnInit(): void {
    this.obtenerAmigos();

    this.searchSubjectAgregar.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente al anterior
    ).subscribe(query => {
      if (query.length >= 3) {
        const usuarioID = Number(localStorage.getItem('id')) || 0;
        this.buscarUsuariosNoAgregados(query, usuarioID);
      } else {
        this.usuariosNoAgregados = [];
        this.noSeEncontraronUsuarios = false;
      }
    });

    this.searchSubjectBuscar.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente al anterior
    ).subscribe(query => {
      if (query.length > 0) {
        this.buscarAmigosLocal(query);
      } else {
        this.obtenerAmigos(); // Mostrar todos los amigos si la cadena de búsqueda está vacía
        this.noSeEncontraronAmigos = false; // No mostrar el mensaje si la cadena está vacía
      }
    });
  }

  onNombreUsuarioAgregarChange() {
    this.searchSubjectAgregar.next(this.nombreUsuarioAgregar.trim());
  }

  onNombreAmigoBuscarChange() {
    this.searchSubjectBuscar.next(this.nombreAmigoBuscar.trim());
  }

  buscarUsuariosNoAgregados(query: string, usuarioID: number) {
    this.amigosService.buscarUsuariosNoAgregados(query, usuarioID).subscribe({
      next: (data) => {
        if (data.exito) {
          this.usuariosNoAgregados = data.usuarios;
          this.noSeEncontraronUsuarios = this.usuariosNoAgregados.length === 0;
        }
      },
      error: (error) => {
        console.error('Error al buscar usuarios no agregados:', error);
        this.usuariosNoAgregados = [];
        this.noSeEncontraronUsuarios = true;
      }
    });
  }

  buscarAmigosLocal(query: string) {
    const amigosFiltrados = this.amigos.filter(amigo => amigo.nombre.toLowerCase().includes(query.toLowerCase()));
    this.noSeEncontraronAmigos = amigosFiltrados.length === 0;
    this.amigos = amigosFiltrados;
  }

  agregarUsuario(nombreUsuario: string) {
    const nombreUsuarioAgregar = nombreUsuario.trim();
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
          this.mostrarMensajeDialogo(data.mensaje + " (" + objeto.usuarioAgregar + ")");
          this.obtenerAmigos(); // Actualizar la lista de amigos
          this.usuariosNoAgregados = []; // Limpiar la lista de usuarios no agregados
          this.noSeEncontraronUsuarios = false; // Ocultar el mensaje de no se encontraron usuarios
        }
      },
      error: (error) => {
        this.nombreUsuarioAgregar = '';
        this.mostrarMensajeDialogo(error.error.mensaje + " (" + objeto.usuarioAgregar + ")");
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

  verDetalleAmigo(nombre: string) {
    this.router.navigate([`/${nombre}`], { state: { amigo: { nombre } } });
  }

  limpiarMensaje() {
    this.homeComponent.limpiarMensaje();
  }

  mostrarMensajeDialogo(mensaje: string) {
    this.dialog.open(MensajeDialogoComponent, {
      data: { mensaje }
    });
  }
}