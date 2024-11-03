import { Component } from '@angular/core';
import { CabeceraComponent } from "../../cabecera/cabecera.component";
import { PieComponent } from "../../pie/pie.component";

@Component
({
  selector: 'app-home',
  standalone: true,
  imports: 
  [
    CabeceraComponent,
    PieComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent 
{
  usuarioLogueado: string = '(usuario logueado)';

  ngOnInit() 
  {
    
    if (!sessionStorage.getItem('reloaded')) 
    {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    }
    
  }
}
