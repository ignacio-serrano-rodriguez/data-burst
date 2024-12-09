import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule

@Component({
  selector: 'app-mensaje-dialogo',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule // Agregar MatIconModule a los imports
  ],
  templateUrl: './mensaje-dialogo.component.html'
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