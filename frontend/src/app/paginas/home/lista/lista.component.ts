import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ListasService } from '../../../servicios/listas.service';
import { ElementosService } from '../../../servicios/elementos.service';
import { AmigosService } from '../../../servicios/amigos.service';
import { Lista } from '../../../interfaces/Lista';
import { Elemento } from '../../../interfaces/Elemento';
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
    MatTableModule,
    MatButtonToggleModule
  ],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  constructor(
    private listasService: ListasService,
    private elementosService: ElementosService,
    private amigosService: AmigosService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.lista) {
      this.nuevoNombreLista = this.lista.nombre;
      this.obtenerElementosLista(this.lista.id);
      this.obtenerColaboradores(this.lista.id);
    }

    this.setupSearchSubjects();
  }

  ngAfterViewInit(): void {
    if (this.editandoNombre) {
      this.nombreListaInput.nativeElement.focus();
    }
    setTimeout(() => this.autocompleteTriggerElemento?.openPanel(), 0);
  }

  setupSearchSubjects() {
    this.searchSubjectBuscar.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => this.buscarAmigos(query));

    this.searchSubjectElemento.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => this.buscarElementos(query));
  }

  onNombreAmigoBuscarChange() {
    this.searchSubjectBuscar.next(this.nombreAmigoBuscar.trim());
    this.autocompleteTrigger?.openPanel();
  }

  onNombreElementoBuscarChange() {
    this.searchSubjectElemento.next(this.nombreElementoBuscar.trim());
    this.autocompleteTriggerElemento?.openPanel();
  }

  abrirDesplegable() {
    this.autocompleteTrigger?.openPanel();
  }

  abrirDesplegableElemento() {
    this.mostrarBotonCrear = true;
    this.autocompleteTriggerElemento?.openPanel();
  }

  buscarAmigos(query: string) {
    if (query.length >= 3) {
      const usuarioID = this.usuarioActual;
      this.amigosService.buscarAmigosNoManipulanLista(query, usuarioID, this.lista?.id!)
        .subscribe({
          next: data => {
            this.amigosEncontrados = data.amigos;
            this.noSeEncontraronAmigos = this.amigosEncontrados.length === 0;
          },
          error: () => {
            this.amigosEncontrados = [];
            this.noSeEncontraronAmigos = true;
          }
        });
    } else {
      this.amigosEncontrados = [];
      this.noSeEncontraronAmigos = false;
    }
  }

  buscarElementos(query: string) {
    if (query.length >= 3 && this.lista) {
      this.elementosService.buscarElementos(query, this.lista.id)
        .subscribe({
          next: data => {
            this.elementosEncontrados = data.elementos;
            this.noSeEncontraronElementos = this.elementosEncontrados.length === 0;
            this.mostrarBotonCrear = true;
          },
          error: () => {
            this.elementosEncontrados = [];
            this.noSeEncontraronElementos = true;
            this.mostrarBotonCrear = true;
          }
        });
    } else {
      this.elementosEncontrados = [];
      this.noSeEncontraronElementos = false;
      this.mostrarBotonCrear = true;
    }
  }

  obtenerElementosLista(id: number) {
    this.listasService.obtenerElementosLista(id).subscribe({
      next: data => {
        if (data.exito) {
          const usuarioId = this.usuarioActual;
          this.elementos = data.elementos.map(elemento => ({
            ...elemento,
            positivo: elemento.usuariosComentariosPositivos.find(u => u.usuario_id === usuarioId)?.positivo || null,
            comentario: elemento.usuariosComentariosPositivos.find(u => u.usuario_id === usuarioId)?.comentario || '',
            usuariosComentariosPositivos: elemento.usuariosComentariosPositivos.filter(u => u.usuario_id !== usuarioId)
          }));
        }
      }
    });
  }

  obtenerColaboradores(listaId: number) {
    this.listasService.obtenerColaboradores(listaId).subscribe({
      next: data => {
        if (data.exito) {
          this.colaboradores = data.colaboradores.filter(colaborador => colaborador.id !== this.usuarioActual);
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
    this.editandoNombre ? this.cancelarEdicion() : this.editarNombre();
  }

  editarNombre() {
    this.editandoNombre = true;
    setTimeout(() => this.nombreListaInput.nativeElement.focus(), 0);
  }

  guardarNombre() {
    if (this.lista && this.nuevoNombreLista.trim()) {
      this.listasService.modificarNombreLista(this.lista.id, this.nuevoNombreLista.trim()).subscribe({
        next: data => {
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
          this.listasService.desasignarLista(this.lista!.id, this.usuarioActual).subscribe({
            next: data => {
              if (data.exito) {
                this.volverAListasYAmigos.emit();
              }
            }
          });
        }
      });
    }
  }

  cambiarVisibilidad() {
    if (this.lista) {
      const nuevaVisibilidad = !this.lista.publica;
      this.listasService.cambiarVisibilidadLista(this.lista.id, this.usuarioActual, nuevaVisibilidad).subscribe({
        next: data => {
          if (data.exito) {
            this.lista!.publica = nuevaVisibilidad;
          }
        }
      });
    }
  }

  invitarAmigo(amigoId: number, amigoNombre: string) {
    if (this.lista) {
      this.listasService.invitarAmigo(this.lista.id, amigoId, this.usuarioActual).subscribe({
        next: data => {
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
        next: data => {
          if (data.exito) {
            this.obtenerElementosLista(this.lista!.id);
            this.elementosEncontrados = [];
            this.noSeEncontraronElementos = false;
            this.nombreElementoBuscar = '';
            this.onNombreElementoBuscarChange();
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
        next: data => {
          if (data.exito) {
            this.elementos = this.elementos.filter(elemento => elemento.id !== elementoId);
          }
        }
      });
    }
  }

  likeElemento(elemento: Elemento) {
    if (this.lista) {
      this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, true).subscribe({
        next: data => {
          if (data.exito) {
            elemento.positivo = true;
          }
        }
      });
    }
  }

  dislikeElemento(elemento: Elemento) {
    if (this.lista) {
      this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, false).subscribe({
        next: data => {
          if (data.exito) {
            elemento.positivo = false;
          }
        }
      });
    }
  }

  resetLikeDislikeElemento(elemento: Elemento) {
    if (this.lista) {
      this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, null).subscribe({
        next: data => {
          if (data.exito) {
            elemento.positivo = null;
          }
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
      if (result !== undefined && this.lista) {
        this.elementosService.actualizarComentario(this.lista.id, elemento.id, result).subscribe({
          next: data => {
            if (data.exito) {
              elemento.comentario = result;
            }
          }
        });
      }
    });
  }

  salirDelInput() {
    this.resetInput(this.nombreAmigoBuscar, this.nombreAmigoBuscarInput, this.autocompleteTrigger);
  }

  salirDelInputElemento() {
    this.nombreElementoBuscar = '';
    this.elementosEncontrados = [];
    this.nombreElementoBuscarInput.nativeElement.blur();
    this.autocompleteTriggerElemento.closePanel();
  }

  resetInput(nombre: string, input: ElementRef, trigger: MatAutocompleteTrigger) {
    if (nombre && nombre.trim() === '') {
      input.nativeElement.blur();
    } else {
      nombre = '';
      setTimeout(() => trigger?.openPanel(), 0);
    }
  }

  agregarElementoSinEscribir(event: any) {
    const elemento = event.option.value;
    if (elemento && elemento.id) {
      this.agregarElemento(elemento.id);
      this.nombreElementoBuscar = '';
      this.elementosEncontrados = [];
    }
  }

  mostrarFormulario() {
    const nombreElemento = this.nombreElementoBuscar?.trim() || '';
    const dialogRef = this.dialog.open(CrearElementoDialogComponent, {
      width: '400px',
      data: { nombre: nombreElemento }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crearElemento(result);
      }
      this.nombreElementoBuscarInput.nativeElement.blur();
      if (this.autocompleteTriggerElemento) {
        this.autocompleteTriggerElemento.closePanel();
      }
      this.mostrarBotonCrear = false;
    });
  }

  crearElemento(datos: any) {
    const usuarioId = localStorage.getItem('id');
    if (!usuarioId) {
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
      next: data => {
        if (data.exito) {
          this.elementos.push(data.elemento);
          this.noSeEncontraronElementos = false;
          if (this.lista) {
            this.agregarElemento(data.elemento.id);
          }
          this.nombreElementoBuscar = '';
          this.elementosEncontrados = [];
          this.mostrarBotonCrear = false;
        }
      },
      error: error => {
      }
    });
  }
}