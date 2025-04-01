import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TusListasComponent } from "./tus-listas/tus-listas.component";
import { TusAmigosComponent } from "./tus-amigos/tus-amigos.component";
import { ListaComponent } from "./lista/lista.component";
import { AmigoComponent } from "./amigo/amigo.component";
import { CommonModule } from '@angular/common';
import { RecargaService } from '../../servicios/recarga.service';
import { Subscription } from 'rxjs';
import { Lista } from '../../interfaces/Lista';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TusListasComponent,
    TusAmigosComponent,
    ListaComponent,
    AmigoComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(TusListasComponent) tusListasComponent!: TusListasComponent;
  @ViewChild(TusAmigosComponent) tusAmigosComponent!: TusAmigosComponent;

  private recargaSubscription!: Subscription;

  usuarioLogueado: string = '(usuario logueado)';
  mostrarListasYAmigos = true;
  mostrarListaComponent = false;
  mostrarAmigoDetalle = false;
  listaSeleccionada: Lista | undefined = undefined;
  amigoSeleccionado: { id: number, nombre: string } | undefined = undefined;

  constructor(private recargaService: RecargaService) { }

  ngOnInit() {
    this.recargaSubscription = this.recargaService.recargarHome$.subscribe(() => {
      this.recargarHome();
    });
  }

  ngOnDestroy() {
    if (this.recargaSubscription) {
      this.recargaSubscription.unsubscribe();
    }
  }

  mostrarLista(lista: Lista) {
    this.listaSeleccionada = lista;
    this.mostrarListasYAmigos = false;
    this.mostrarListaComponent = true;
    this.mostrarAmigoDetalle = false;
  }

  mostrarAmigo(amigo: { id: number, nombre: string }) {
    this.amigoSeleccionado = amigo;
    this.mostrarListasYAmigos = false;
    this.mostrarListaComponent = false;
    this.mostrarAmigoDetalle = true;
  }

  volverAListasYAmigos() {
    this.listaSeleccionada = undefined;
    this.amigoSeleccionado = undefined;
    this.mostrarListasYAmigos = true;
    this.mostrarListaComponent = false;
    this.mostrarAmigoDetalle = false;
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

  recargarHome() {
    this.tusListasComponent.ngOnInit();
    this.tusAmigosComponent.ngOnInit();
  }
}