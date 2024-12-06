import { Component } from '@angular/core';
import { DatosComponent } from "./datos/datos.component";
import { SolicitudesComponent } from "./solicitudes/solicitudes.component";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [DatosComponent, SolicitudesComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

}
