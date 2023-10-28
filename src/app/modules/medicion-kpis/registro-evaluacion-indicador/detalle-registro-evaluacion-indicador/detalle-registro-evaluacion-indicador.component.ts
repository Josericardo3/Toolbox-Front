import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-registro-evaluacion-indicador',
  templateUrl: './detalle-registro-evaluacion-indicador.component.html',
  styleUrls: ['./detalle-registro-evaluacion-indicador.component.css']
})
export class DetalleRegistroEvaluacionIndicadorComponent {
  model:any={
  
}
constructor(private _dialog: MatDialogRef<DetalleRegistroEvaluacionIndicadorComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,){
  this.model = data[0];
}
cerrarDialog(opcion: number) {
  this._dialog.close(opcion);
}
}