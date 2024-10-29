import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { accesoService } from '../../../servicios/acceso.service';
import { Registro } from '../../../interfaces/Registro';

@Component
  ({
    selector: 'app-registro',
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
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.css'
  })

export class RegistroComponent {

  hideContrasenia = true;
  hideRepetirContrasenia = true;

  private accesoService = inject(accesoService);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    mail: ['', Validators.required],
    usuario: ['', Validators.required],
    contrasenia: ['', Validators.required],
    contraseniaRepetida: ['', Validators.required]
  })

  registrarse() {

    if (this.formRegistro.invalid) return;

    const objeto: Registro
      = {
      mail: this.formRegistro.value.mail,
      usuario: this.formRegistro.value.usuario,
      contrasenia: this.formRegistro.value.contrasenia,
      contraseniaRepetida: this.formRegistro.value.contraseniaRepetida
    };

    if (objeto.contrasenia != objeto.contraseniaRepetida) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.accesoService.registro(objeto).subscribe
      ({

        next: (data) => {
          if (data.exito == true) {
            alert(data.mensaje);
            location.reload();
          }
        },

        error: (error) => {
          alert(error.error.mensaje);
        }

      })

  }
}