import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {MatCardModule} from '@angular/material/card'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatButtonModule} from '@angular/material/button'; 

import { RegistroService } from '../../../services/registro.service';
import { Registro } from '../../../interfaces/Registro';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  private registroService = inject(RegistroService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    mail:['',Validators.required],
    usuario:['',Validators.required],
    contrasenia:['',Validators.required],
    contraseniaRepetida:['',Validators.required]
  })

  registrarse(){
    if(this.formRegistro.invalid)return;

    const objeto: Registro = {
      mail: this.formRegistro.value.mail,
      usuario: this.formRegistro.value.usuario,
      contrasenia: this.formRegistro.value.contrasenia,
      contraseniaRepetida: this.formRegistro.value.contraseniaRepetida,
      verificado: true,
      permiso: 1,
      momento_registro: new Date()
    };

    if (objeto.contrasenia != objeto.contraseniaRepetida) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.registroService.registrarse(objeto).subscribe({
      next:(data)=>{
        if(data.mensaje != ''){
          alert('Usuario registrado.');
        }
      },
      error:(error) =>{
        console.log(error.message);
        alert('No se pudo registrar al usuario.');
      }

    })
  }
}