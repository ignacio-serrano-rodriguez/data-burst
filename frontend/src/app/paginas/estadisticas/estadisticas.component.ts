import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { EstadisticasService } from '../../servicios/estadisticas.service';

interface Estadistica {
  orden: number;
  masAgregado: string;
  masGustado: string;
  menosGustado: string;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  categoria: string = '';
  displayedColumns: string[] = ['orden', 'masAgregado', 'masGustado', 'menosGustado'];
  dataSource: Estadistica[] = [];
  noEstadisticas: boolean = false;

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit(): void { }

  obtenerEstadisticas(): void {
    this.estadisticasService.generarEstadisticas(this.categoria).subscribe(
      data => {
        this.dataSource = this.combinarDatos(data.masAgregado, data.masGustado, data.menosGustado);
        this.noEstadisticas = this.dataSource.length === 0;
      },
      error => {
        console.error('Error al generar estadísticas:', error);
        this.noEstadisticas = true;
      }
    );
  }

  combinarDatos(masAgregado: any[], masGustado: any[], menosGustado: any[]): Estadistica[] {
    const maxLength = Math.max(masAgregado.length, masGustado.length, menosGustado.length);
    const combinedData: Estadistica[] = [];

    for (let i = 0; i < maxLength; i++) {
      combinedData.push({
        orden: i + 1,
        masAgregado: masAgregado[i] ? masAgregado[i].nombre : '',
        masGustado: masGustado[i] ? masGustado[i].nombre : '',
        menosGustado: menosGustado[i] ? menosGustado[i].nombre : ''
      });
    }

    return combinedData;
  }
}