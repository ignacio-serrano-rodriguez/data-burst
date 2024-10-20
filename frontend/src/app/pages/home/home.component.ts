import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnChanges {

  usuarioLogueado: string = '(usuario logueado)';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

}
