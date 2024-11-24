import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementosService } from '../../../servicios/elementos.service';
import { Elemento } from '../../../interfaces/Elemento';

@Component({
  selector: 'app-agregador',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './agregador.component.html',
  styleUrl: './agregador.component.css'
})
export class AgregadorComponent {
  @Input() nombreLista: string | undefined;
  @Output() volverALista = new EventEmitter<void>();

  private elementosService = inject(ElementosService);
  private formBuilder = inject(FormBuilder);

  formBuscar: FormGroup = this.formBuilder.group({
    query: ['']
  });

  formCrear: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    fecha_aparicion: ['', Validators.required],
    informacion_extra: [''],
    puntuacion: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    descripcion: ['', Validators.required]
  });

  elementos: Elemento[] = [];
  mostrarFormularioCrear = false;

  buscarElementos() {
    const query = this.formBuscar.value.query;
    this.elementosService.buscarElementos(query).subscribe({
      next: (data) => {
        if (data.exito) {
          this.elementos = data.elementos;
          this.mostrarFormularioCrear = this.elementos.length === 0;
        }
      },
      error: (error) => {
        console.error('Error al buscar elementos:', error);
      }
    });
  }

  crearElemento() {
    if (this.formCrear.invalid) return;

    const usuarioId = localStorage.getItem('id');
    if (!usuarioId) {
      console.error('Usuario no autenticado');
      return;
    }

    const nuevoElemento: Elemento = {
      id: 0, // El ID será asignado por el backend
      nombre: this.formCrear.value.nombre,
      fecha_aparicion: this.formCrear.value.fecha_aparicion,
      informacion_extra: this.formCrear.value.informacion_extra,
      puntuacion: this.formCrear.value.puntuacion,
      descripcion: this.formCrear.value.descripcion,
      momento_creacion: new Date().toISOString(),
      usuario_id: parseInt(usuarioId, 10) // Añadir el usuario_id
    };

    console.log('Datos enviados:', nuevoElemento);

    this.elementosService.crearElemento(nuevoElemento).subscribe({
      next: (data) => {
        if (data.exito) {
          this.elementos.push(data.elemento);
          this.mostrarFormularioCrear = false;
        }
      },
      error: (error) => {
        console.error('Error al crear el elemento:', error);
      }
    });
  }

  volver() {
    this.volverALista.emit();
  }
}