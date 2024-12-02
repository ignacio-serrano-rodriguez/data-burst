import { Component, OnInit, Input, Output, EventEmitter, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'; // Importar MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Importar MatInputModule
import { ListasService } from '../../../servicios/listas.service';
import { AmigosService } from '../../../servicios/amigos.service';
import { Lista } from '../../../interfaces/Lista';
import { Elemento } from '../../../interfaces/Elemento';
import { AgregadorComponent } from '../agregador/agregador.component';
import { ConfirmacionDialogComponent } from './confirmacion-dialog/confirmacion-dialog.component'; // Importar el componente de confirmación
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
    MatInputModule // Agregar MatInputModule a los imports
  ],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Agregar CUSTOM_ELEMENTS_SCHEMA
})
export class ListaComponent implements OnInit {

  private listasService = inject(ListasService);
  private amigosService = inject(AmigosService);
  private dialog = inject(MatDialog);
  @Input() listaId: number | null = null;
  @Output() volverAListasYAmigos = new EventEmitter<void>();
  lista: Lista | undefined;
  elementos: Elemento[] = [];
  amigos: any[] = [];
  colaboradores: any[] = []; // Nueva variable para almacenar los colaboradores
  mostrarAgregadorComponent = false;
  mostrarColaborarComponent = false; // Nueva variable para mostrar/ocultar la sección de colaborar
  editandoNombre = false;
  nuevoNombreLista = '';
  nombreAmigoBuscar: string = '';
  amigosEncontrados: any[] = [];
  noSeEncontraronAmigos = false;

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
    this.listasService.obtenerLista(id).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.lista = data.lista;
          this.nuevoNombreLista = this.lista.nombre; // Inicializar el nuevo nombre con el nombre actual
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
          this.elementos = data.elementos;
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
      this.listasService.cambiarVisibilidadLista(this.lista.id, nuevaVisibilidad).subscribe({
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
            console.log('Petición ya enviada');
            this.mostrarMensajeNegativo(`Petición ya enviada. (${amigoNombre})`); // Mostrar el mensaje informativo con el nombre del usuario
          }
        },
        error: (error) => {
          console.error('Error al enviar la invitación:', error);
          this.mostrarMensajeNegativo(`Petición ya enviada. (${amigoNombre})`); // Mostrar el mensaje informativo con el nombre del usuario
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

  likeElemento(elementoId: number) {
    console.log(`Like elemento ${elementoId}`);
    // Lógica para manejar el like
  }

  dislikeElemento(elementoId: number) {
    console.log(`Dislike elemento ${elementoId}`);
    // Lógica para manejar el dislike
  }

  comentarElemento(elementoId: number) {
    console.log(`Comentar elemento ${elementoId}`);
    // Lógica para manejar los comentarios
  }

  informacionElemento(elementoId: number) {
    console.log(`Información elemento ${elementoId}`);
    // Lógica para mostrar la información del elemento
  }

  eliminarElemento(elementoId: number) {
    console.log(`Eliminar elemento ${elementoId}`);
    // Lógica para eliminar el elemento
  }
}