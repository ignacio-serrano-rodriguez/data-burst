import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RecargaService } from '../../servicios/recarga.service';
import { NotificacionesService } from '../../servicios/notificaciones.service';
import { DatosService } from '../../servicios/datos.service';
import { ModificarDatosUsuario } from '../../interfaces/ModificarDatosUsuario';
import { Subscription } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnDestroy {
  // Password visibility toggles
  hideNuevaContrasenia = true;
  hideRepetirNuevaContrasenia = true;
  hideContraseniaActual = true;

  // Service injections
  private recargaService = inject(RecargaService);
  private notificacionesService = inject(NotificacionesService);
  private datosService = inject(DatosService);
  private formBuilder = inject(FormBuilder);

  // Form setup
  formPerfil: FormGroup = this.formBuilder.group({
    mail: [this.getLocalStorageItem('mail') || '', [Validators.required, Validators.email]],
    usuario: [this.getLocalStorageItem('usuario') || '', [Validators.required]],
    nuevaContrasenia: [''],
    nuevaContraseniaRepetida: [''],
    contraseniaActual: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  private recargaSubscription!: Subscription;

  ngOnInit(): void {
    this.recargaSubscription = this.recargaService.recargarPerfil$.subscribe(() => {
      this.recargarComponentes();
    });
  }

  ngOnDestroy(): void {
    if (this.recargaSubscription) {
      this.recargaSubscription.unsubscribe();
    }
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const nuevaContrasenia = control.get('nuevaContrasenia');
    const nuevaContraseniaRepetida = control.get('nuevaContraseniaRepetida');

    if (nuevaContrasenia?.value && nuevaContraseniaRepetida?.value &&
      nuevaContrasenia.value !== nuevaContraseniaRepetida.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  recargarComponentes(): void {
    this.recargarFormulario();
    this.notificacionesService.actualizarNumeroSolicitudes();
  }

  recargarFormulario(): void {
    this.formPerfil.setValue({
      mail: this.getLocalStorageItem('mail') || '',
      usuario: this.getLocalStorageItem('usuario') || '',
      nuevaContrasenia: '',
      nuevaContraseniaRepetida: '',
      contraseniaActual: ''
    });
  }

  guardarCambios(): void {
    if (this.formPerfil.invalid) return;

    const formValues = this.formPerfil.value;
    const objeto: ModificarDatosUsuario = {
      id: this.getLocalStorageItem('id') || '',
      mail: formValues.mail,
      usuario: formValues.usuario,
      nueva_contrasenia: formValues.nuevaContrasenia,
      nueva_contrasenia_repetida: formValues.nuevaContraseniaRepetida,
      contrasenia_actual: formValues.contraseniaActual,
      nombre: '',
      apellido_1: '',
      apellido_2: '',
      pais: '',
      idioma: '',
      profesion: '',
      fecha_nacimiento: ''
    };

    this.datosService.modificarDatosUsuario(objeto).subscribe({
      next: (response) => {
        if (response.exito) {
          this.mostrarMensaje(response.mensaje, true);
          this.limpiarLocalStorage();
          setTimeout(() => window.location.reload(), 1500);
        }
      },
      error: (error) => {
        this.mostrarMensaje(error.error?.mensaje || 'Error al guardar los cambios', false);
      }
    });
  }

  mostrarMensaje(mensaje: string, esExito: boolean): void {
    const mensajeElement = document.getElementById('mensajeInformativo');
    if (mensajeElement) {
      mensajeElement.innerText = mensaje;
      mensajeElement.style.color = esExito ? '#61B300' : '#f44336';
    }
  }

  private getLocalStorageItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private limpiarLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  }
}