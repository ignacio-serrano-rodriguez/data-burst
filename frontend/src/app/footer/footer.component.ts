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

  ngOnInit() {
    console.log('FooterComponent -> ngOnInit()');
  }

  // Algo cambia en la interfaz
  ngDoCheck(): void {
    console.log('FooterComponent -> ngDoCheck()');
  }

  ngAfterContentInit(): void {
    console.log('FooterComponent -> ngAfterContentInit()');
  }

  // Se ejecuta después del DoCheck
  ngAfterContentChecked(): void { 
    console.log('FooterComponent -> ngAfterContentChecked()');
  }

  ngAfterViewInit(): void {
    console.log('FooterComponent -> ngAfterViewInit()');
  }

  // Se ejecuta después del DoCheck
  ngAfterViewChecked(): void {
    console.log('FooterComponent -> ngAfterViewChecked()');
  }

  ngOnDestroy(): void {
    console.log('FooterComponent -> ngOnDestroy()');
  }
}