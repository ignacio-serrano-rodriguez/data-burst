import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AmigosService } from '../../../servicios/amigos.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-amigo',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './amigo.component.html',
  styleUrls: ['./amigo.component.css']
})
export class AmigoComponent implements OnInit {
  amigoNombre: string = '';
  amigoID: number = 0;
  private amigosService = inject(AmigosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.amigoNombre = params.get('nombreUsuario')!;
      const usuarioLogueado = localStorage.getItem('usuario');
      if (this.amigoNombre === usuarioLogueado) {
        this.router.navigate(['/home']);
      } else {
        this.obtenerAmigoPorNombre(this.amigoNombre);
      }
    });
  }

  obtenerAmigoPorNombre(nombre: string) {
    const usuarioID = Number(localStorage.getItem('id')) || 0;
    this.amigosService.obtenerAmigoPorNombre(nombre).subscribe({
      next: (data) => {
        if (data.exito) {
          this.amigoID = data.amigo.id;
          this.amigoNombre = data.amigo.nombre;
        } else {
          this.router.navigate(['/error']);
        }
      },
      error: (error) => {
        console.error('Error al obtener el amigo:', error);
        this.router.navigate(['/error']);
      }
    });
  }

  eliminarAmistad() {
    const usuarioID = Number(localStorage.getItem('id')) || 0;
    this.amigosService.eliminarAmistadPorNombre(this.amigoNombre, usuarioID).subscribe({
      next: (data) => {
        if (data.exito) {
          this.router.navigate(['/home']);
        } else {
          console.error('Error al eliminar la amistad:', data.mensaje);
        }
      },
      error: (error) => {
        console.error('Error al eliminar la amistad:', error);
      }
    });
  }
}