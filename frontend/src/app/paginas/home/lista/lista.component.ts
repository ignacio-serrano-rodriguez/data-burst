import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListasService } from '../../../servicios/listas.service';
import { Lista } from '../../../interfaces/Lista';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit {

  private listasService = inject(ListasService);
  @Input() listaId: number | null = null;
  lista: Lista | undefined;

  ngOnInit(): void {
    if (this.listaId) {
      this.obtenerLista(this.listaId);
    }
  }

  obtenerLista(id: number) {
    this.listasService.obtenerLista(id).subscribe({
      next: (data) => {
        if (data.exito == true) {
          this.lista = data.lista;
        }
      },
      error: (error) => {
        console.error('Error al obtener la lista:', error);
      }
    });
  }
}