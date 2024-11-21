import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Solicitud 
{
  nombre: string;
  tipo: string;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: 
  [
    CommonModule
  ],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComponent implements OnInit 
{

  solicitudes: Solicitud[] = [];

  ngOnInit(): void 
  {
    this.solicitudes 
    =[
      { nombre: 'Solicitud 1', tipo: 'Tipo A' },
      { nombre: 'Solicitud 2', tipo: 'Tipo B' },
      { nombre: 'Solicitud 3', tipo: 'Tipo C' }
    ];
  }
  aceptarSolicitud(solicitud: Solicitud) 
  {
    console.log('Solicitud aceptada:', solicitud);
    // Lógica para aceptar la solicitud
  }

  denegarSolicitud(solicitud: Solicitud) 
  {
    console.log('Solicitud denegada:', solicitud);
    // Lógica para denegar la solicitud
  }

}
