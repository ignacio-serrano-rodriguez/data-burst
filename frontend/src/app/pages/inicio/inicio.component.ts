import { Component } from '@angular/core';
import { FooterComponent } from "../../footer/footer.component";
import { LoginComponent } from "../../login/login.component";
import { RegistroComponent } from "../../registro/registro.component";
import { TituloComponent } from "../../titulo/titulo.component";
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    FooterComponent, 
    LoginComponent, 
    RegistroComponent, 
    TituloComponent,
    MatIconModule,
    MatDividerModule,
    MatButtonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  mostrarRegistroOcultarLogin() {

    throw new Error('Method not implemented.');
  }
  mostrarLoginOcultarRegistro() {

    throw new Error('Method not implemented.');
  }

}
