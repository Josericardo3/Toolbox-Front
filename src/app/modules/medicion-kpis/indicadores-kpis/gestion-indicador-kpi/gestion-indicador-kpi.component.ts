import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';

import { IndicadorService } from '../../../../servicios/kpis/indicador.service';
import { helpers } from 'src/app/modules/Helpers/helpers';

@Component({
  selector: 'app-gestion-indicador-kpi',
  templateUrl: './gestion-indicador-kpi.component.html',
  styleUrls: ['./gestion-indicador-kpi.component.css'],
})
export class GestionIndicadorKpiComponent {
  requiredFieldsValid: boolean = false;
  numero: any = 1;
  model: any = {};
  periodos: any = [];
  variables: any = [];
  paquetes: any = [];
  objetivos: any = [];
  respuesta: any = {};
  paqueteId: any;
  userInfo:any;
  constructor(
    private _dialog: MatDialogRef<GestionIndicadorKpiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indicadorService: IndicadorService,
    private modalService: ModalService,
    private helper: helpers
  ) {
    this.variables = data[2];
    this.periodos = data[1];
    this.paquetes = data[3];
    this.objetivos = data[4];
    this.numero = data[0].numero;
    this.userInfo=data[5];
    if (this.numero != 3) {
      this.model = data[0];
      this.paqueteId = this.model.ID_PAQUETE;
    } else {
      this.model = data[0];
      this.model.isChecked = true;
      this.paqueteId = this.model.ID_PAQUETE;
    }
  }
  onRequiredFieldsValidityChange(validity: boolean) {
    this.requiredFieldsValid = validity;
  }
  cerrarDialog(opcion: number) {
    this._dialog.close(opcion);
  }
  registrar() {
    
    //var formula=eval()
   /* Try (!this.helper.esOperacionMatematicaValida(this.model.formula)) {
      this.modalService.showModal('Alerta', 'Ingrese Fórmula Correctamente');
      return;
    }*/
    try {
      const formula = this.model.formula;
      const resultado = eval(formula);
     
  } catch (error) {
    this.modalService.showModal('Alerta', 'Ingrese Fórmula Correctamente');
     return;
  }
    this.model.ID_PAQUETE = this.paqueteId;

    /*var lista = ['*', '+', '-', '(', '-', ')', '/'];
    this.model.VARIABLES = this.model.variablesR.filter(
      (element) => !lista.includes(element)
    );*/

    this.indicadorService.agregar(this.model).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.respuesta.opcion = 1;
          this.respuesta.tipo = true;
          this.respuesta.title = 'Registro exitoso.';
          this.respuesta.mensaje = x.Mensaje;
          this.cerrarDialog(this.respuesta);
        } else {
          const title = 'Falló.';

          this.modalService.showModal(title, x.Mensaje);
        }
      },
      error: (e) => {
        const title = 'Falló.';

        this.modalService.showModal(title, 'Algo salió mal');
      },
    });
  }
  actualizar() {}
}
