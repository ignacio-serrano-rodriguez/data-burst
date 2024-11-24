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
  @Input() listaId: number | undefined;
  @Output() volverALista = new EventEmitter<void>();

  private elementosService = inject(ElementosService);
  private formBuilder = inject(FormBuilder);

  formBuscar: FormGroup = this.formBuilder.group({
    query: ['', Validators.required]
  });

  formCrear: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    fecha_aparicion: ['', Validators.required],
    informacion_extra: [''],
    descripcion: ['', Validators.required]
  });

  elementos: Elemento[] = [];
  mostrarFormularioCrear = false;
  mostrarBotonCrear = false;
  noSeEncontraronElementos = false;

  buscarElementos() {
    const query = this.formBuscar.value.query.trim();
    if (!query) {
      this.elementos = [];
      this.noSeEncontraronElementos = true;
      this.mostrarBotonCrear = true;
      return;
    }

    this.elementosService.buscarElementos(query).subscribe({
      next: (data) => {
        if (data.exito) {
          this.elementos = data.elementos.filter(elemento => elemento.nombre.toLowerCase().includes(query.toLowerCase()));
          this.mostrarFormularioCrear = false; // Ocultar el formulario de creación después de la búsqueda
          this.mostrarBotonCrear = true; // Mostrar el botón de creación después de la búsqueda
          this.noSeEncontraronElementos = this.elementos.length === 0; // Mostrar el mensaje si no se encontraron elementos
        }
      },
      error: (error) => {
        console.error('Error al buscar elementos:', error);
        this.mostrarFormularioCrear = false; // Ocultar el formulario de creación en caso de error
        this.mostrarBotonCrear = true; // Mostrar el botón de creación en caso de error
        this.noSeEncontraronElementos = true; // Mostrar el mensaje en caso de error
        this.elementos = []; // Borrar los elementos mostrados en caso de error
      }
    });
  }

  mostrarFormulario() {
    this.mostrarFormularioCrear = true;
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
      puntuacion: 0, // Puntuación por defecto
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
          this.mostrarBotonCrear = false; // Ocultar el botón de creación después de crear el elemento
          this.noSeEncontraronElementos = false; // Ocultar el mensaje después de crear el elemento
        }
      },
      error: (error) => {
        console.error('Error al crear el elemento:', error);
      }
    });
  }

  asignarElemento(elementoId: number) {
    if (this.listaId === undefined) {
      console.error('Lista no especificada');
      return;
    }

    this.elementosService.asignarElemento(this.listaId, elementoId).subscribe({
      next: (data) => {
        if (data.exito) {
          console.log('Elemento asignado a la lista exitosamente');
        }
      },
      error: (error) => {
        console.error('Error al asignar el elemento a la lista:', error);
      }
    });
  }

  volver() {
    this.volverALista.emit();
  }
}