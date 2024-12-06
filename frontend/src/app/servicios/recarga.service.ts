import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {
  private recargarComponentesSubject = new Subject<void>();

  recargarComponentes$ = this.recargarComponentesSubject.asObservable();

  recargarComponentes() {
    this.recargarComponentesSubject.next();
  }
}