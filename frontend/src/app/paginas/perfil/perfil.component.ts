import { Component } from '@angular/core';
import { CabeceraComponent } from "../../cabecera/cabecera.component";
import { PieComponent } from "../../pie/pie.component";
import { DatosComponent } from "./datos/datos.component";
import { SolicitudesComponent } from "./solicitudes/solicitudes.component";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CabeceraComponent, PieComponent, DatosComponent, SolicitudesComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

}
