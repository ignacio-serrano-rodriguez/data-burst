import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-elemento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './crear-elemento-dialog.component.html',
  styleUrls: ['./crear-elemento-dialog.component.css'],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class CrearElementoDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearElementoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const nombreInicial = data.nombre === '__crear__' ? '' : (data.nombre || '');

    this.form = this.fb.group({
      nombre: [nombreInicial, Validators.required],
      fechaAparicion: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}