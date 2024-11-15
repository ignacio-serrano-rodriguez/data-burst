import { Component, inject } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AmigosService } from '../../../servicios/amigos.service';

import { AgregarUsuario } from '../../../interfaces/AgregarUsuario';

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

  private amigosService = inject(AmigosService);

  agregarUsuario() 
  {
    let objeto: AgregarUsuario
    ={
      usuarioID: Number(localStorage.getItem('id')) || 0,
      usuarioAgregar: (document.getElementById('nombreUsuarioAgregar') as HTMLInputElement).value
    };

    this.amigosService.agregarUsuario(objeto).subscribe
    ({

      next: (data)=> 
      {
        if (data.exito == true) 
        {
          (document.getElementById("nombreUsuarioAgregar") as HTMLInputElement).value = '';
          document.getElementById("mensajeInformativo")!.innerText = data.mensaje + " (" + objeto.usuarioAgregar + ")";
        }
      },

      error: (error)=> 
      {
        (document.getElementById("nombreUsuarioAgregar") as HTMLInputElement).value = '';
        document.getElementById("mensajeInformativo")!.innerText = error.error.mensaje + " (" + objeto.usuarioAgregar + ")";
      }

    })
  }

}
