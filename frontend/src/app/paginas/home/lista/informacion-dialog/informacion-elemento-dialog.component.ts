// Update the data interface to include the flag for showing/hiding the add button
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ElementosService } from '../../../../servicios/elementos.service';

interface DialogData {
    elemento: any;
    listaId: number;
    mostrarBotonAgregar: boolean;
}

@Component({
    selector: 'app-informacion-elemento-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule
    ],
    templateUrl: './informacion-elemento-dialog.component.html',
    styleUrls: ['./informacion-elemento-dialog.component.css']
})
export class InformacionElementoDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<InformacionElementoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private elementosService: ElementosService
    ) { }

    cerrar(): void {
        this.dialogRef.close();
    }

    agregarElemento(): void {
        this.elementosService.asignarElemento(this.data.listaId, this.data.elemento.id).subscribe({
            next: data => {
                if (data.exito) {
                    this.dialogRef.close({ agregado: true });
                }
            },
            error: () => {
            }
        });
    }
}