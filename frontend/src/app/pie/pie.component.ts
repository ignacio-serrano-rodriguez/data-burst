import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component
({
  selector: 'app-pie',
  standalone: true,
  imports: 
  [
    MatToolbarModule
  ],
  templateUrl: './pie.component.html',
  styleUrl: './pie.component.css'
})
export class PieComponent 
{

}