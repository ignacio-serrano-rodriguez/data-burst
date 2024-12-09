import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule

@Component({
  selector: 'app-confirmacion-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule], // Agregar MatIconModule a los imports
  templateUrl: './confirmacion-dialog.component.html'
})
export class ConfirmacionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}