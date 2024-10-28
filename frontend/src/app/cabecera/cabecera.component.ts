import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [
    
  ],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent implements OnChanges {

  @Input() usuarioLogueado: string = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

}
