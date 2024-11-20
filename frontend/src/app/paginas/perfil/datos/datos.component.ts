import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DatosService } from '../../../servicios/datos.service';
import { ModificarDatosUsuario } from '../../../interfaces/ModificarDatosUsuario';

@Component
({
  selector: 'app-datos',
  standalone: true,
  imports: 
  [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css'
})

export class DatosComponent
{
  
  hideNuevaContrasenia = true;
  hideRepetirNuevaContrasenia = true;
  hideContraseniaActual = true;

  private DatosService = inject(DatosService);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group
  ({
    mail: [localStorage.getItem('mail') || ''],
    usuario: [localStorage.getItem('usuario') || ''],
    nuevaContrasenia: [''],
    contraseniaRepetida: [''],
    contraseniaActual: ['', Validators.required]
  })

  modificarDatosUsuario() 
  {

    if (this.formRegistro.invalid) return;

    const objeto: ModificarDatosUsuario
    ={
      id: localStorage.getItem('id') || '',
      mail: this.formRegistro.value.mail,
      usuario: this.formRegistro.value.usuario,
      nueva_contrasenia: this.formRegistro.value.nuevaContrasenia,
      contrasenia_actual: this.formRegistro.value.contraseniaActual,
      nombre: '',
      apellido_1: '',
      apellido_2: '',
      pais: '',
      idioma: '',
      profesion: '',
      fecha_nacimiento: ''
    };

    // if (objeto.contrasenia != objeto.contraseniaRepetida) 
    // {
    //   let mensajeInformativo = document.getElementById("mensajeInformativo");
    //   mensajeInformativo ? mensajeInformativo.innerText = "Las contraseñas no coinciden." : null;
    //   return;
    // }

    this.DatosService.modificarDatosUsuario(objeto).subscribe
    ({

      next: (data)=> 
      {
        if (data.exito == true) 
        {
          document.getElementById("mensajeInformativo")!.innerText = data.mensaje;
          localStorage.clear();
          window.location.reload();
        }
      },

      error: (error)=> 
      {
        document.getElementById("mensajeInformativo")!.innerText = error.error.mensaje;
      }

    })

  }
}
