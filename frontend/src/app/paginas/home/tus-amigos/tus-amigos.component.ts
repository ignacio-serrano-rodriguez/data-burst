import { Component, OnInit, ViewChild, inject, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { AmigosService } from '../../../servicios/amigos.service';
import { AgregarUsuario } from '../../../interfaces/AgregarUsuario';
import { Amigo } from '../../../interfaces/Amigo';
import { HomeComponent } from '../home.component';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { RecargaService } from '../../../servicios/recarga.service';

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
    MatAutocompleteModule
  ],
  templateUrl: './tus-amigos.component.html',
  styleUrls: ['./tus-amigos.component.css']
})
export class TusAmigosComponent implements OnInit, OnDestroy {

  private amigosService = inject(AmigosService);
  private homeComponent = inject(HomeComponent);
  private router = inject(Router);
  private recargaService = inject(RecargaService);
  @ViewChild('nombreUsuarioInput') nombreUsuarioInput!: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  amigos: { id: number, nombre: string }[] = [];
  amigosFiltrados: { id: number, nombre: string }[] = [];
  usuariosNoAgregados: { id: number, nombre: string }[] = [];
  nombreUsuario: string = '';
  buscando: boolean = false;
  noSeEncontraronAmigos = false;
  noSeEncontraronUsuarios = false;

  private searchSubject = new Subject<string>();
  private reloadSubscription?: Subscription;

  ngOnInit(): void {
    this.obtenerAmigos();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      const usuarioID = this.getUsuarioID();
      if (query.length >= 3) {
        this.buscarUsuariosNoAgregados(query, usuarioID);
      } else {
        this.usuariosNoAgregados = [];
        this.noSeEncontraronUsuarios = false;
      }
      this.buscarAmigosLocal(query);
    });

    this.reloadSubscription = this.recargaService.recargarDataBurst$.subscribe(() => {
      this.obtenerAmigos();
    });
  }

  ngOnDestroy(): void {
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  onNombreUsuarioChange() {
    this.searchSubject.next(this.nombreUsuario.trim());
    this.autocompleteTrigger.openPanel();
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
    this.nombreUsuario = '';
    this.autocompleteTrigger.closePanel();
    this.agregarUsuario(usuarioNombre);
  }

  seleccionarAmigo(amigoNombre: string) {
    this.nombreUsuario = '';
    this.autocompleteTrigger.closePanel();
    this.verDetalleAmigo(amigoNombre);
  }

  agregarUsuario(usuarioNombre: string) {
    const usuarioActualID = this.getUsuarioID();

    let objeto: AgregarUsuario = {
      usuarioID: usuarioActualID,
      usuarioAgregar: usuarioNombre
    };

    this.amigosService.agregarUsuario(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.mostrarMensajeInformativo(data.mensaje + " (" + objeto.usuarioAgregar + ")");
          this.obtenerAmigos();
          this.usuariosNoAgregados = [];
          this.noSeEncontraronUsuarios = false;
          this.onNombreUsuarioChange();
        }
      },
      error: (error) => {
        this.mostrarMensajeInformativo(error.error.mensaje + " (" + objeto.usuarioAgregar + ")");
        this.onNombreUsuarioChange();
      }
    });
  }

  obtenerAmigos() {
    const usuarioID = this.getUsuarioID();
    this.amigosService.obtenerAmigos(usuarioID).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.amigos = data.amigos;
          this.amigosFiltrados = this.amigos;
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
      mensajeInformativo.style.color = '#61B300';
      setTimeout(() => {
        mensajeInformativo.textContent = '';
      }, 5000);
    }
  }

  salirDelInput() {
    if (this.nombreUsuario.trim() === '') {
      this.nombreUsuarioInput.nativeElement.blur();
    } else {
      this.nombreUsuario = '';
      this.amigosFiltrados = this.amigos;
      this.usuariosNoAgregados = [];
      this.noSeEncontraronAmigos = false;
      this.noSeEncontraronUsuarios = false;
      setTimeout(() => {
        this.autocompleteTrigger.openPanel();
      }, 0);
    }
  }

  private getUsuarioID(): number {
    if (typeof localStorage !== 'undefined') {
      return Number(localStorage.getItem('id')) || 0;
    }
    return 0;
  }

  obtenerTituloBotonClose(): string {
    return "Limpiar";
  }
}