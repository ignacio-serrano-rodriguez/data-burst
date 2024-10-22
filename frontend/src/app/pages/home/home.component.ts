import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { TusListasComponent } from "../../tus-listas/tus-listas.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TusListasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnChanges {

  usuarioLogueado: string = '(usuario logueado)';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

}
