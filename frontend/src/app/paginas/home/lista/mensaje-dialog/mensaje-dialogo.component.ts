import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mensaje-dialogo',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h1 mat-dialog-title>Mensaje</h1>
    <div mat-dialog-content>
      <p>{{ data.mensaje }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onClose()">Cerrar</button>
    </div>
  `,
  styles: [`
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }
    div[mat-dialog-content] {
      margin-top: 20px;
      font-size: 16px;
    }
    div[mat-dialog-actions] {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class MensajeDialogoComponent {
  constructor(
    public dialogRef: MatDialogRef<MensajeDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}