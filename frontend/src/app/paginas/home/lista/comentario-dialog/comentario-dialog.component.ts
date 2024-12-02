import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comentario-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <h1 mat-dialog-title>Agregar Comentario</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Comentario</mat-label>
        <textarea matInput [(ngModel)]="comentario"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="comentario" cdkFocusInitial>Guardar</button>
    </div>
  `,
})
export class ComentarioDialogComponent {
  comentario: string = '';

  constructor(
    public dialogRef: MatDialogRef<ComentarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { elementoId: number }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}