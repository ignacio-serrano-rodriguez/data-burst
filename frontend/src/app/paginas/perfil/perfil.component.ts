import { Component } from '@angular/core';
import { CabeceraComponent } from "../../cabecera/cabecera.component";
import { PieComponent } from "../../pie/pie.component";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CabeceraComponent, PieComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

}
