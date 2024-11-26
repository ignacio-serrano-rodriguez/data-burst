import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ElementosService } from '../../../servicios/elementos.service';
import { ListasService } from '../../../servicios/listas.service';
import { Elemento } from '../../../interfaces/Elemento';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-agregador',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule // Agregar FormsModule a los imports
  ],
  templateUrl: './agregador.component.html',
  styleUrl: './agregador.component.css'
})
export class AgregadorComponent {
  @Input() nombreLista: string | undefined;
  @Input() listaId: number | undefined;
  @Output() volverALista = new EventEmitter<void>();

  private elementosService = inject(ElementosService);
  private listasService = inject(ListasService);

  nombreElemento: string = '';
  elementos: Elemento[] = [];
  elementosAsignados: Set<number> = new Set();
  mostrarFormularioCrear = false;
  mostrarBotonCrear = false;
  noSeEncontraronElementos = false;
  consultasFinalizadas = false;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.obtenerElementosAsignados();

    this.searchSubject.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente al anterior
    ).subscribe(query => {
      if (query.length >= 3) {
        this.buscarElementos(query);
      } else {
        this.elementos = [];
        this.noSeEncontraronElementos = false;
        this.mostrarBotonCrear = false;
      }
    });
  }

  obtenerElementosAsignados() {
    if (this.listaId) {
      this.listasService.obtenerElementosLista(this.listaId).subscribe({
        next: (data) => {
          if (data.exito) {
            this.elementosAsignados = new Set(data.elementos.map(e => e.id));
          }
        },
        error: (error) => {
          console.error('Error al obtener los elementos de la lista:', error);
        }
      });
    }
  }

  buscarElementos(query: string) {
    this.consultasFinalizadas = false; // Reiniciar el estado de las consultas

    this.elementosService.buscarElementos(query).subscribe({
      next: (data) => {
        if (data.exito) {
          this.elementos = data.elementos.filter(elemento => elemento.nombre.toLowerCase().includes(query.toLowerCase()));
          this.mostrarFormularioCrear = false; // Ocultar el formulario de creación después de la búsqueda
          this.mostrarBotonCrear = true; // Mostrar el botón de creación después de la búsqueda
          this.noSeEncontraronElementos = this.elementos.length === 0; // Mostrar el mensaje si no se encontraron elementos
          this.consultasFinalizadas = true; // Marcar las consultas como finalizadas
        }
      },
      error: (error) => {
        console.error('Error al buscar elementos:', error);
        this.mostrarFormularioCrear = false; // Ocultar el formulario de creación en caso de error
        this.mostrarBotonCrear = true; // Mostrar el botón de creación en caso de error
        this.noSeEncontraronElementos = true; // Mostrar el mensaje en caso de error
        this.elementos = []; // Borrar los elementos mostrados en caso de error
        this.consultasFinalizadas = true; // Marcar las consultas como finalizadas incluso en caso de error
      }
    });
  }

  onNombreElementoChange() {
    this.searchSubject.next(this.nombreElemento.trim());
  }

  mostrarFormulario() {
    this.mostrarFormularioCrear = true;
  }

  crearElemento() {
    if (!this.nombreElemento.trim()) return;

    const usuarioId = localStorage.getItem('id');
    if (!usuarioId) {
      console.error('Usuario no autenticado');
      return;
    }

    const nuevoElemento: Elemento = {
      id: 0, // El ID será asignado por el backend
      nombre: this.nombreElemento,
      fecha_aparicion: '', // Añadir la fecha de aparición
      informacion_extra: '', // Añadir la información extra
      puntuacion: 0, // Puntuación por defecto
      descripcion: '', // Añadir la descripción
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

          // Asignar el nuevo elemento a la lista
          if (this.listaId) {
            this.asignarElemento(data.elemento.id);
            this.elementosAsignados.add(data.elemento.id); // Añadir el elemento a la lista de elementos asignados
          }
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
          this.elementosAsignados.add(elementoId); // Añadir el elemento a la lista de elementos asignados
        }
      },
      error: (error) => {
        console.error('Error al asignar el elemento a la lista:', error);
      }
    });
  }

  quitarElemento(elementoId: number) {
    if (this.listaId === undefined) {
      console.error('Lista no especificada');
      return;
    }

    this.elementosService.quitarElemento(this.listaId, elementoId).subscribe({
      next: (data) => {
        if (data.exito) {
          console.log('Elemento quitado de la lista exitosamente');
          this.elementosAsignados.delete(elementoId); // Quitar el elemento de la lista de elementos asignados
        }
      },
      error: (error) => {
        console.error('Error al quitar el elemento de la lista:', error);
      }
    });
  }

  volver() {
    this.volverALista.emit();
  }

  limpiarMensaje() {
    // No es necesario hacer nada aquí, ya que el valor del input se maneja con ngModel
  }

  esNombreElementoValido(): boolean {
    return this.nombreElemento.trim().length > 0;
  }
}