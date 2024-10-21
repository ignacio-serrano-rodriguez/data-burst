import { Component } from '@angular/core';

@Component({
  selector: 'app-modificar-usuario',
  standalone: true,
  imports: [],
  templateUrl: './modificar-usuario.component.html',
  styleUrl: './modificar-usuario.component.css'
})
export class ModificarUsuarioComponent {

  mail = 'iserodmail';
  usuario = 'iserod';
  contrasenia = 'iserod';
  verificado = true;
  permiso  = 0;
  momento_registro = '2024-10-15 11:13:26.000';
  nombre = 'Ignacio';
  apellido_1 = 'Serrano';
  apellido_2 = 'Rodriguez';
  fecha_nacimiento = '01-01-01';
  pais = 'España';
  profesion = 'Desarrollador Full Stack';
  estudios = 'DAW';
  avatar = '(imagen de avatar)'
  idioma = 'Español';

}
