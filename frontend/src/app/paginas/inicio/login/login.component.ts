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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  hide = true;

  private accesoService = inject(accesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    usuario: ['', [Validators.required, this.minLettersValidator(5)]],
    contrasenia: ['', [Validators.required, this.passwordValidator]]
  });

  iniciarSesion() {
    if (this.formLogin.invalid) {
      this.mostrarMensajeError(this.getErrorMessage());
      return;
    }

    const objeto: Login = {
      usuario: this.formLogin.value.usuario,
      contrasenia: this.formLogin.value.contrasenia
    };

    this.accesoService.login(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          let mensajeInformativo = document.getElementById("mensajeInformativo");
          if (mensajeInformativo) {
            mensajeInformativo.classList.remove("mensaje-error");
            mensajeInformativo.classList.add("mensaje-exito");
            mensajeInformativo.innerText = data.mensaje;
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("id", data.id.toString());
          localStorage.setItem("mail", data.mail);
          localStorage.setItem("usuario", data.usuario);
          localStorage.setItem("verificado", data.verificado.toString());
          localStorage.setItem("nombre", data.nombre);
          localStorage.setItem("apellido_1", data.apellido_1);
          localStorage.setItem("apellido_2", data.apellido_2);
          localStorage.setItem("fechaNacimiento", data.fechaNacimiento);
          localStorage.setItem("pais", data.pais);
          localStorage.setItem("profesion", data.profesion);
          localStorage.setItem("estudios", data.estudios);
          localStorage.setItem("idioma", data.idioma);
          localStorage.setItem("permiso", data.permiso.toString());
          localStorage.setItem("logueado", "true");

          this.router.navigate(['home']);
          localStorage.setItem("refrescar", "true");
        }
      },
      error: (error) => {
        let mensajeInformativo = document.getElementById("mensajeInformativo");
        if (mensajeInformativo) {
          mensajeInformativo.classList.remove("mensaje-exito");
          mensajeInformativo.classList.add("mensaje-error");
          mensajeInformativo.innerText = error.error.mensaje;
        }
      }
    });
  }

  getErrorMessage(): string {
    if (this.formLogin.controls['usuario'].hasError('required')) {
      return 'El nombre de usuario es obligatorio.';
    }
    if (this.formLogin.controls['usuario'].hasError('minLetters')) {
      return 'El nombre de usuario debe contener al menos 5 letras.';
    }
    if (this.formLogin.controls['contrasenia'].hasError('required')) {
      return 'La contraseña es obligatoria.';
    }
    if (this.formLogin.controls['contrasenia'].hasError('passwordStrength')) {
      const errors = this.formLogin.controls['contrasenia'].errors?.['passwordStrength'];
      let errorMessage = 'La contraseña debe cumplir con los siguientes requisitos:';
      if (!errors?.hasUpperCase) {
        errorMessage += '\n- Al menos una letra mayúscula.';
      }
      if (!errors?.hasLowerCase) {
        errorMessage += '\n- Al menos una letra minúscula.';
      }
      if (!errors?.hasNumber) {
        errorMessage += '\n- Al menos un número.';
      }
      if (!errors?.hasSpecialChar) {
        errorMessage += '\n- Al menos un carácter especial.';
      }
      if (!errors?.isValidLength) {
        errorMessage += '\n- Al menos 6 caracteres.';
      }
      return errorMessage;
    }
    return '';
  }

  minLettersValidator(minLetters: number) {
    return (control: any): { [key: string]: boolean } | null => {
      const usuario = control.value;
      if (!usuario) {
        return null;
      }
      const lettersCount = (usuario.match(/[a-zA-Z]/g) || []).length;
      if (lettersCount < minLetters) {
        return { 'minLetters': true };
      }
      return null;
    };
  }

  passwordValidator(control: any): { [key: string]: any } | null {
    const password = control.value;
    if (!password) {
      return null;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>+\-\/]/.test(password); // Aceptar todos los caracteres especiales y aritméticos
    const isValidLength = password.length >= 6;
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || !isValidLength) {
      return { 
        'passwordStrength': {
          hasUpperCase,
          hasLowerCase,
          hasNumber,
          hasSpecialChar,
          isValidLength
        }
      };
    }
    return null;
  }

  mostrarMensajeError(mensaje: string) {
    let mensajeInformativo = document.getElementById("mensajeInformativo");
    if (mensajeInformativo) {
      mensajeInformativo.classList.remove("mensaje-exito");
      mensajeInformativo.classList.add("mensaje-error");
      mensajeInformativo.innerText = mensaje;
    }
  }
}