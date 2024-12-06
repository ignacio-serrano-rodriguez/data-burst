import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AmigosService } from '../../../servicios/amigos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CabeceraComponent } from "../../../cabecera/cabecera.component";
import { PieComponent } from "../../../pie/pie.component";

@Component({
  selector: 'app-amigo',
  standalone: true,
  imports: [CommonModule, MatButtonModule, CabeceraComponent, PieComponent],
  templateUrl: './amigo.component.html',
  styleUrls: ['./amigo.component.css']
})
export class AmigoComponent implements OnInit {
  amigoNombre: string = '';
  private amigosService = inject(AmigosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.amigoNombre = this.route.snapshot.paramMap.get('nombreAmigo')!;
    this.obtenerAmigo();
  }

  obtenerAmigo() {
    this.amigosService.obtenerAmigoPorNombre(this.amigoNombre).subscribe({
      next: (data) => {
        if (data.exito) {
          this.amigoNombre = data.amigo.nombre;
        }
      },
      error: (error) => {
        console.error('Error al obtener el amigo:', error);
      }
    });
  }

  eliminarAmistad() {
    this.amigosService.eliminarAmistadPorNombre(this.amigoNombre).subscribe({
      next: (data) => {
        if (data.exito) {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Error al eliminar la amistad:', error);
      }
    });
  }
}