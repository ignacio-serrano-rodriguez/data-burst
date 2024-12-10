import { Component, OnInit, ViewChild, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete'; // Importar MatAutocompleteModule y MatAutocompleteTrigger

import { AmigosService } from '../../../servicios/amigos.service';
import { AgregarUsuario } from '../../../interfaces/AgregarUsuario';
import { Amigo } from '../../../interfaces/Amigo';
import { HomeComponent } from '../home.component'; // Importar HomeComponent
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
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
    MatIconModule,
    MatAutocompleteModule // Agregar MatAutocompleteModule a los imports
  ],
  templateUrl: './tus-amigos.component.html',
  styleUrls: ['./tus-amigos.component.css']
})
export class TusAmigosComponent implements OnInit {

  private amigosService = inject(AmigosService);
  private homeComponent = inject(HomeComponent); // Inyectar HomeComponent
  private router = inject(Router);
  private recargaService = inject(RecargaService); // Inyectar RecargaService
  @ViewChild('nombreUsuarioInput') nombreUsuarioInput!: ElementRef; // Referencia al input
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger; // Referencia al MatAutocompleteTrigger
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
      if (query.length === 0) {
        this.amigosFiltrados = this.amigos;
        this.noSeEncontraronAmigos = false;
        this.usuariosNoAgregados = [];
        this.noSeEncontraronUsuarios = false;
      } else if (query.length >= 3) {
        const usuarioID = Number(localStorage.getItem('id')) || 0;
        this.buscarUsuariosNoAgregados(query, usuarioID);
      } else {
        this.usuariosNoAgregados = [];
        this.noSeEncontraronUsuarios = false;
        this.buscarAmigosLocal(query);
      }
    });

    // Suscribirse al evento de recarga de Data Burst
    this.recargaService.recargarDataBurst$.subscribe(() => {
      // No hacer nada para evitar la recarga del componente
    });
  }

  onNombreUsuarioChange() {
    this.searchSubject.next(this.nombreUsuario.trim());
    this.autocompleteTrigger.openPanel(); // Abrir el desplegable
  }

  abrirDesplegable() {
    this.autocompleteTrigger.openPanel();
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

  seleccionarUsuario(usuarioNombre: string) {
    this.nombreUsuario = ''; // Limpiar el contenido del input
    this.autocompleteTrigger.closePanel(); // Cerrar el panel de autocompletado
    this.agregarUsuario(usuarioNombre); // Ejecutar la acción asignada
  }

  seleccionarAmigo(amigoNombre: string) {
    this.nombreUsuario = ''; // Limpiar el contenido del input
    this.autocompleteTrigger.closePanel(); // Cerrar el panel de autocompletado
    this.verDetalleAmigo(amigoNombre); // Ejecutar la acción asignada
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
          this.mostrarMensajeInformativo(data.mensaje + " (" + objeto.usuarioAgregar + ")");
          this.obtenerAmigos(); // Actualizar la lista de amigos
          this.usuariosNoAgregados = []; // Limpiar la lista de usuarios no agregados
          this.noSeEncontraronUsuarios = false; // Ocultar el mensaje de no se encontraron usuarios
          this.onNombreUsuarioChange(); // Reiniciar la búsqueda
        }
      },
      error: (error) => {
        this.mostrarMensajeInformativo(error.error.mensaje + " (" + objeto.usuarioAgregar + ")");
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

  mostrarMensajeInformativo(mensaje: string) {
    const mensajeInformativo = document.getElementById('mensajeInformativo');
    if (mensajeInformativo) {
      mensajeInformativo.textContent = mensaje;
      mensajeInformativo.style.color = '#61B300'; // Aplicar el color
      setTimeout(() => {
        mensajeInformativo.textContent = '';
      }, 5000); // Limpiar el mensaje después de 5 segundos
    }
  }

  salirDelInput() {
    if (this.nombreUsuario.trim() === '') {
      this.nombreUsuarioInput.nativeElement.blur(); // Salir del input si está vacío
    } else {
      this.nombreUsuario = ''; // Limpiar el contenido del input
      this.amigosFiltrados = this.amigos; // Mostrar de nuevo todos los amigos listados
      this.usuariosNoAgregados = []; // Limpiar la lista de usuarios no agregados
      this.noSeEncontraronAmigos = false; // Asegurarse de que el mensaje no aparezca
      this.noSeEncontraronUsuarios = false; // Asegurarse de que el mensaje no aparezca
      setTimeout(() => {
        this.autocompleteTrigger.openPanel(); // Abrir el desplegable para mostrar los amigos agregados
      }, 0);
    }
  }
}