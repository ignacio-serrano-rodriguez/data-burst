import { Component } from '@angular/core';
import { FooterComponent } from "../../footer/footer.component";
import { LoginComponent } from "../../login/login.component";
import { RegistroComponent } from "../../registro/registro.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FooterComponent, LoginComponent, RegistroComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
