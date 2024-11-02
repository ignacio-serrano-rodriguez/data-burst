import { Component } from '@angular/core';
import { CabeceraComponent } from "../../cabecera/cabecera.component";
import { PieComponent } from "../../pie/pie.component";

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CabeceraComponent, PieComponent],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdministracionComponent {

}
