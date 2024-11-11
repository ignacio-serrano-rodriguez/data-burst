import { Component } from '@angular/core';
import { CabeceraComponent } from "../../cabecera/cabecera.component";
import { PieComponent } from "../../pie/pie.component";
import { TusListasComponent } from "./tus-listas/tus-listas.component";
import { TusAmigosComponent } from "./tus-amigos/tus-amigos.component";

@Component
({
  selector: 'app-home',
  standalone: true,
  imports: [
    CabeceraComponent,
    PieComponent,
    TusListasComponent,
    TusAmigosComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent 
{
  usuarioLogueado: string = '(usuario logueado)';
  
}
