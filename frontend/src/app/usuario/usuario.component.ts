import { Component } from '@angular/core';
import { ModificarUsuarioComponent } from "../modificar-usuario/modificar-usuario.component";

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [ModificarUsuarioComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

}
