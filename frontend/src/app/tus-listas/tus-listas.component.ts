import { Component, OnInit } from '@angular/core';
import { ListaService } from '../services/lista.service';

@Component({
  selector: 'app-tus-listas',
  standalone: true,
  imports: [],
  templateUrl: './tus-listas.component.html',
  styleUrl: './tus-listas.component.css'
})
export class TusListasComponent implements OnInit {

  constructor(private listaService: ListaService) {}

  ngOnInit(): void {
    this.listaService.getLista().subscribe(console.log);
  }

  

}
