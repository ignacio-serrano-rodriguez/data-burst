import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu'; 

@Component
({
  selector: 'app-cabecera',
  standalone: true,
  imports: 
  [
    MatToolbarModule,
    MatMenuModule,
    CommonModule
  ],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})

export class CabeceraComponent implements OnInit
{
  @Input() nombreUsuario: string = '';
  mostrarAdministracion: boolean = false;
  permisoUsuario: string = "1";

  ngOnInit() 
  {
    this.nombreUsuario = localStorage.getItem('usuario') || "usuario";

    if (this.nombreUsuario) 
    {
      this.nombreUsuario = this.nombreUsuario;

      this.permisoUsuario = localStorage.getItem('permiso') || "1";

      if (this.permisoUsuario == "2")
      {
        console.log(localStorage.getItem('permiso'));
        this.mostrarAdministracion = true;
      }
      else 
      {
        this.mostrarAdministracion = false;
      }
    }
  }

  cerrarSesion() 
  {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }

}
