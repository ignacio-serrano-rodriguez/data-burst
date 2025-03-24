import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-reportar-elemento-dialog',
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
    templateUrl: './reportar-elemento-dialog.component.html',
    styleUrls: ['./reportar-elemento-dialog.component.css'],
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
    ]
})
export class ReportarElementoDialogComponent {
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ReportarElementoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.form = this.fb.group({
            nombre: ['', []],
            fechaAparicion: [null, []],
            descripcion: ['', []]
        });
    }

    enviarReporte() {
        if (this.form.valid) {
            const nombre = this.form.get('nombre')?.value;
            const fechaAparicion = this.form.get('fechaAparicion')?.value;
            const descripcion = this.form.get('descripcion')?.value;

            const nombreTieneValor = nombre && nombre.trim() !== '';
            const fechaTieneValor = fechaAparicion !== null;
            const descripcionTieneValor = descripcion && descripcion.trim() !== '';

            if (nombreTieneValor || fechaTieneValor || descripcionTieneValor) {
                const resultado = {
                    elementoId: this.data.elemento.id,
                    nombreOriginal: this.data.elemento.nombre,
                    nombreReportado: nombreTieneValor ? nombre : null,
                    fechaAparicionOriginal: this.data.elemento.fecha_aparicion,
                    fechaAparicionReportada: fechaTieneValor ? fechaAparicion : null,
                    descripcionOriginal: this.data.elemento.descripcion,
                    descripcionReportada: descripcionTieneValor ? descripcion : null
                };

                this.dialogRef.close(resultado);
            } else {
                this.form.controls['nombre'].markAsTouched();
                this.form.controls['fechaAparicion'].markAsTouched();
                this.form.controls['descripcion'].markAsTouched();
            }
        }
    }

    cerrar() {
        this.dialogRef.close();
    }

    hayCambios(): boolean {
        const nombre = this.form.get('nombre')?.value;
        const fechaAparicion = this.form.get('fechaAparicion')?.value;
        const descripcion = this.form.get('descripcion')?.value;

        return (nombre && nombre.trim() !== '') ||
            (fechaAparicion !== null) ||
            (descripcion && descripcion.trim() !== '');
    }
}