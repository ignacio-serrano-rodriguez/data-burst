import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component
({
  selector: 'app-administracion',
  standalone: true,
  imports: [],
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
      localStorage.setItem("refrescar", "true");
    }
  }

}
