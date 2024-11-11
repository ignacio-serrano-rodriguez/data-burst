import { Component, OnInit } from '@angular/core';
import { PieComponent } from "../../pie/pie.component";
import { LoginComponent } from "./login/login.component";
import { RegistroComponent } from "./registro/registro.component";
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({

  // Tag que identifica al componente 
  selector: 'app-inicio',
  imports: 
  [
    PieComponent, 
    LoginComponent, 
    RegistroComponent,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  // Ruta del archivo HTML que renderiza el componente
  templateUrl: './inicio.component.html',
  // Ruta del archivo CSS que renderiza el componente
  styleUrl: './inicio.component.css',
  standalone: true
})

export class InicioComponent  implements OnInit
{  
  botonLoginVisible:boolean = true;
  loginStyleDisplay:string = "revert";

  botonRegistroVisible:boolean = false;
  registroStyleDisplay:string = "none";

  constructor(private router: Router) {}

  ngOnInit() 
  {
    if (localStorage.getItem('logueado')) 
    {
      this.router.navigate(['home']);
      setTimeout(() => {window.location.reload();}, 400);
    }
  }

  mostrarRegistroOcultarLogin() 
  {
    this.botonLoginVisible = false;
    this.loginStyleDisplay = "none";

    this.botonRegistroVisible = true;
    this.registroStyleDisplay = "revert";

    document.getElementById("mensajeInformativo")!.innerText = "";
  }
  mostrarLoginOcultarRegistro() 
  {
    this.botonLoginVisible = true;
    this.loginStyleDisplay = "revert";
    
    this.botonRegistroVisible = false;
    this.registroStyleDisplay = "none";

    document.getElementById("mensajeInformativo")!.innerText = "";
  }

}
