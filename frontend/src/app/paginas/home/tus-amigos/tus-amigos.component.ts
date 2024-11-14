import { Component } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component
({
  selector: 'app-tus-amigos',
  standalone: true,
  imports: 
  [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './tus-amigos.component.html',
  styleUrl: './tus-amigos.component.css'

})

export class TusAmigosComponent 
{
  agregarUsuario() 
  {
    console.log('Usuario agregado');
  }

}
