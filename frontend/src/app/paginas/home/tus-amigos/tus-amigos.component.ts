import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AmigosService } from '../../../servicios/amigos.service';
import { AgregarUsuario } from '../../../interfaces/AgregarUsuario';
import { Amigo } from '../../../interfaces/Amigo';
import { HomeComponent } from '../home.component'; // Importar HomeComponent
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MensajeDialogoComponent } from './mensaje-dialogo/mensaje-dialogo.component'; // Importar el componente de diálogo
import { RecargaService } from '../../../servicios/recarga.service'; // Importar RecargaService

@Component({
  selector: 'app-tus-amigos',
  standalone: true,
  imports: [
    CommonModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule 
  ],
  templateUrl: './tus-amigos.component.html',
  styleUrls: ['./tus-amigos.component.css']
})
export class TusAmigosComponent implements OnInit {

  private amigosService = inject(AmigosService);
  private homeComponent = inject(HomeComponent); // Inyectar HomeComponent
  private router = inject(Router);
  private dialog = inject(MatDialog); // Inyectar MatDialog
  private recargaService = inject(RecargaService); // Inyectar RecargaService
  amigos: { id: number, nombre: string }[] = [];
  amigosFiltrados: { id: number, nombre: string }[] = [];
  usuariosNoAgregados: { id: number, nombre: string }[] = [];
  nombreUsuario: string = '';
  buscando: boolean = false;
  noSeEncontraronAmigos = false;
  noSeEncontraronUsuarios = false;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.obtenerAmigos();

    this.searchSubject.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente al anterior
    ).subscribe(query => {
      if (this.buscando) {
        this.buscarAmigosLocal(query);
      } else {
        if (query.length >= 3) {
          const usuarioID = Number(localStorage.getItem('id')) || 0;
          this.buscarUsuariosNoAgregados(query, usuarioID);
        } else {
          this.usuariosNoAgregados = [];
          this.noSeEncontraronUsuarios = false;
        }
      }
    });

    // Suscribirse al evento de recarga de Data Burst
    this.recargaService.recargarDataBurst$.subscribe(() => {
      // No hacer nada para evitar la recarga del componente
    });
  }

  onNombreUsuarioChange() {
    this.searchSubject.next(this.nombreUsuario.trim());
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
    if (query.length > 0) {
      this.amigosFiltrados = this.amigos.filter(amigo => amigo.nombre.toLowerCase().includes(query.toLowerCase()));
      this.noSeEncontraronAmigos = this.amigosFiltrados.length === 0;
    } else {
      this.amigosFiltrados = this.amigos;
      this.noSeEncontraronAmigos = false;
    }
  }

  agregarUsuario(usuarioNombre: string) {
    const usuarioActualID = Number(localStorage.getItem('id')) || 0;

    let objeto: AgregarUsuario = {
      usuarioID: usuarioActualID,
      usuarioAgregar: usuarioNombre
    };

    this.amigosService.agregarUsuario(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.nombreUsuario = '';
          this.mostrarMensajeDialogo(data.mensaje + " (" + objeto.usuarioAgregar + ")");
          this.obtenerAmigos(); // Actualizar la lista de amigos
          this.usuariosNoAgregados = []; // Limpiar la lista de usuarios no agregados
          this.noSeEncontraronUsuarios = false; // Ocultar el mensaje de no se encontraron usuarios
          this.onNombreUsuarioChange(); // Reiniciar la búsqueda
        }
      },
      error: (error) => {
        this.nombreUsuario = '';
        this.mostrarMensajeDialogo(error.error.mensaje + " (" + objeto.usuarioAgregar + ")");
        this.onNombreUsuarioChange(); // Reiniciar la búsqueda
      }
    });
  }

  obtenerAmigos() {
    const usuarioID = Number(localStorage.getItem('id')) || 0;
    this.amigosService.obtenerAmigos(usuarioID).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.amigos = data.amigos;
          this.amigosFiltrados = this.amigos; // Inicializar amigosFiltrados con todos los amigos
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