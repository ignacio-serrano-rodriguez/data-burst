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
    mail: ['', Validators.required],
    usuario: ['', Validators.required],
    contrasenia: ['', Validators.required],
    contraseniaRepetida: ['', Validators.required]
  });

  registrarse() {

    if (this.formRegistro.invalid) return;

    const objeto: Registro = {
      mail: this.formRegistro.value.mail,
      usuario: this.formRegistro.value.usuario,
      contrasenia: this.formRegistro.value.contrasenia,
      contraseniaRepetida: this.formRegistro.value.contraseniaRepetida
    };

    if (objeto.contrasenia != objeto.contraseniaRepetida) {
      let mensajeInformativo = document.getElementById("mensajeInformativo");
      mensajeInformativo ? mensajeInformativo.innerText = "Las contraseñas no coinciden." : null;
      return;
    }

    this.accesoService.registro(objeto).subscribe({
      next: (data) => {
        if (data.exito == true) {
          document.getElementById("mensajeInformativo")!.innerText = data.mensaje;
          (document.getElementById("mailInput") as HTMLInputElement).value = '';
          (document.getElementById("usuarioInput") as HTMLInputElement).value = '';
          (document.getElementById("contraseniaInput") as HTMLInputElement).value = '';
          (document.getElementById("contraseniaRepetidaInput") as HTMLInputElement).value = '';

          // Lógica de inicio de sesión después del registro exitoso
          const loginObjeto: Login = {
            usuario: objeto.usuario,
            contrasenia: objeto.contrasenia
          };

          this.accesoService.login(loginObjeto).subscribe({
            next: (loginData) => {
              if (loginData.exito == true) {
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

                this.router.navigate(['home']);
                localStorage.setItem("refrescar", "true");
              }
            },
            error: (loginError) => {
              document.getElementById("mensajeInformativo")!.innerText = loginError.error.mensaje;
            }
          });
        }
      },
      error: (error) => {
        document.getElementById("mensajeInformativo")!.innerText = error.error.mensaje;
      }
    });
  }
}