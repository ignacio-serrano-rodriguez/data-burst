import { Component, OnInit, OnDestroy } from '@angular/core';
import { PieComponent } from "../../pie/pie.component";
import { LoginComponent } from "./login/login.component";
import { RegistroComponent } from "./registro/registro.component";
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RecargaService } from '../../servicios/recarga.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inicio',
  imports: [
    PieComponent, 
    LoginComponent, 
    RegistroComponent,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true
})
export class InicioComponent implements OnInit, OnDestroy {  
  botonLoginVisible: boolean = true;
  loginStyleDisplay: string = "revert";

  botonRegistroVisible: boolean = false;
  registroStyleDisplay: string = "none";

  private recargaSubscription!: Subscription;

  constructor(private router: Router, private recargaService: RecargaService) {}

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('logueado')) {
        this.router.navigate(['home']);
        localStorage.setItem("refrescar", "true");
      }

      this.recargaSubscription = this.recargaService.cerrarSesion$.subscribe(() => {});
    }
  }

  ngOnDestroy() {
    if (this.recargaSubscription) {
      this.recargaSubscription.unsubscribe();
    }
  }

  mostrarRegistroOcultarLogin() {
    this.botonLoginVisible = false;
    this.loginStyleDisplay = "none";

    this.botonRegistroVisible = true;
    this.registroStyleDisplay = "revert";

    if (typeof document !== 'undefined') {
      document.getElementById("mensajeInformativo")!.innerText = "";
    }
  }

  mostrarLoginOcultarRegistro() {
    this.botonLoginVisible = true;
    this.loginStyleDisplay = "revert";
    
    this.botonRegistroVisible = false;
    this.registroStyleDisplay = "none";

    if (typeof document !== 'undefined') {
      document.getElementById("mensajeInformativo")!.innerText = "";
    }
  }
}