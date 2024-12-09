import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-comentario-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule],
  templateUrl: './comentario-dialog.component.html',
  styleUrls: ['./comentario-dialog.component.css']
})
export class ComentarioDialogComponent {
  comentario: string;

  constructor(
    public dialogRef: MatDialogRef<ComentarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { elementoId: number, comentario: string }
  ) {
    this.comentario = data.comentario;
    this.dialogRef.updateSize('500px', '400px'); // Ajustar el tamaño del diálogo
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}