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
import { Registro } from '../../../interfaces/Registro';
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

  public formRegistro: FormGroup = this.formBuild.group
  ({
    mail: ['', Validators.required],
    usuario: ['', Validators.required],
    contrasenia: ['', Validators.required],
    contraseniaRepetida: ['', Validators.required]
  })
localStorage: any;

  modificarDatos() 
  {

    if (this.formRegistro.invalid) return;

    const objeto: Registro
    ={
      mail: this.formRegistro.value.mail,
      usuario: this.formRegistro.value.usuario,
      contrasenia: this.formRegistro.value.contrasenia,
      contraseniaRepetida: this.formRegistro.value.contraseniaRepetida
    };

    if (objeto.contrasenia != objeto.contraseniaRepetida) 
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
