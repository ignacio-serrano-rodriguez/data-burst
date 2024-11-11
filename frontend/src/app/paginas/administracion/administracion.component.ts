import { Component, OnInit } from '@angular/core';
import { CabeceraComponent } from "../../cabecera/cabecera.component";
import { PieComponent } from "../../pie/pie.component";

import { Router } from '@angular/router';

@Component
({
  selector: 'app-administracion',
  standalone: true,
  imports: 
  [
    CabeceraComponent, 
    PieComponent
  ],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdministracionComponent implements OnInit
{

  constructor(private router: Router) {}

  ngOnInit() 
  {
    if (localStorage.getItem('permiso') != "2") 
    {
      this.router.navigate(['home']);
      setTimeout(() => {window.location.reload();}, 400);
    }
  }

}
