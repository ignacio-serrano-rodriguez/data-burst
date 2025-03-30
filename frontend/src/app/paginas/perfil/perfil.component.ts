import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  hideNuevaContrasenia = true;
  hideRepetirNuevaContrasenia = true;
  hideContraseniaActual = true;

  private recargaService = inject(RecargaService);
  private notificacionesService = inject(NotificacionesService);
  private datosService = inject(DatosService);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    mail: [this.getLocalStorageItem('mail') || ''],
    usuario: [this.getLocalStorageItem('usuario') || ''],
    nuevaContrasenia: [''],
    nuevaContraseniaRepetida: [''],
    contraseniaActual: ['', Validators.required]
  });

  private recargaSubscription!: Subscription;

  ngOnInit() {
    this.recargaSubscription = this.recargaService.recargarPerfil$.subscribe(() => {
      this.recargarComponentes();
    });
  }

  ngOnDestroy() {
    if (this.recargaSubscription) {
      this.recargaSubscription.unsubscribe();
    }
  }

  recargarComponentes() {
    this.recargar();
    this.notificacionesService.actualizarNumeroSolicitudes();
  }

  recargar() {
    this.formRegistro.setValue({
      mail: this.getLocalStorageItem('mail') || '',
      usuario: this.getLocalStorageItem('usuario') || '',
      nuevaContrasenia: '',
      nuevaContraseniaRepetida: '',
      contraseniaActual: ''
    });
  }

  modificarDatosUsuario() {
    if (this.formRegistro.invalid) return;

    const objeto: ModificarDatosUsuario = {
      id: this.getLocalStorageItem('id') || '',
      mail: this.formRegistro.value.mail,
      usuario: this.formRegistro.value.usuario,
      nueva_contrasenia: this.formRegistro.value.nuevaContrasenia,
      nueva_contrasenia_repetida: this.formRegistro.value.nuevaContraseniaRepetida,
      contrasenia_actual: this.formRegistro.value.contraseniaActual,
      nombre: '',
      apellido_1: '',
      apellido_2: '',
      pais: '',
      idioma: '',
      profesion: '',
      fecha_nacimiento: ''
    };

    if (objeto.nueva_contrasenia !== objeto.nueva_contrasenia_repetida) {
      const mensajeInformativo = document.getElementById("mensajeInformativo");
      if (mensajeInformativo) mensajeInformativo.innerText = "Las contraseñas no coinciden.";
      return;
    }

    this.datosService.modificarDatosUsuario(objeto).subscribe({
      next: (data) => {
        if (data.exito === true) {
          const mensajeInformativo = document.getElementById("mensajeInformativo");
          if (mensajeInformativo) mensajeInformativo.innerText = data.mensaje;
          this.clearLocalStorage();
          window.location.reload();
        }
      },
      error: (error) => {
        const mensajeInformativo = document.getElementById("mensajeInformativo");
        if (mensajeInformativo) mensajeInformativo.innerText = error.error.mensaje;
      }
    });
  }

  private getLocalStorageItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private clearLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  }
}