import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ListasService } from '../../../servicios/listas.service';
import { Lista } from '../../../interfaces/Lista';

@Component({
  selector: 'app-amigo-detalle',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './amigo.component.html',
  styleUrls: ['./amigo.component.css']
})
export class AmigoComponent implements OnInit {
  private listasService = inject(ListasService);

  @Input() amigo!: { id: number, nombre: string };
  @Output() volverEvent = new EventEmitter<void>();
  @Output() listaSeleccionada = new EventEmitter<Lista>();

  listas: Lista[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    if (this.amigo && this.amigo.id) {
      this.cargarListasPublicasAmigo();
    }
  }

  cargarListasPublicasAmigo(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.listasService.obtenerListasPublicasAmigo(this.amigo.id).subscribe({
      next: (response) => {
        if (response.exito) {
          this.listas = response.listas;
        } else {
          this.errorMessage = response.mensaje || 'No se pudieron cargar las listas';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar listas públicas del amigo:', error);
        this.errorMessage = 'Error al cargar las listas. Inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  volver(): void {
    this.volverEvent.emit();
  }

  seleccionarLista(lista: Lista): void {
    this.listaSeleccionada.emit(lista);
  }
}