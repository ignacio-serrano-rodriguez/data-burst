import { Component, Input } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';

@Component
({
  selector: 'app-cabecera',
  standalone: true,
  imports: 
  [
    MatToolbarModule
  ],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent 
{
  @Input() usuarioLogueado: string = 'nombreUsuario';
}
