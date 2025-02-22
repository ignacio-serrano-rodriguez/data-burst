import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AdministracionService, RespuestaObtenerUsuarios } from '../../servicios/administracion.service';

// Importamos para Reactive Forms y autocomplete
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common'; // Importar CommonModule para usar el pipe async
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    CommonModule, // Asegurarse de importar CommonModule
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {

  // Control para el input de usuario
  usuarioControl = new FormControl('');

  // Lista completa de usuarios
  usuarios: { id: number; usuario: string; mail: string | null; permiso: string | null }[] = [];

  // Lista filtrada que se vinculará al autocomplete
  usuariosFiltrados$: Observable<{ id: number; usuario: string; mail: string | null; permiso: string | null }[]>
    = new Observable();

  constructor(
    private router: Router,
    private administracionService: AdministracionService
  ) { }

  ngOnInit() {
    // Verificación de permisos, sin cambios
    if (typeof localStorage !== 'undefined') {
      const permiso = localStorage.getItem('permiso');
      if (permiso !== "3") {
        this.router.navigate(['home']);
      }
    } else {
      this.router.navigate(['home']);
    }

    // Cargar lista de usuarios al iniciar
    this.administracionService.obtenerUsuarios().subscribe({
      next: (resp: RespuestaObtenerUsuarios) => {
        if (resp.exito) {
          this.usuarios = resp.usuarios ?? [];
          // Configurar el filtro para el autocomplete
          this.usuariosFiltrados$ = this.usuarioControl.valueChanges.pipe(
            startWith(''),
            map(valor => this.filtrarUsuarios(valor))
          );
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private filtrarUsuarios(texto: string | null): typeof this.usuarios {
    const filtro = (texto ?? '').toLowerCase();
    return this.usuarios.filter((u) => u.usuario.toLowerCase().includes(filtro));
  }
}