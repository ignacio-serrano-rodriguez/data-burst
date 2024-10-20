import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnChanges {

  @Input() usuarioLogueado: string = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

}
