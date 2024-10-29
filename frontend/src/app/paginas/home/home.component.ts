import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { CabeceraComponent } from "../../cabecera/cabecera.component";
import { PieComponent } from "../../pie/pie.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CabeceraComponent,
    PieComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnChanges {

  usuarioLogueado: string = '(usuario logueado)';

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void { }

}