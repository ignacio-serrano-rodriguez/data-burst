import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CommonModule } from '@angular/common'; // Importar CommonModule

interface Estadistica {
  masAgregado: string;
  masGustado: string;
  menosGustado: string;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true, // Indicar que es un componente standalone
  imports: [FormsModule, CommonModule], // Importar FormsModule y CommonModule aquí
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent {
  categoria: string = ''; // Asegúrate de que esta propiedad exista
  estadisticas: Estadistica[] = [
    { masAgregado: '', masGustado: '', menosGustado: '' },
    { masAgregado: '', masGustado: '', menosGustado: '' },
    { masAgregado: '', masGustado: '', menosGustado: '' }
  ];

  generarEstadisticas() {
    // Lógica para generar estadísticas basada en la categoría
    console.log(`Generando estadísticas para la categoría: ${this.categoria}`);
    // Aquí puedes agregar la lógica para obtener las estadísticas y actualizar el array `estadisticas`
  }
}