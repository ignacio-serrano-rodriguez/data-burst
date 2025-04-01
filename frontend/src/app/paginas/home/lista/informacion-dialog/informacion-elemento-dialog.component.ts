import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ElementosService } from '../../../../servicios/elementos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportarElementoDialogComponent } from '../reportar-elemento-dialog/reportar-elemento-dialog.component';

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
        private elementosService: ElementosService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
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

    reportarElemento(): void {
        const dialogRef = this.dialog.open(ReportarElementoDialogComponent, {
            width: '90%',
            maxWidth: '500px',
            data: { elemento: this.data.elemento }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.elementosService.reportarElemento(result).subscribe({
                    next: (response) => {
                        if (response.exito) {
                            this.snackBar.open('¡Reporte enviado correctamente!', 'Cerrar', {
                                duration: 3000,
                                panelClass: 'success-snackbar'
                            });
                        } else {
                            this.snackBar.open(response.mensaje || 'Error al enviar el reporte', 'Cerrar', {
                                duration: 5000,
                                panelClass: 'error-snackbar'
                            });
                        }
                    },
                    error: (error) => {
                        console.error('Error sending report:', error);
                        this.snackBar.open('Ya ha enviado un reporte para este elemento.', 'Cerrar', {
                            duration: 5000,
                            panelClass: 'error-snackbar'
                        });
                    }
                });
            }
        });
    }
}