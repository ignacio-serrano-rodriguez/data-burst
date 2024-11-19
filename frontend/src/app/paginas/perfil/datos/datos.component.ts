import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { accesoService } from '../../../servicios/acceso.service';
import { ModificarDatos } from '../../../interfaces/ModificarDatos';
import { MatCardModule } from '@angular/material/card';

@Component
({
  selector: 'app-datos',
  standalone: true,
  imports: 
  [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css'
})

export class DatosComponent 
{

  hideNuevaContrasenia = true;
  hideContrasenia = true;
  hideRepetirContrasenia = true;

  private accesoService = inject(accesoService);
  public formBuild = inject(FormBuilder);

  public formModificarDatos: FormGroup = this.formBuild.group
  ({
    mail: ['', Validators.required],
    usuario: ['', Validators.required],
    contrasenia: ['', Validators.required],
    contraseniaRepetida: ['', Validators.required]
  })
localStorage: any;

  modificarDatos() 
  {

    console.log("modificarDatos()");

    if (this.formModificarDatos.invalid) return;

    let objeto: ModificarDatos
    ={
      mail: this.formModificarDatos.value.mail,
      usuario: this.formModificarDatos.value.usuario,
      nombre: this.formModificarDatos.value.nombre,
      apellido_1: this.formModificarDatos.value.apellido_1,
      apellido_2: this.formModificarDatos.value.apellido_2,
      pais: this.formModificarDatos.value.pais,
      idioma: this.formModificarDatos.value.idioma,
      profesion: this.formModificarDatos.value.profesion,
      fecha_nacimiento: this.formModificarDatos.value.fecha_nacimiento,
      nueva_contrasenia: this.formModificarDatos.value.contraseniaRepetida,
      contrasenia_actual: this.formModificarDatos.value.contrasenia
    };

    if (objeto.nueva_contrasenia != objeto.nueva_contrasenia) 
    {
      let mensajeInformativo = document.getElementById("mensajeInformativo");
      mensajeInformativo ? mensajeInformativo.innerText = "Las contraseñas no coinciden." : null;
      return;
    }

    // this.accesoService.registro(objeto).subscribe
    // ({

    //   next: (data)=> 
    //   {
    //     if (data.exito == true) 
    //     {
    //       document.getElementById("mensajeInformativo")!.innerText = data.mensaje;
    //       (document.getElementById("mailInput") as HTMLInputElement).value = '';
    //       (document.getElementById("usuarioInput") as HTMLInputElement).value = '';
    //       (document.getElementById("contraseniaInput") as HTMLInputElement).value = '';
    //       (document.getElementById("contraseniaRepetidaInput") as HTMLInputElement).value = '';
    //     }
    //   },

    //   error: (error)=> 
    //   {
    //     document.getElementById("mensajeInformativo")!.innerText = error.error.mensaje;
    //   }

    // })

  }
}
