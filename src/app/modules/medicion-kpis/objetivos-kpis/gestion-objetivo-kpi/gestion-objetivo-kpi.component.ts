import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ObjetivoService } from '../../../../servicios/kpis/objetivo.service';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';

@Component({
  selector: 'app-gestion-objetivo-kpi',
  templateUrl: './gestion-objetivo-kpi.component.html',
  styleUrls: ['./gestion-objetivo-kpi.component.css'],
})
export class GestionObjetivoKpiComponent {
  requiredFieldsValid: boolean = false;
  numero: any = 1;
  model: any = {};

  respuesta: any = {};
  constructor(
    private _dialog: MatDialogRef<GestionObjetivoKpiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private objetivo: ObjetivoService,
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
    this.objetivo.agregar(this.model).subscribe({
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
    this.objetivo.actualizar(this.model).subscribe({
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