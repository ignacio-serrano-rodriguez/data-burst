import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
    MatIconModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  hideContrasenia = true;
  hideRepetirContrasenia = true;

  private accesoService = inject(accesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    mail: ['', [Validators.required, Validators.email]],
    usuario: ['', [Validators.required, Validators.minLength(5)]],
    contrasenia: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
    contraseniaRepetida: ['', Validators.required]
  });

  registrarse() {
    if (this.formRegistro.invalid) {
      this.mostrarMensajeError(this.getErrorMessage());
      return;
    }

    const objeto: Registro = {
      mail: this.formRegistro.value.mail,
      usuario: this.formRegistro.value.usuario,
      contrasenia: this.formRegistro.value.contrasenia,
      contraseniaRepetida: this.formRegistro.value.contraseniaRepetida
    };

    if (objeto.contrasenia != objeto.contraseniaRepetida) {
      this.mostrarMensajeError("Las contraseñas no coinciden.");
      return;
    }

    this.accesoService.registro(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.mostrarMensajeExito(data.mensaje);
          this.limpiarFormulario();

          // Lógica de inicio de sesión después del registro exitoso
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
        this.mostrarMensajeError(error.error.mensaje);
      }
    });
  }

  getErrorMessage(): string {
    if (this.formRegistro.controls['mail'].hasError('required')) {
      return 'El correo electrónico es obligatorio.';
    }
    if (this.formRegistro.controls['mail'].hasError('email')) {
      return 'El correo electrónico no es válido.';
    }
    if (this.formRegistro.controls['usuario'].hasError('required')) {
      return 'El nombre de usuario es obligatorio.';
    }
    if (this.formRegistro.controls['usuario'].hasError('minlength')) {
      return 'El nombre de usuario debe tener al menos 5 caracteres.';
    }
    if (this.formRegistro.controls['contrasenia'].hasError('required')) {
      return 'La contraseña es obligatoria.';
    }
    if (this.formRegistro.controls['contrasenia'].hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (this.formRegistro.controls['contrasenia'].hasError('pattern')) {
      return 'La contraseña debe contener al menos una mayúscula, un número y un símbolo especial.';
    }
    if (this.formRegistro.controls['contraseniaRepetida'].hasError('required')) {
      return 'Repetir la contraseña es obligatorio.';
    }
    return '';
  }

  passwordValidator(control: any): { [key: string]: boolean } | null {
    const password = control.value;
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+\-])[A-Za-z\d@$!%*?&+\-]{6,}$/;
    if (!pattern.test(password)) {
      return { 'pattern': true };
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