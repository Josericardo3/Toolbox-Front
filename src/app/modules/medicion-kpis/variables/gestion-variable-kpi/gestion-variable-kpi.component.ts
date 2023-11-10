import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { VariableService } from 'src/app/servicios/kpis/variable.service';

@Component({
  selector: 'app-gestion-variable-kpi',
  templateUrl: './gestion-variable-kpi.component.html',
  styleUrls: ['./gestion-variable-kpi.component.css']
})
export class GestionVariableKpiComponent {
  requiredFieldsValid: boolean = false;
  numero: any = 1;
  model: any = {};

  respuesta: any = {};
  constructor(
    private _dialog: MatDialogRef<GestionVariableKpiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variableService: VariableService,
    private modalService: ModalService
  ) {
    this.numero = data[0].numero;
    if (this.numero != 3) {
      this.model = data[0];
    } else {
      this.model = data[0];
      this.model.isChecked = true;
    }
  }
  onRequiredFieldsValidityChange(validity: boolean) {
    this.requiredFieldsValid = validity;
  }
  cerrarDialog(opcion: number) {
    this._dialog.close(opcion);
  }
  registrar() {
    this.variableService.agregar(this.model).subscribe({
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
  actualizar() {
    this.variableService.actualizar(this.model).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.respuesta.opcion = 1;
          this.respuesta.tipo = true;
          this.respuesta.title = 'Actualización exitosa.';
          this.respuesta.mensaje = x.Mensaje;
          this.cerrarDialog(this.respuesta);
        } else {
          var title = 'Falló.';
          this.modalService.showModal(title, x.Mensaje);
        }
      },
      error: (e) => {
        const title = 'Falló.';
        this.modalService.showModal(title, 'Algo salió mal');
      },
    });
  }
}
