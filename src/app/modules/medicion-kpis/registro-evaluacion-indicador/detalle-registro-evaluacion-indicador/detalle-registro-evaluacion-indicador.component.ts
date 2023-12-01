import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { helpers } from '../../../Helpers/helpers';

@Component({
  selector: 'app-detalle-registro-evaluacion-indicador',
  templateUrl: './detalle-registro-evaluacion-indicador.component.html',
  styleUrls: ['./detalle-registro-evaluacion-indicador.component.css']
})
export class DetalleRegistroEvaluacionIndicadorComponent {
  model:any={
  
}
colorSem:any="";
constructor(private _dialog: MatDialogRef<DetalleRegistroEvaluacionIndicadorComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,private helpers:helpers){
  this.model = data[0];
  this.colorSem=helpers.calcular(this.model.META, this.model.ES_INCREMENTO, this.model.ES_DISMINUIR,this.model.RESULTADO)
  this.colorSem="dot-"+this.colorSem
}
cerrarDialog(opcion: number) {
  this._dialog.close(opcion);
}
}