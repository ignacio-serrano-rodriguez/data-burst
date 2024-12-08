import { Component, OnInit, Input, Output, EventEmitter, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListasService } from '../../../servicios/listas.service';
import { ElementosService } from '../../../servicios/elementos.service';
import { AmigosService } from '../../../servicios/amigos.service';
import { Lista } from '../../../interfaces/Lista';
import { Elemento } from '../../../interfaces/Elemento';
import { AgregadorComponent } from './agregador/agregador.component';
import { ConfirmacionDialogComponent } from './confirmacion-dialog/confirmacion-dialog.component';
import { ComentarioDialogComponent } from './comentario-dialog/comentario-dialog.component';
import { MensajeDialogoComponent } from './mensaje-dialog/mensaje-dialogo.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    AgregadorComponent,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListaComponent implements OnInit {

  private listasService = inject(ListasService);
  private elementosService = inject(ElementosService);
  private amigosService = inject(AmigosService);
  private dialog = inject(MatDialog);
  @Input() listaId: number | null = null;
  @Output() volverAListasYAmigos = new EventEmitter<void>();
  lista: Lista | undefined;
  elementos: Elemento[] = [];
  elementosLikeDislike: { [key: number]: boolean | null } = {};
  amigos: any[] = [];
  colaboradores: any[] = [];
  mostrarColaborarComponent = false;
  editandoNombre = false;
  nuevoNombreLista = '';
  nombreAmigoBuscar: string = '';
  amigosEncontrados: any[] = [];
  noSeEncontraronAmigos = false;
  usuarioActual: number = Number(localStorage.getItem('id')) || 0;

  private searchSubjectBuscar = new Subject<string>();

  ngOnInit(): void {
    if (this.listaId) {
      this.obtenerLista(this.listaId);
      this.obtenerElementosLista(this.listaId);
    }

    this.searchSubjectBuscar.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.length >= 3) {
        const usuarioID = Number(localStorage.getItem('id')) || 0;
        this.buscarAmigosNoManipulanLista(query, usuarioID, this.listaId!);
      } else {
        this.amigosEncontrados = [];
        this.noSeEncontraronAmigos = false;
      }
    });
  }

  onNombreAmigoBuscarChange() {
    this.searchSubjectBuscar.next(this.nombreAmigoBuscar.trim());
  }

  buscarAmigosNoManipulanLista(query: string, usuarioID: number, listaID: number) {
    this.amigosService.buscarAmigosNoManipulanLista(query, usuarioID, listaID).subscribe({
      next: (data) => {
        if (data.exito) {
          this.amigosEncontrados = data.amigos;
          this.noSeEncontraronAmigos = this.amigosEncontrados.length === 0;
        }
      },
      error: (error) => {
        console.error('Error al buscar amigos:', error);
        this.amigosEncontrados = [];
        this.noSeEncontraronAmigos = true;
      }
    });
  }

  obtenerLista(id: number) {
    const usuarioId = Number(localStorage.getItem('id')) || 0;
    this.listasService.obtenerLista(id, usuarioId).subscribe({
      next: (data) => {
        if (data.exito) {
          this.lista = data.lista;
          this.nuevoNombreLista = this.lista.nombre;
        } else {
          console.error('Error al obtener la lista:', data.mensaje);
        }
      },
      error: (error) => {
        console.error('Error al obtener la lista:', error);
      }
    });
  }

  obtenerElementosLista(id: number) {
    this.listasService.obtenerElementosLista(id).subscribe({
      next: (data) => {
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
      },
      error: (error) => {
        console.error('Error al obtener los elementos de la lista:', error);
      }
    });
  }

  obtenerColaboradores(listaId: number) {
    const usuarioID = Number(localStorage.getItem('id'));
    this.listasService.obtenerColaboradores(listaId).subscribe({
      next: (data) => {
        if (data.exito) {
          this.colaboradores = data.colaboradores.filter(colaborador => colaborador.id !== usuarioID);
        }
      },
      error: (error) => {
        console.error('Error al obtener los colaboradores de la lista:', error);
      }
    });
  }

  volver() {
    this.volverAListasYAmigos.emit();
  }

  toggleColaborar() {
    this.mostrarColaborarComponent = !this.mostrarColaborarComponent;
    if (this.mostrarColaborarComponent && this.listaId) {
      this.obtenerColaboradores(this.listaId);
    }
  }

  editarNombre() {
    this.editandoNombre = true;
  }

  guardarNombre() {
    if (this.lista && this.nuevoNombreLista.trim()) {
      this.listasService.modificarNombreLista(this.lista.id, this.nuevoNombreLista.trim()).subscribe({
        next: (data) => {
          if (data.exito) {
            this.lista!.nombre = this.nuevoNombreLista.trim();
            this.editandoNombre = false;
          } else {
            this.mostrarMensajeNegativo('Error al modificar el nombre de la lista.');
          }
        },
        error: (error) => {
          console.error('Error al modificar el nombre de la lista:', error);
          this.mostrarMensajeNegativo('Error al modificar el nombre de la lista.');
        }
      });
    }
  }

  cancelarEdicion() {
    this.editandoNombre = false;
    this.nuevoNombreLista = this.lista ? this.lista.nombre : '';
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
            next: (data) => {
              if (data.exito) {
                this.volverAListasYAmigos.emit();
              }
            },
            error: (error) => {
              console.error('Error al desasignar la lista:', error);
            }
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
        next: (data) => {
          if (data.exito) {
            this.lista!.publica = nuevaVisibilidad;
          } else {
            this.mostrarMensajeNegativo('Error al cambiar la visibilidad de la lista.');
          }
        },
        error: (error) => {
          console.error('Error al cambiar la visibilidad de la lista:', error);
          this.mostrarMensajeNegativo('Error al cambiar la visibilidad de la lista.');
        }
      });
    }
  }

  invitarAmigo(amigoId: number, amigoNombre: string) {
    const usuarioID = Number(localStorage.getItem('id'));
    if (this.lista) {
      this.listasService.invitarAmigo(this.lista.id, amigoId, usuarioID).subscribe({
        next: (data) => {
          if (data.exito) {
            console.log('Invitación enviada exitosamente');
            this.mostrarMensajeDialogo(`Invitación enviada. (${amigoNombre})`);
            this.amigosEncontrados = []; // Limpiar los resultados de búsqueda
            this.noSeEncontraronAmigos = false; // Ocultar el mensaje de no se encontraron amigos
            this.nombreAmigoBuscar = ''; // Limpiar el input de búsqueda
            this.onNombreAmigoBuscarChange(); // Reiniciar la búsqueda
          } else {
            console.log('Error al enviar la invitación:', data.mensaje);
            this.mostrarMensajeDialogo(`Error al enviar la invitación. (${amigoNombre})`);
            this.amigosEncontrados = []; // Limpiar los resultados de búsqueda
            this.noSeEncontraronAmigos = false; // Ocultar el mensaje de no se encontraron amigos
            this.nombreAmigoBuscar = ''; // Limpiar el input de búsqueda
            this.onNombreAmigoBuscarChange(); // Reiniciar la búsqueda
          }
        },
        error: (error) => {
          console.error('Error al enviar la invitación:', error);
          this.mostrarMensajeDialogo(`Error al enviar la invitación. (${amigoNombre})`);
          this.amigosEncontrados = []; // Limpiar los resultados de búsqueda
          this.noSeEncontraronAmigos = false; // Ocultar el mensaje de no se encontraron amigos
          this.nombreAmigoBuscar = ''; // Limpiar el input de búsqueda
          this.onNombreAmigoBuscarChange(); // Reiniciar la búsqueda
        }
      });
    }
  }

  mostrarMensajeDialogo(mensaje: string) {
    this.dialog.open(MensajeDialogoComponent, {
      data: { mensaje }
    });
  }

  mostrarMensajePositivo(mensaje: string) {
    const mensajeInformativo = document.getElementById('mensajeInformativo');
    if (mensajeInformativo) {
      mensajeInformativo.innerText = mensaje;
      mensajeInformativo.classList.add('mensaje-positivo');
      mensajeInformativo.classList.remove('mensaje-negativo');
      setTimeout(() => {
        mensajeInformativo.textContent = '';
      }, 3000);
    }
  }

  mostrarMensajeNegativo(mensaje: string) {
    const mensajeInformativo = document.getElementById('mensajeInformativo');
    if (mensajeInformativo) {
      mensajeInformativo.innerText = mensaje;
      mensajeInformativo.classList.add('mensaje-negativo');
      mensajeInformativo.classList.remove('mensaje-positivo');
      setTimeout(() => {
        mensajeInformativo.textContent = '';
      }, 3000);
    }
  }

  eliminarElemento(elementoId: number) {
    if (this.lista) {
      this.elementosService.quitarElemento(this.lista.id, elementoId).subscribe({
        next: (data) => {
          if (data.exito) {
            console.log('Elemento desasignado exitosamente');
            this.obtenerElementosLista(this.lista?.id!);
          } else {
            console.log('Error al desasignar el elemento');
            this.mostrarMensajeNegativo('Error al desasignar el elemento.');
          }
        },
        error: (error) => {
          console.error('Error al desasignar el elemento:', error);
          this.mostrarMensajeNegativo('Error al desasignar el elemento.');
        }
      });
    }
  }

  likeElemento(elemento: Elemento) {
    if (this.lista) {
      this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, true).subscribe({
        next: (data) => {
          if (data.exito) {
            elemento.positivo = true;
          } else {
            console.log('Error al cambiar el estado de like');
          }
        },
        error: (error) => {
          console.error('Error al cambiar el estado de like:', error);
        }
      });
    }
  }

  dislikeElemento(elemento: Elemento) {
    if (this.lista) {
      this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, false).subscribe({
        next: (data) => {
          if (data.exito) {
            elemento.positivo = false;
          } else {
            console.log('Error al cambiar el estado de dislike');
          }
        },
        error: (error) => {
          console.error('Error al cambiar el estado de dislike:', error);
        }
      });
    }
  }

  resetLikeDislikeElemento(elemento: Elemento) {
    if (this.lista) {
      this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, null).subscribe({
        next: (data) => {
          if (data.exito) {
            elemento.positivo = null;
          } else {
            console.log('Error al resetear el estado de like/dislike');
          }
        },
        error: (error) => {
          console.error('Error al resetear el estado de like/dislike:', error);
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
        console.log(`Comentario para el elemento ${elemento.id}: ${result}`);
        if (this.lista) {
          this.elementosService.actualizarComentario(this.lista.id, elemento.id, result).subscribe({
            next: (data) => {
              if (data.exito) {
                console.log('Comentario actualizado exitosamente');
                elemento.comentario = result;
              } else {
                console.log('Error al actualizar el comentario');
              }
            },
            error: (error) => {
              console.error('Error al actualizar el comentario:', error);
            }
          });
        }
      }
    });
  }
}