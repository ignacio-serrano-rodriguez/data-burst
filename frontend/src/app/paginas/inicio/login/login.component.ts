import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { accesoService } from '../../../servicios/acceso.service';
import { Login } from '../../../interfaces/Login';

@Component
  ({
    selector: 'app-login',
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
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
  })

export class LoginComponent {

  hide = true;

  private accesoService = inject(accesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group
    ({
      usuario: ['', Validators.required],
      contrasenia: ['', Validators.required]
    })

  iniciarSesion() {

    if (this.formLogin.invalid) return;

    const objeto: Login
      = {
      usuario: this.formLogin.value.usuario,
      contrasenia: this.formLogin.value.contrasenia
    }

    this.accesoService.login(objeto).subscribe
      ({

        next: (data) => {
          if (data.exito == true) {
            localStorage.setItem("token", data.token);
            this.router.navigate(['home']);
          }
        },

        error: (error) => {
          alert(error.error.mensaje);
        }

      })
  }
}