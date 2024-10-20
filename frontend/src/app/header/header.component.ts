import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AvatarComponent } from "../avatar/avatar.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnChanges {

  @Input() usuarioLogueado: string = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

}
