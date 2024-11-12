import { Component } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component
({
  selector: 'app-tus-listas',
  standalone: true,
  imports: 
  [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './tus-listas.component.html',
  styleUrl: './tus-listas.component.css'
})

export class TusListasComponent 
{
  crearLista() 
  {
    throw new Error('Method not implemented.');
  }

}
