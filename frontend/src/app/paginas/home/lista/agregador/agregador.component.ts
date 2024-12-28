import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ElementosService } from '../../../../servicios/elementos.service';
import { ListasService } from '../../../../servicios/listas.service';
import { Elemento } from '../../../../interfaces/Elemento';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CrearElementoDialogComponent } from './crear-elemento-dialog/crear-elemento-dialog.component';

@Component({
  selector: 'app-agregador',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './agregador.component.html',
  styleUrls: ['./agregador.component.css']
})
export class AgregadorComponent {
  @Input() nombreLista: string | undefined;
  @Input() listaId: number | undefined;
  @Output() elementosActualizados = new EventEmitter<void>();

  private elementosService = inject(ElementosService);
  private listasService = inject(ListasService);
  private dialog = inject(MatDialog);

  buscarElemento: string = '';
  elementos: Elemento[] = [];
  elementosAsignados: Set<number> = new Set();
  mostrarBotonCrear = false;
  noSeEncontraronElementos = false;
  consultasFinalizadas = false;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.obtenerElementosAsignados();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
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
    this.consultasFinalizadas = false;

    this.elementosService.buscarElementos(query, this.listaId).subscribe({
      next: (data) => {
        if (data.exito) {
          this.elementos = data.elementos.filter(elemento => elemento.nombre.toLowerCase().includes(query.toLowerCase()));
          this.mostrarBotonCrear = true;
          this.noSeEncontraronElementos = this.elementos.length === 0;
          this.consultasFinalizadas = true;
        }
      },
      error: (error) => {
        console.error('Error al buscar elementos:', error);
        this.mostrarBotonCrear = true;
        this.noSeEncontraronElementos = true;
        this.elementos = [];
        this.consultasFinalizadas = true;
      }
    });
  }

  onBuscarElementoChange() {
    this.searchSubject.next(this.buscarElemento.trim());
  }

  mostrarFormulario() {
    const dialogRef = this.dialog.open(CrearElementoDialogComponent, {
      width: '400px',
      data: {
        nombre: this.buscarElemento.trim()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crearElemento(result);
      }
    });
  }

  crearElemento(datos: any) {
    const usuarioId = localStorage.getItem('id');
    if (!usuarioId) {
      console.error('Usuario no autenticado');
      return;
    }

    const nuevoElemento: Elemento = {
      id: 0,
      nombre: datos.nombre,
      fecha_aparicion: datos.fechaAparicion,
      informacion_extra: datos.informacionExtra,
      puntuacion: 0,
      descripcion: datos.descripcion,
      momento_creacion: new Date().toISOString(),
      usuario_id: parseInt(usuarioId, 10),
      positivo: null,
      comentario: null,
      usuariosComentariosPositivos: []
    };

    this.elementosService.crearElemento(nuevoElemento).subscribe({
      next: (data) => {
        if (data.exito) {
          this.elementos.push(data.elemento);
          this.noSeEncontraronElementos = false;

          if (this.listaId) {
            this.asignarElemento(data.elemento.id);
            this.elementosAsignados.add(data.elemento.id);
          }

          // Vaciar el input de "Agregar elemento", los resultados de búsqueda y el botón de "Mostrar formulario de creación"
          this.buscarElemento = '';
          this.elementos = [];
          this.mostrarBotonCrear = false;
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
          this.elementosAsignados.add(elementoId);
          this.elementosActualizados.emit();
          this.buscarElemento = '';
          this.elementos = [];
          this.mostrarBotonCrear = false;
        }
      },
      error: (error) => {
        console.error('Error al asignar el elemento a la lista:', error);
      }
    });
  }

  esNombreElementoValido(): boolean {
    return this.buscarElemento.trim().length > 0;
  }
}