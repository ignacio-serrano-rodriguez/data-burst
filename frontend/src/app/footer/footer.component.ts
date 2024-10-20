import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy, OnChanges, DoCheck, AfterContentChecked, AfterViewChecked {

  constructor() {
    console.log('FooterComponent -> constructor()');
  }

  // Información nueva llega al componente
  ngOnChanges(changes: SimpleChanges): void {
    console.log('FooterComponent -> ngOnChanges()');
  }

  // El componente se inicializa
  ngOnInit() {
    console.log('FooterComponent -> ngOnInit()');
  }

  // Algo cambia en la interfaz
  ngDoCheck(): void {
    console.log('FooterComponent -> ngDoCheck()');
  }

  // Después del DoCheck (Cuando se inicializa el componente)
  ngAfterContentInit(): void {
    console.log('FooterComponent -> ngAfterContentInit()');
  }

  // Después del DoCheck
  ngAfterContentChecked(): void { 
    console.log('FooterComponent -> ngAfterContentChecked()');
  }

  // Después AfterContentChecked (Cuando se inicializa el componente)
  ngAfterViewInit(): void {
    console.log('FooterComponent -> ngAfterViewInit()');
  }

  // Después AfterContentChecked
  ngAfterViewChecked(): void {
    console.log('FooterComponent -> ngAfterViewChecked()');
  }

  // Componente es destruido
  ngOnDestroy(): void {
    console.log('FooterComponent -> ngOnDestroy()');
  }
}