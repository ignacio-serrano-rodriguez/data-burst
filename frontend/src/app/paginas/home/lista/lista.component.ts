import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ListasService } from '../../../servicios/listas.service';
import { AmigosService } from '../../../servicios/amigos.service';
import { Lista } from '../../../interfaces/Lista';
import { Elemento } from '../../../interfaces/Elemento';
import { AgregadorComponent } from '../agregador/agregador.component';
import { ConfirmacionDialogComponent } from './confirmacion-dialog/confirmacion-dialog.component'; // Importar el componente de confirmación
import { FormsModule } from '@angular/forms'; // Importar FormsModule

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, AgregadorComponent, FormsModule, MatDialogModule],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
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
  mostrarAgregadorComponent = false;
  editandoNombre = false;
  nuevoNombreLista = '';

  ngOnInit(): void {
    if (this.listaId) {
      this.obtenerLista(this.listaId);
      this.obtenerElementosLista(this.listaId);
      this.obtenerAmigos();
    }
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

  obtenerAmigos() {
    const usuarioID = Number(localStorage.getItem('id'));
    this.amigosService.obtenerAmigos(usuarioID).subscribe({
      next: (data) => {
        if (data.exito) {
          this.amigos = data.amigos;
        }
      },
      error: (error) => {
        console.error('Error al obtener amigos:', error);
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
          }
        },
        error: (error) => {
          console.error('Error al modificar el nombre de la lista:', error);
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
      this.listasService.cambiarVisibilidadLista(this.lista.id, nuevaVisibilidad).subscribe({
        next: (data) => {
          if (data.exito) {
            this.lista!.publica = nuevaVisibilidad;
          }
        },
        error: (error) => {
          console.error('Error al cambiar la visibilidad de la lista:', error);
        }
      });
    }
  }

  invitarAmigo(amigoId: number) {
    if (this.lista) {
      this.listasService.invitarAmigo(this.lista.id, amigoId).subscribe({
        next: (data) => {
          if (data.exito) {
            console.log('Invitación enviada exitosamente');
          }
        },
        error: (error) => {
          console.error('Error al enviar la invitación:', error);
        }
      });
    }
  }
}