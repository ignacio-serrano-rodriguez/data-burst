import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ListasService } from '../../../servicios/listas.service';
import { ElementosService } from '../../../servicios/elementos.service';
import { AmigosService } from '../../../servicios/amigos.service';
import { Lista } from '../../../interfaces/Lista';
import { Elemento } from '../../../interfaces/Elemento';
import { AgregadorComponent } from './agregador/agregador.component';
import { ConfirmacionDialogComponent } from './confirmacion-dialog/confirmacion-dialog.component';
import { ComentarioDialogComponent } from './comentario-dialog/comentario-dialog.component';
import { CrearElementoDialogComponent } from './crear-elemento-dialog/crear-elemento-dialog.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule
  ],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit, AfterViewInit {
  @Input() lista: Lista | undefined;
  @Output() volverAListasYAmigos = new EventEmitter<void>();
  @ViewChild('nombreListaInput') nombreListaInput!: ElementRef;
  @ViewChild('nombreAmigoBuscarInput') nombreAmigoBuscarInput!: ElementRef;
  @ViewChild('nombreElementoBuscarInput') nombreElementoBuscarInput!: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  @ViewChild('autoElemento', { read: MatAutocompleteTrigger }) autocompleteTriggerElemento!: MatAutocompleteTrigger;
  elementos: Elemento[] = [];
  elementosLikeDislike: { [key: number]: boolean | null } = {};
  amigos: any[] = [];
  colaboradores: any[] = [];
  mostrarColaborarComponent = false;
  editandoNombre = false;
  nuevoNombreLista = '';
  nombreAmigoBuscar: string = '';
  nombreElementoBuscar: string = '';
  amigosEncontrados: any[] = [];
  elementosEncontrados: any[] = [];
  noSeEncontraronAmigos = false;
  noSeEncontraronElementos = false;
  usuarioActual: number = Number(localStorage.getItem('id')) || 0;
  mostrarBotonCrear = false;

  private searchSubjectBuscar = new Subject<string>();
  private searchSubjectElemento = new Subject<string>();

  private elementosService = inject(ElementosService);
  private listasService = inject(ListasService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    if (this.lista) {
      this.nuevoNombreLista = this.lista.nombre;
      this.obtenerElementosLista(this.lista.id);
      this.obtenerColaboradores(this.lista.id);
    }

    this.searchSubjectBuscar.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.length >= 3) {
        const usuarioID = Number(localStorage.getItem('id')) || 0;
        this.buscarAmigosNoManipulanLista(query, usuarioID, this.lista?.id!);
      } else {
        this.amigosEncontrados = [];
        this.noSeEncontraronAmigos = false;
      }
    });

    this.searchSubjectElemento.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.length >= 3 && this.lista) {
        this.buscarElementos(query, this.lista.id);
      } else {
        this.elementosEncontrados = [];
        this.noSeEncontraronElementos = false;
        this.mostrarBotonCrear = true; // Mostrar el botón siempre que se realice una búsqueda
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.editandoNombre) {
      this.nombreListaInput.nativeElement.focus();
    }
    // Asegúrate de que autocompleteTriggerElemento esté inicializado
    setTimeout(() => {
      if (this.autocompleteTriggerElemento) {
        this.autocompleteTriggerElemento.openPanel();
      }
    }, 0);
  }

  onNombreAmigoBuscarChange() {
    this.searchSubjectBuscar.next(this.nombreAmigoBuscar.trim());
    this.autocompleteTrigger.openPanel();
  }

  onNombreElementoBuscarChange() {
    this.searchSubjectElemento.next(this.nombreElementoBuscar.trim());
    if (this.autocompleteTriggerElemento) {
      this.autocompleteTriggerElemento.openPanel();
    }
  }

  abrirDesplegable() {
    this.autocompleteTrigger.openPanel();
  }

  abrirDesplegableElemento() {
    this.mostrarBotonCrear = true; // Mostrar el botón siempre que se enfoque el input
    if (this.autocompleteTriggerElemento) {
      this.autocompleteTriggerElemento.openPanel();
    }
  }

  buscarAmigosNoManipulanLista(query: string, usuarioID: number, listaID: number) {
    this.amigosService.buscarAmigosNoManipulanLista(query, usuarioID, listaID).subscribe({
      next: (data: { exito: boolean, amigos: any[] }) => {
        if (data.exito) {
          this.amigosEncontrados = data.amigos;
          this.noSeEncontraronAmigos = this.amigosEncontrados.length === 0;
        }
      },
      error: () => {
        this.amigosEncontrados = [];
        this.noSeEncontraronAmigos = true;
      }
    });
  }

  buscarElementos(query: string, listaId: number) {
    this.elementosService.buscarElementos(query, listaId).subscribe({
      next: (data: { exito: boolean, elementos: Elemento[] }) => {
        if (data.exito) {
          this.elementosEncontrados = data.elementos;
          this.noSeEncontraronElementos = this.elementosEncontrados.length === 0;
          this.mostrarBotonCrear = true;
        }
      },
      error: () => {
        this.elementosEncontrados = [];
        this.noSeEncontraronElementos = true;
        this.mostrarBotonCrear = true;
      }
    });
  }

  obtenerElementosLista(id: number) {
    this.listasService.obtenerElementosLista(id).subscribe({
      next: (data: { exito: boolean, elementos: Elemento[] }) => {
        if (data.exito) {
          const usuarioId = Number(localStorage.getItem('id')) || 0;
          this.elementos = data.elementos.map(elemento => {
            const usuarioComentarioPositivo = elemento.usuariosComentariosPositivos.find(u => u.usuario_id === usuarioId);
            return {
              ...elemento,
              positivo: usuarioComentarioPositivo ? usuarioComentarioPositivo.positivo : null,
              comentario: usuarioComentarioPositivo ? usuarioComentarioPositivo.comentario : '',
              usuariosComentariosPositivos: elemento.usuariosComentariosPositivos.filter(u => u.usuario_id !== usuarioId)
            };
          });
        }
      }
    });
  }

  obtenerColaboradores(listaId: number) {
    const usuarioID = Number(localStorage.getItem('id'));
    this.listasService.obtenerColaboradores(listaId).subscribe({
      next: (data: { exito: boolean, colaboradores: any[] }) => {
        if (data.exito) {
          this.colaboradores = data.colaboradores.filter(colaborador => colaborador.id !== usuarioID);
        }
      }
    });
  }

  volver() {
    this.volverAListasYAmigos.emit();
  }

  toggleColaborar() {
    this.mostrarColaborarComponent = !this.mostrarColaborarComponent;
    if (this.mostrarColaborarComponent && this.lista) {
      this.obtenerColaboradores(this.lista.id);
    }
  }

  toggleEditarNombre() {
    if (this.editandoNombre) {
      this.cancelarEdicion();
    } else {
      this.editarNombre();
    }
  }

  editarNombre() {
    this.editandoNombre = true;
    setTimeout(() => {
      this.nombreListaInput.nativeElement.focus();
    }, 0);
  }

  guardarNombre() {
    if (this.lista && this.nuevoNombreLista.trim()) {
      this.listasService.modificarNombreLista(this.lista.id, this.nuevoNombreLista.trim()).subscribe({
        next: (data: { exito: boolean }) => {
          if (data.exito) {
            this.lista!.nombre = this.nuevoNombreLista.trim();
            this.editandoNombre = false;
          }
        }
      });
    }
  }

  cancelarEdicion() {
    this.editandoNombre = false;
    if (this.lista) {
      this.nuevoNombreLista = this.lista.nombre;
    }
  }

  eliminarLista() {
    if (this.lista) {
      const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
        width: '250px',
        data: { mensaje: '¿Estás seguro de que deseas eliminar esta lista?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const usuarioID = Number(localStorage.getItem('id'));
          this.listasService.desasignarLista(this.lista!.id, usuarioID).subscribe({
            next: (data: { exito: boolean }) => {… }
          });
        }
      });
    }
  }

  cambiarVisibilidad() {
    if (this.lista) {
      const nuevaVisibilidad = !this.lista.publica;
      const usuarioId = Number(localStorage.getItem('id')) || 0;
      this.listasService.cambiarVisibilidadLista(this.lista.id, usuarioId, nuevaVisibilidad).subscribe({
        next: (data: { exito: boolean }) => {
          if (data.exito) {
            this.lista!.publica = nuevaVisibilidad;
          }
        }
      });
    }
  }

  invitarAmigo(amigoId: number, amigoNombre: string) {
    const usuarioID = Number(localStorage.getItem('id'));
    if (this.lista) {
      this.listasService.invitarAmigo(this.lista.id, amigoId, usuarioID).subscribe({
        next: (data: { exito: boolean }) => {
          if (data.exito) {
            this.amigosEncontrados = [];
            this.noSeEncontraronAmigos = false;
            this.nombreAmigoBuscar = '';
            this.onNombreAmigoBuscarChange();
          }
        },
        error: () => {
          this.amigosEncontrados = [];
          this.noSeEncontraronAmigos = false;
          this.nombreAmigoBuscar = '';
          this.onNombreAmigoBuscarChange();
        }
      });
    }
  }

  agregarElemento(elementoId: number) {
    if (this.lista) {
      this.elementosService.asignarElemento(this.lista.id, elementoId).subscribe({
        next: (data: { exito: boolean }) => {
          if (data.exito) {
            this.obtenerElementosLista(this.lista!.id);
            this.elementosEncontrados = [];
          }
        },
        error: () => {
          this.elementosEncontrados = [];
          this.noSeEncontraronElementos = false;
          this.nombreElementoBuscar = '';
          this.onNombreElementoBuscarChange();
        }
      });
    }
  }

  eliminarElemento(elementoId: number) {
    if (this.lista) {
      this.elementosService.quitarElemento(this.lista.id, elementoId).subscribe({
        next: (data: { exito: boolean }) => {
          if (data.exito) {… }
        }
      });
    }
  }

  likeElemento(elemento: Elemento) {
    if (this.lista) {
      this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, true).subscribe({
        next: (data: { exito: boolean }) => {
          if (data.exito) {… }
        }
      });
    }
  }

  dislikeElemento(elemento: Elemento) {
    if (this.lista) {
      this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, false).subscribe({
        next: (data: { exito: boolean }) => {
          if (data.exito) {… }
        }
      });
    }
  }

  resetLikeDislikeElemento(elemento: Elemento) {
    if (this.lista) {
      this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, null).subscribe({
        next: (data: { exito: boolean }) => {
          if (data.exito) {… }
        }
      });
    }
  }

  comentarElemento(elemento: Elemento) {
    const dialogRef = this.dialog.open(ComentarioDialogComponent, {
      width: '250px',
      data: { elementoId: elemento.id, comentario: elemento.comentario || '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.lista) {… }
      }
    });
  }

  salirDelInput() {
    if (this.nombreAmigoBuscar.trim() === '') {
      this.nombreAmigoBuscarInput.nativeElement.blur();
    } else {
      this.nombreAmigoBuscar = '';
      this.amigosEncontrados = [];
      this.noSeEncontraronAmigos = false;
      setTimeout(() => {
        this.autocompleteTrigger.openPanel();
      }, 0);
    }
  }

  salirDelInputElemento() {
    if (this.nombreElementoBuscar.trim() === '') {
      this.nombreElementoBuscarInput.nativeElement.blur();
    } else {
      this.nombreElementoBuscar = '';
      this.elementosEncontrados = [];
      this.noSeEncontraronElementos = false;
      setTimeout(() => {
        if (this.autocompleteTriggerElemento) {… }
      }, 0);
    }
  }

  agregarElementoSinEscribir(event: any) {
    const elemento = event.option.value;
    if (elemento && elemento.id) {
      this.agregarElemento(elemento.id);
      this.nombreElementoBuscar = ''; // Limpiar el input
      this.elementosEncontrados = []; // Limpiar los resultados encontrados
      this.nombreElementoBuscarInput.nativeElement.blur(); // Quitar el foco del input
    } else {
      this.mostrarFormulario();
    }
  }

  mostrarFormulario() {
    const nombreElemento = this.nombreElementoBuscar ? this.nombreElementoBuscar.trim() : '';
    const dialogRef = this.dialog.open(CrearElementoDialogComponent, {
      width: '400px',
      data: {
        nombre: nombreElemento
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

          if (this.lista) {… }

          // Vaciar el input de "Agregar elemento", los resultados de búsqueda y el botón de "Mostrar formulario de creación"
          this.nombreElementoBuscar = '';
          this.elementosEncontrados = [];
          this.mostrarBotonCrear = false;
        }
      },
      error: (error) => {
        console.error('Error al crear el elemento:', error);
      }
    });
  }
}