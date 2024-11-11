import { Component, Input, OnInit } from '@angular/core';

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
export class CabeceraComponent implements OnInit
{
  @Input() usuario: string = '';

  ngOnInit() 
  {
    const storedUser = localStorage.getItem('usuario');

    if (storedUser) 
    {
      this.usuario = storedUser;
    }
  }

}
