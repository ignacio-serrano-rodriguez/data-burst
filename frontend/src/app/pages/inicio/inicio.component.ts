import { Component } from '@angular/core';
import { FooterComponent } from "../../footer/footer.component";
import { LoginComponent } from "./login/login.component";
import { RegistroComponent } from "./registro/registro.component";
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  // Tag que identifica al componente 
  selector: 'app-inicio',
  imports: [
    FooterComponent, 
    LoginComponent, 
    RegistroComponent,
    MatIconModule,
    MatDividerModule,
    MatButtonModule],
  // Ruta del archivo HTML que renderiza el componente
  templateUrl: './inicio.component.html',
  // Ruta del archivo CSS que renderiza el componente
  styleUrl: './inicio.component.css',
  standalone: true
})
export class InicioComponent {  

  botonLoginVisible:boolean = true;
  loginStyleDisplay:string = "revert";

  botonRegistroVisible:boolean = false;
  registroStyleDisplay:string = "none";

  mostrarRegistroOcultarLogin() {

    this.botonLoginVisible = false;
    this.loginStyleDisplay = "none";

    this.botonRegistroVisible = true;
    this.registroStyleDisplay = "revert";
  }
  mostrarLoginOcultarRegistro() {

    this.botonLoginVisible = true;
    this.loginStyleDisplay = "revert";
    
    this.botonRegistroVisible = false;
    this.registroStyleDisplay = "none";
  }

}
