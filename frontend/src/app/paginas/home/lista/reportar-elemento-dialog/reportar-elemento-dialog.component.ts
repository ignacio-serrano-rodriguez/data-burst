import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { configuracion_app } from '../../../../configuraciones/configuracion_app';

interface Categoria {
    id: number;
    nombre: string;
}

interface HydraResponse {
    'hydra:member': Array<{
        id: number;
        nombre: string;
        '@type': string;
        '@id': string;
        elementos: string[];
        listas: string[];
    }>;
    'hydra:totalItems': number;
}

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
        MatSelectModule,
        ReactiveFormsModule
    ],
    templateUrl: './reportar-elemento-dialog.component.html',
    styleUrls: ['./reportar-elemento-dialog.component.css'],
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
    ]
})
export class ReportarElementoDialogComponent implements OnInit {
    form: FormGroup;
    categorias: Categoria[] = [];
    cargandoCategorias = true;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ReportarElementoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private http: HttpClient
    ) {
        this.form = this.fb.group({
            nombre: ['', []],
            fechaAparicion: [null, []],
            descripcion: ['', []],
            categoria: [null, []]
        });
    }

    ngOnInit() {
        this.cargarCategorias();
    }

    cargarCategorias() {
        this.cargandoCategorias = true;
        this.http.get<HydraResponse>(`${configuracion_app.api}/categorias`).subscribe({
            next: (response) => {
                this.categorias = response['hydra:member'].map(cat => ({
                    id: cat.id,
                    nombre: cat.nombre
                }));
                this.cargandoCategorias = false;
            },
            error: (error) => {
                console.error('Error al cargar categorías:', error);
                this.cargandoCategorias = false;
            }
        });
    }

    enviarReporte() {
        if (this.form.valid) {
            const nombre = this.form.get('nombre')?.value;
            const fechaAparicion = this.form.get('fechaAparicion')?.value;
            const descripcion = this.form.get('descripcion')?.value;
            const categoria = this.form.get('categoria')?.value;

            const nombreTieneValor = nombre && nombre.trim() !== '';
            const fechaTieneValor = fechaAparicion !== null;
            const descripcionTieneValor = descripcion && descripcion.trim() !== '';
            const categoriaTieneValor = categoria !== null;

            if (nombreTieneValor || fechaTieneValor || descripcionTieneValor || categoriaTieneValor) {
                const resultado = {
                    elementoId: this.data.elemento.id,
                    nombreOriginal: this.data.elemento.nombre,
                    nombreReportado: nombreTieneValor ? nombre : null,
                    fechaAparicionOriginal: this.data.elemento.fecha_aparicion,
                    fechaAparicionReportada: fechaTieneValor ? fechaAparicion : null,
                    descripcionOriginal: this.data.elemento.descripcion,
                    descripcionReportada: descripcionTieneValor ? descripcion : null,
                    categoriaOriginal: this.data.elemento.categoria_id,
                    categoriaReportada: categoriaTieneValor ? categoria : null
                };

                this.dialogRef.close(resultado);
            } else {
                this.form.controls['nombre'].markAsTouched();
                this.form.controls['fechaAparicion'].markAsTouched();
                this.form.controls['descripcion'].markAsTouched();
                this.form.controls['categoria'].markAsTouched();
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
        const categoria = this.form.get('categoria')?.value;

        return (nombre && nombre.trim() !== '') ||
            (fechaAparicion !== null) ||
            (descripcion && descripcion.trim() !== '') ||
            (categoria !== null);
    }
}