import { Component, OnInit, Input, Output, EventEmitter, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'; // Importar MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Importar MatInputModule
import { ListasService } from '../../../servicios/listas.service';
import { ElementosService } from '../../../servicios/elementos.service'; // Importar ElementosService
import { AmigosService } from '../../../servicios/amigos.service';
import { Lista } from '../../../interfaces/Lista';
import { Elemento } from '../../../interfaces/Elemento';
import { AgregadorComponent } from '../agregador/agregador.component';
import { ConfirmacionDialogComponent } from './confirmacion-dialog/confirmacion-dialog.component'; // Importar el componente de confirmación
import { ComentarioDialogComponent } from './comentario-dialog/comentario-dialog.component'; // Importar el componente de diálogo de comentarios
import { FormsModule } from '@angular/forms'; // Importar FormsModule
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
    MatFormFieldModule, // Agregar MatFormFieldModule a los imports
    MatInputModule, // Agregar MatInputModule a los imports
    ComentarioDialogComponent // Agregar ComentarioDialogComponent a los imports
  ],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Agregar CUSTOM_ELEMENTS_SCHEMA
})
export class ListaComponent implements OnInit {

  private listasService = inject(ListasService);
  private elementosService = inject(ElementosService); // Inyectar ElementosService
  private amigosService = inject(AmigosService);
  private dialog = inject(MatDialog);
  @Input() listaId: number | null = null;
  @Output() volverAListasYAmigos = new EventEmitter<void>();
  lista: Lista | undefined;
  elementos: Elemento[] = [];
  elementosLikeDislike: { [key: number]: boolean | null } = {}; // Objeto auxiliar para mantener el estado de like/dislike
  amigos: any[] = [];
  colaboradores: any[] = []; // Nueva variable para almacenar los colaboradores
  mostrarAgregadorComponent = false;
  mostrarColaborarComponent = false; // Nueva variable para mostrar/ocultar la sección de colaborar
  editandoNombre = false;
  nuevoNombreLista = '';
  nombreAmigoBuscar: string = '';
  amigosEncontrados: any[] = [];
  noSeEncontraronAmigos = false;
  usuarioActual: number = Number(localStorage.getItem('id')) || 0; // Definir la propiedad usuarioActual

  private searchSubjectBuscar = new Subject<string>();

  ngOnInit(): void {
    if (this.listaId) {
      this.obtenerLista(this.listaId);
      this.obtenerElementosLista(this.listaId);
    }

    this.searchSubjectBuscar.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
      distinctUntilChanged() // Emitir solo si el valor es diferente al anterior
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
          this.nuevoNombreLista = this.lista.nombre; // Inicializar el nuevo nombre con el nombre actual
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
    const usuarioID = Number(localStorage.getItem('id')); // Obtener el ID del usuario desde el almacenamiento local
    this.listasService.obtenerColaboradores(listaId).subscribe({
      next: (data) => {
        if (data.exito) {
          this.colaboradores = data.colaboradores.filter(colaborador => colaborador.id !== usuarioID); // Filtrar para excluir al usuario actual
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

  mostrarAgregador() {
    this.mostrarAgregadorComponent = true;
  }

  ocultarAgregador() {
    this.mostrarAgregadorComponent = false;
    if (this.listaId) {
      this.obtenerElementosLista(this.listaId);
    }
  }

  mostrarColaborar() {
    this.mostrarColaborarComponent = true;
    if (this.listaId) {
      this.obtenerColaboradores(this.listaId); // Obtener los colaboradores cuando se muestra la sección de colaborar
    }
  }

  ocultarColaborar() {
    this.mostrarColaborarComponent = false;
    this.amigosEncontrados = [];
    this.noSeEncontraronAmigos = false;
    this.nombreAmigoBuscar = '';
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
            this.mostrarMensajePositivo('Nombre de la lista modificado exitosamente.');
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
          const usuarioID = Number(localStorage.getItem('id')); // Obtener el ID del usuario desde el almacenamiento local
          this.listasService.desasignarLista(this.lista!.id, usuarioID).subscribe({
            next: (data) => {
              if (data.exito) {
                this.volverAListasYAmigos.emit(); // Volver a la vista de listas y amigos
                this.mostrarMensajePositivo('Lista eliminada exitosamente.');
              } else {
                this.mostrarMensajeNegativo('Error al eliminar la lista.');
              }
            },
            error: (error) => {
              console.error('Error al desasignar la lista:', error);
              this.mostrarMensajeNegativo('Error al eliminar la lista.');
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
            this.mostrarMensajePositivo('Visibilidad de la lista cambiada exitosamente.');
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
    const usuarioID = Number(localStorage.getItem('id')); // Obtener el ID del usuario desde el almacenamiento local
    if (this.lista) {
      this.listasService.invitarAmigo(this.lista.id, amigoId, usuarioID).subscribe({
        next: (data) => {
          if (data.exito) {
            console.log('Invitación enviada exitosamente');
            this.mostrarMensajePositivo(`Invitación enviada. (${amigoNombre})`); // Mostrar el mensaje informativo con el nombre del usuario
          } else {
            console.log('Error al enviar la invitación:', data.mensaje);
            this.mostrarMensajeNegativo(`Error al enviar la invitación. (${amigoNombre})`); // Mostrar el mensaje informativo con el nombre del usuario
          }
        },
        error: (error) => {
          console.error('Error al enviar la invitación:', error);
          this.mostrarMensajeNegativo(`Error al enviar la invitación. (${amigoNombre})`); // Mostrar el mensaje informativo con el nombre del usuario
        }
      });
    }
  }

  mostrarMensajePositivo(mensaje: string) {
    const mensajeInformativo = document.getElementById('mensajeInformativo');
    if (mensajeInformativo) {
      mensajeInformativo.innerText = mensaje;
      mensajeInformativo.classList.add('mensaje-positivo');
      mensajeInformativo.classList.remove('mensaje-negativo');
      setTimeout(() => {
        mensajeInformativo.textContent = '';
      }, 3000); // Limpiar el mensaje después de 3 segundos
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
      }, 3000); // Limpiar el mensaje después de 3 segundos
    }
  }

  eliminarElemento(elementoId: number) {
    if (this.lista) {
      this.elementosService.quitarElemento(this.lista.id, elementoId).subscribe({
        next: (data) => {
          if (data.exito) {
            console.log('Elemento desasignado exitosamente');
            this.mostrarMensajePositivo('Elemento desasignado exitosamente.');
            this.obtenerElementosLista(this.lista?.id!); // Actualizar la lista de elementos
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

  toggleLikeDislike(elemento: Elemento) {
    let nuevoEstado: boolean | null;
    if (elemento.positivo === null) {
      nuevoEstado = true; // Si es null, cambiar a like
    } else if (elemento.positivo === true) {
      nuevoEstado = false; // Si es like, cambiar a dislike
    } else {
      nuevoEstado = null; // Si es dislike, cambiar a null
    }

    if (this.lista) {
      this.elementosService.toggleLikeDislike(this.lista.id, elemento.id, nuevoEstado).subscribe({
        next: (data) => {
          if (data.exito) {
            elemento.positivo = nuevoEstado; // Actualizar el valor de positivo en el elemento
          } else {
            console.log('Error al cambiar el estado de like/dislike');
          }
        },
        error: (error) => {
          console.error('Error al cambiar el estado de like/dislike:', error);
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
                elemento.comentario = result; // Actualizar el comentario en el elemento
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