import { Component, inject } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ListasService } from '../../../servicios/listas.service';

import { CrearAsignarLista } from '../../../interfaces/CrearAsignarLista';

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

  private listasService = inject(ListasService);

  crearAsignarLista() 
  {
    
    let objeto: CrearAsignarLista
    ={
      usuarioID: Number(localStorage.getItem('id')) || 0,
      nombre: (document.getElementById('nombreLista') as HTMLInputElement).value
    };

    this.listasService.crearAsignarLista(objeto).subscribe
    ({

      next: (data)=> 
      {
        if (data.exito == true) 
        {
          (document.getElementById("nombreLista") as HTMLInputElement).value = '';
          document.getElementById("mensajeInformativo")!.innerText = data.mensaje + " (" + objeto.nombre + ")";
        }
      },

      error: (error)=> 
      {
        document.getElementById("mensajeInformativo")!.innerText = error.error.mensaje + " (" + objeto.nombre + ")";
      }

    })
  }
}