import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnChanges {

  @Input() usuarioLogueado: string = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

}
