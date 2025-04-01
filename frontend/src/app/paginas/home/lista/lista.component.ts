import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ListasService } from '../../../servicios/listas.service';
import { ElementosService } from '../../../servicios/elementos.service';
import { AmigosService } from '../../../servicios/amigos.service';
import { Lista } from '../../../interfaces/Lista';
import { Elemento } from '../../../interfaces/Elemento';
import { ConfirmacionDialogComponent } from './confirmacion-dialog/confirmacion-dialog.component';
import { ComentarioDialogComponent } from './comentario-dialog/comentario-dialog.component';
import { CrearElementoDialogComponent } from './crear-elemento-dialog/crear-elemento-dialog.component';
import { InformacionElementoDialogComponent } from './informacion-dialog/informacion-elemento-dialog.component';

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
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatExpansionModule,
    MatSnackBarModule
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
  @Input() readOnly: boolean = false;

  elementos: Elemento[] = [];
  colaboradores: any[] = [];
  amigosEncontrados: any[] = [];
  elementosEncontrados: any[] = [];

  mostrarColaborarComponent = false;
  editandoNombre = false;
  mostrarBotonCrear = false;
  listaPublica: boolean = false;

  nuevoNombreLista = '';
  nombreAmigoBuscar: string = '';
  nombreElementoBuscar: string = '';

  usuarioActual: number = Number(localStorage.getItem('id')) || 0;

  private searchSubjectBuscar = new Subject<string>();
  private searchSubjectElemento = new Subject<string>();

  constructor(
    private listasService: ListasService,
    private elementosService: ElementosService,
    private amigosService: AmigosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.lista) {
      this.nuevoNombreLista = this.lista.nombre;
      this.listaPublica = this.lista.publica;

      if (!this.lista.categoria) {
        this.fetchListCategory();
      }

      this.obtenerElementosLista(this.lista.id);
      this.obtenerColaboradores(this.lista.id);
      this.setupSearchSubjects();
    }
  }

  ngAfterViewInit(): void {
    if (this.editandoNombre) {
      this.nombreListaInput.nativeElement.focus();
    }
  }

  private fetchListCategory(): void {
    if (!this.lista) return;

    this.listasService.obtenerLista(this.lista.id, this.usuarioActual).subscribe({
      next: response => {
        if (response.exito && response.lista?.categoria) {
          this.lista!.categoria = response.lista.categoria;
        }
      },
      error: error => console.error('Error fetching list details:', error)
    });
  }

  private setupSearchSubjects(): void {
    this.searchSubjectBuscar.pipe(
      debounceTime(100),
      distinctUntilChanged()
    ).subscribe(query => this.buscarAmigos(query));

    this.searchSubjectElemento.pipe(
      debounceTime(100),
      distinctUntilChanged()
    ).subscribe(query => this.buscarElementos(query));
  }

  volver(): void {
    this.volverAListasYAmigos.emit();
  }

  editarNombre(): void {
    this.editandoNombre = true;
    setTimeout(() => this.nombreListaInput.nativeElement.focus(), 0);
  }

  guardarNombre(): void {
    if (!this.lista || !this.nuevoNombreLista.trim()) return;

    this.listasService.modificarNombreLista(this.lista.id, this.nuevoNombreLista.trim()).subscribe({
      next: data => {
        if (data.exito) {
          this.lista!.nombre = this.nuevoNombreLista.trim();
          this.editandoNombre = false;
        }
      }
    });
  }

  cancelarEdicion(): void {
    this.editandoNombre = false;
    if (this.lista) {
      this.nuevoNombreLista = this.lista.nombre;
    }
  }

  toggleEditarNombre(): void {
    this.editandoNombre ? this.cancelarEdicion() : this.editarNombre();
  }

  toggleColaborar(): void {
    this.mostrarColaborarComponent = !this.mostrarColaborarComponent;
    if (this.mostrarColaborarComponent && this.lista) {
      this.obtenerColaboradores(this.lista.id);
    }
  }

  eliminarLista(): void {
    if (!this.lista) return;

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

  cambiarVisibilidad(event: any): void {
    if (!this.lista) return;

    const nuevaVisibilidad = event.checked;
    this.listasService.cambiarVisibilidadLista(this.lista.id, this.usuarioActual, nuevaVisibilidad).subscribe({
      next: data => {
        if (data.exito) {
          this.lista!.publica = nuevaVisibilidad;
          this.listaPublica = nuevaVisibilidad;
        }
      }
    });
  }

  obtenerElementosLista(id: number): void {
    this.listasService.obtenerElementosLista(id).subscribe({
      next: data => {
        if (data.exito) {
          const usuarioId = this.usuarioActual;
          this.elementos = data.elementos.map(elemento => {
            const commentsPuntuaciones = elemento.usuariosComentariosPuntuaciones || [];
            const userReview = commentsPuntuaciones.find(u => u.usuario_id === usuarioId);

            return {
              ...elemento,
              puntuacion: userReview?.puntuacion !== undefined ? userReview.puntuacion : null,
              comentario: userReview?.comentario || '',
              usuariosComentariosPuntuaciones: commentsPuntuaciones.filter(u => u.usuario_id !== usuarioId)
            };
          });
        }
      },
      error: err => console.error('Error fetching list elements:', err)
    });
  }

  buscarElementos(query: string): void {
    if (!query || query.trim().length < 3) {
      this.elementosEncontrados = [];
      this.mostrarBotonCrear = !!query && query.trim().length > 0;
      return;
    }

    if (this.lista) {
      this.elementosService.buscarElementos(query, this.lista.id).subscribe({
        next: data => {
          this.elementosEncontrados = data.elementos;
          this.mostrarBotonCrear = true;
        },
        error: () => {
          this.elementosEncontrados = [];
          this.mostrarBotonCrear = true;
        }
      });
    }
  }

  agregarElemento(elementoId: number): void {
    if (!this.lista) return;

    this.elementosService.asignarElemento(this.lista.id, elementoId).subscribe({
      next: data => {
        if (data.exito) {
          this.obtenerElementosLista(this.lista!.id);
          this.resetElementSearch();
        }
      },
      error: () => this.resetElementSearch()
    });
  }

  eliminarElemento(elementoId: number): void {
    if (!this.lista) return;

    this.elementosService.quitarElemento(this.lista.id, elementoId).subscribe({
      next: data => {
        if (data.exito) {
          this.elementos = this.elementos.filter(elemento => elemento.id !== elementoId);
        }
      }
    });
  }

  mostrarFormulario(): void {
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

  crearElemento(datos: any): void {
    if (!this.lista) return;

    const nuevoElemento: any = {
      nombre: datos.nombre,
      fecha_aparicion: datos.fechaAparicion,
      descripcion: datos.descripcion,
      usuario_id: this.usuarioActual,
      lista_id: this.lista.id
    };

    this.elementosService.crearElemento(nuevoElemento).subscribe({
      next: data => {
        if (data.exito) {
          this.agregarElemento(data.elemento.id);
          this.nombreElementoBuscar = '';
        }
      },
      error: error => console.error('Error creating element:', error)
    });
  }

  mostrarInformacionElemento(elemento: any): void {
    if (!this.lista) return;

    const dialogRef = this.dialog.open(InformacionElementoDialogComponent, {
      width: '500px',
      data: {
        elemento: elemento,
        listaId: this.lista.id,
        mostrarBotonAgregar: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.agregado) {
        this.obtenerElementosLista(this.lista!.id);
        this.nombreElementoBuscar = '';
        this.elementosEncontrados = [];
      }
    });
  }

  mostrarInformacionElementoExistente(elemento: any): void {
    if (!this.lista) return;

    this.dialog.open(InformacionElementoDialogComponent, {
      width: '500px',
      data: {
        elemento: elemento,
        listaId: this.lista.id,
        mostrarBotonAgregar: false
      }
    });
  }

  likeElemento(elemento: Elemento): void {
    this.toggleElementRating(elemento, true);
  }

  dislikeElemento(elemento: Elemento): void {
    this.toggleElementRating(elemento, false);
  }

  resetLikeDislikeElemento(elemento: Elemento): void {
    this.toggleElementRating(elemento, null);
  }

  private toggleElementRating(elemento: Elemento, rating: boolean | null): void {
    if (!this.lista) return;

    this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, rating).subscribe({
      next: data => {
        if (data.exito) {
          elemento.puntuacion = rating;
        }
      }
    });
  }

  comentarElemento(elemento: Elemento): void {
    if (!this.lista) return;

    const dialogRef = this.dialog.open(ComentarioDialogComponent, {
      width: '250px',
      data: { elementoId: elemento.id, comentario: elemento.comentario || '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.elementosService.actualizarComentario(this.lista!.id, elemento.id, result).subscribe({
          next: data => {
            if (data.exito) {
              elemento.comentario = result;
            }
          }
        });
      }
    });
  }

  obtenerColaboradores(listaId: number): void {
    this.listasService.obtenerColaboradores(listaId).subscribe({
      next: data => {
        if (data.exito) {
          this.colaboradores = data.colaboradores.filter(
            colaborador => colaborador.id !== this.usuarioActual
          );
        }
      }
    });
  }

  buscarAmigos(query: string): void {
    if (query.length < 3) {
      this.amigosEncontrados = [];
      return;
    }

    if (!this.lista) return;

    this.amigosService.buscarAmigosNoManipulanLista(query, this.usuarioActual, this.lista.id)
      .subscribe({
        next: data => {
          this.amigosEncontrados = data.amigos;

          const matchingColaboradores = this.colaboradores.filter(col =>
            col.nombre.toLowerCase().includes(query.toLowerCase())
          );

          matchingColaboradores.forEach(col => {
            if (!this.amigosEncontrados.some(a => a.id === col.id)) {
              this.amigosEncontrados.push({
                id: col.id,
                nombre: col.nombre,
                tieneInvitacion: 0,
                esColaborador: true
              });
            }
          });
        },
        error: () => {
          this.amigosEncontrados = [];
        }
      });
  }

  invitarAmigo(amigoId: number, amigoNombre: string): void {
    if (!this.lista) return;

    const amigo = this.amigosEncontrados.find(a => a.id === amigoId);
    if (amigo && amigo.tieneInvitacion) {
      return;
    }

    this.listasService.invitarAmigo(this.lista.id, amigoId, this.usuarioActual).subscribe({
      next: data => {
        if (data.exito) {
          const amigo = this.amigosEncontrados.find(a => a.id === amigoId);
          if (amigo) {
            amigo.tieneInvitacion = true;
          }

          this.snackBar.open(`Invitación enviada a ${amigoNombre}`, 'Cerrar', {
            duration: 3000
          });

          this.resetFriendSearch();
        }
      },
      error: () => this.resetFriendSearch()
    });
  }

  onNombreAmigoBuscarChange(): void {
    if (!this.nombreAmigoBuscar || this.nombreAmigoBuscar.trim() === '') {
      this.mostrarColaboradores();
    } else {
      this.searchSubjectBuscar.next(this.nombreAmigoBuscar.trim());
    }
    this.autocompleteTrigger?.openPanel();
  }

  onNombreElementoBuscarChange(): void {
    this.searchSubjectElemento.next(this.nombreElementoBuscar.trim());
    this.autocompleteTriggerElemento?.openPanel();
  }

  abrirDesplegable(): void {
    if (!this.nombreAmigoBuscar || this.nombreAmigoBuscar.trim() === '') {
      this.mostrarColaboradores();
    }
    this.autocompleteTrigger?.openPanel();
  }

  abrirDesplegableElemento(): void {
    this.mostrarBotonCrear = true;
    this.autocompleteTriggerElemento?.openPanel();
  }

  salirDelInput(): void {
    if (!this.nombreAmigoBuscar || this.nombreAmigoBuscar.trim() === '') {
      this.nombreAmigoBuscarInput.nativeElement.blur();
    } else {
      this.nombreAmigoBuscar = '';
      setTimeout(() => this.autocompleteTrigger?.openPanel(), 0);
    }
  }

  salirDelInputElemento(): void {
    this.nombreElementoBuscar = '';
    this.elementosEncontrados = [];
    this.nombreElementoBuscarInput.nativeElement.blur();
    this.autocompleteTriggerElemento.closePanel();
  }

  resetBusquedaElemento(): void {
    this.nombreElementoBuscar = '';
    this.elementosEncontrados = [];
    this.nombreElementoBuscarInput.nativeElement.focus();
    this.autocompleteTriggerElemento?.openPanel();
  }

  private resetFriendSearch(): void {
    this.amigosEncontrados = [];
    this.nombreAmigoBuscar = '';
    this.onNombreAmigoBuscarChange();
  }

  private resetElementSearch(): void {
    this.elementosEncontrados = [];
    this.nombreElementoBuscar = '';
    this.onNombreElementoBuscarChange();
  }

  obtenerTituloBotonCerrarAmigo(): string {
    return (!this.nombreAmigoBuscar || this.nombreAmigoBuscar.trim() === '')
      ? "Cancelar búsqueda"
      : "Limpiar entrada";
  }

  obtenerTituloBotonCerrarElemento(): string {
    return (!this.nombreElementoBuscar || this.nombreElementoBuscar.trim() === '')
      ? "Cancelar búsqueda"
      : "Limpiar entrada";
  }

  obtenerTituloBotonLike(elemento: Elemento): string {
    return elemento.puntuacion === true ? "Te gusta" : "Me gusta";
  }

  obtenerTituloBotonDislike(elemento: Elemento): string {
    return elemento.puntuacion === false ? "No te gusta" : "No me gusta";
  }

  obtenerTituloBotonHelp(elemento: Elemento): string {
    return elemento.puntuacion === null ? "Sin opinión" : "Eliminar opinión";
  }

  agregarElementoSinEscribir(event: any): void {
    this.handleElementoSeleccionado(event);
  }

  handleElementoSeleccionado(event: any): void {
    const selectedElementName = event.option.value;

    if (selectedElementName === '__crear__' && !this.readOnly) {
      this.mostrarFormulario();
      return;
    }

    const selectedElement = this.elementosEncontrados.find(
      elemento => elemento.nombre === selectedElementName
    );

    if (selectedElement) {
      if (this.readOnly) {
        this.mostrarInformacionElementoExistente(selectedElement);
      } else {
        this.mostrarInformacionElemento(selectedElement);
      }
    }

    setTimeout(() => {
      this.nombreElementoBuscar = '';
      this.mostrarBotonCrear = false;
    }, 100);
  }

  mostrarColaboradores(): void {
    // Reset the search results
    this.amigosEncontrados = [];

    // Add all collaborators to the results list
    if (this.colaboradores && this.colaboradores.length > 0) {
      this.colaboradores.forEach(col => {
        this.amigosEncontrados.push({
          id: col.id,
          nombre: col.nombre,
          tieneInvitacion: 0,
          esColaborador: true
        });
      });
    }
  }
}