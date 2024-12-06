import { Component, OnInit } from '@angular/core';
import { TusListasComponent } from "./tus-listas/tus-listas.component";
import { TusAmigosComponent } from "./tus-amigos/tus-amigos.component";
import { ListaComponent } from "./lista/lista.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TusListasComponent,
    TusAmigosComponent,
    ListaComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  usuarioLogueado: string = '(usuario logueado)';
  mostrarListasYAmigos = true;
  mostrarListaComponent = false;
  listaId: number | null = null;

  ngOnInit() {
    if (localStorage.getItem('refrescar') === 'true') {
      localStorage.setItem('refrescar', 'false');
      // location.reload();
    }
  }

  mostrarLista(id: number) {
    this.listaId = id;
    this.mostrarListasYAmigos = false;
    this.mostrarListaComponent = true;
  }

  volverAListasYAmigos() {
    this.listaId = null;
    this.mostrarListasYAmigos = true;
    this.mostrarListaComponent = false;
  }

  mostrarMensajePositivo(mensaje: string) {
    const mensajeInformativo = document.getElementById("mensajeInformativo");
    if (mensajeInformativo) {
      mensajeInformativo.innerText = mensaje;
      mensajeInformativo.classList.add('mensaje-positivo');
      mensajeInformativo.classList.remove('mensaje-negativo');
    }
  }

  mostrarMensajeNegativo(mensaje: string) {
    const mensajeInformativo = document.getElementById("mensajeInformativo");
    if (mensajeInformativo) {
      mensajeInformativo.innerText = mensaje;
      mensajeInformativo.classList.add('mensaje-negativo');
      mensajeInformativo.classList.remove('mensaje-positivo');
    }
  }

  limpiarMensaje() {
    const mensajeInformativo = document.getElementById("mensajeInformativo");
    if (mensajeInformativo) {
      mensajeInformativo.innerText = '';
      mensajeInformativo.classList.remove('mensaje-positivo');
      mensajeInformativo.classList.remove('mensaje-negativo');
    }
  }
}