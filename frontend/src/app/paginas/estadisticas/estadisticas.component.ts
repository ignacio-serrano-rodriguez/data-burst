import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecargaService } from '../../servicios/recarga.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, OnDestroy {
  private recargaSubscription!: Subscription;

  constructor(private recargaService: RecargaService) {}

  ngOnInit() {
    this.recargaSubscription = this.recargaService.recargarEstadisticas$.subscribe(() => {
      this.recargarComponente();
    });
  }

  ngOnDestroy() {
    if (this.recargaSubscription) {
      this.recargaSubscription.unsubscribe();
    }
  }

  recargarComponente() {
    // Lógica para recargar el componente de estadísticas
  }
}