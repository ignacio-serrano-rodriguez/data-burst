import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { accesoService } from '../../../servicios/acceso.service';
import { Registro } from '../../../interfaces/Registro';
import { Login } from '../../../interfaces/Login';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  hideContrasenia = true;
  hideRepetirContrasenia = true;
  loading = false;

  private accesoService = inject(accesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    mail: ['', [Validators.required, Validators.email]],
    usuario: ['', [Validators.required, this.minLettersValidator(5)]],
    contrasenia: ['', [Validators.required, this.passwordValidator]],
    contraseniaRepetida: ['', Validators.required]
  });

  registrarse() {
    if (this.formRegistro.invalid || this.formRegistro.value.contrasenia !== this.formRegistro.value.contraseniaRepetida) {
      this.formRegistro.markAllAsTouched();

      if (this.formRegistro.valid && this.formRegistro.value.contrasenia !== this.formRegistro.value.contraseniaRepetida) {
        this.mostrarMensajeError("Las contraseñas no coinciden.");
      } else if (this.formRegistro.invalid) {
        this.mostrarMensajeError("Por favor, corrige los errores del formulario.");
      }
      return;
    }

    const objeto: Registro = {
      mail: this.formRegistro.value.mail,
      usuario: this.formRegistro.value.usuario,
      contrasenia: this.formRegistro.value.contrasenia,
      contraseniaRepetida: this.formRegistro.value.contraseniaRepetida
    };

    this.loading = true;

    this.accesoService.registro(objeto).subscribe({
      next: (data) => {
        this.loading = false;
        if (data.exito == true) {
          this.mostrarMensajeExito(data.mensaje);
          this.limpiarFormulario();

          const loginObjeto: Login = {
            usuario: objeto.usuario,
            contrasenia: objeto.contrasenia
          };

          this.accesoService.login(loginObjeto).subscribe({
            next: (loginData) => {
              if (loginData.exito == true) {
                this.guardarDatosUsuario(loginData);
                this.router.navigate(['home']);
                localStorage.setItem("refrescar", "true");
              }
            },
            error: (loginError) => {
              this.mostrarMensajeError(loginError.error.mensaje);
            }
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.mostrarMensajeError(error.error.mensaje);
      }
    });
  }

  getErrorMessage(): string {
    if (this.formRegistro.controls['mail'].hasError('required')) {
      return 'El correo electrónico es obligatorio.';
    }
    if (this.formRegistro.controls['mail'].hasError('email')) {
      return 'El formato del correo electrónico no es válido.';
    }
    if (this.formRegistro.controls['usuario'].hasError('required')) {
      return 'El nombre de usuario es obligatorio.';
    }
    if (this.formRegistro.controls['usuario'].hasError('minLetters')) {
      return 'El nombre de usuario debe contener al menos 5 letras.';
    }
    if (this.formRegistro.controls['contrasenia'].hasError('required')) {
      return 'La contraseña es obligatoria.';
    }
    if (this.formRegistro.controls['contrasenia'].hasError('passwordStrength')) {
      const errors = this.formRegistro.controls['contrasenia'].errors?.['passwordStrength'];
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
    if (this.formRegistro.controls['contraseniaRepetida'].hasError('required') ||
      this.formRegistro.value.contrasenia !== this.formRegistro.value.contraseniaRepetida) {
      return 'Repetir la contraseña es obligatorio.';
    }
    return '';
  }

  emailDomainValidator(control: any): { [key: string]: boolean } | null {
    return null;
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
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>+\-\/]/.test(password);
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

  mostrarMensajeExito(mensaje: string) {
    let mensajeInformativo = document.getElementById("mensajeInformativo");
    if (mensajeInformativo) {
      mensajeInformativo.classList.remove("mensaje-error");
      mensajeInformativo.classList.add("mensaje-exito");
      mensajeInformativo.innerText = mensaje;
    }
  }

  limpiarFormulario() {
    this.formRegistro.reset();
    Object.keys(this.formRegistro.controls).forEach(key => {
      this.formRegistro.get(key)?.setErrors(null);
    });
  }

  guardarDatosUsuario(loginData: any) {
    localStorage.setItem("token", loginData.token);
    localStorage.setItem("id", loginData.id.toString());
    localStorage.setItem("mail", loginData.mail);
    localStorage.setItem("usuario", loginData.usuario);
    localStorage.setItem("verificado", loginData.verificado.toString());
    localStorage.setItem("nombre", loginData.nombre);
    localStorage.setItem("apellido_1", loginData.apellido_1);
    localStorage.setItem("apellido_2", loginData.apellido_2);
    localStorage.setItem("fechaNacimiento", loginData.fechaNacimiento);
    localStorage.setItem("pais", loginData.pais);
    localStorage.setItem("profesion", loginData.profesion);
    localStorage.setItem("estudios", loginData.estudios);
    localStorage.setItem("idioma", loginData.idioma);
    localStorage.setItem("permiso", loginData.permiso.toString());
    localStorage.setItem("logueado", "true");
  }
}
