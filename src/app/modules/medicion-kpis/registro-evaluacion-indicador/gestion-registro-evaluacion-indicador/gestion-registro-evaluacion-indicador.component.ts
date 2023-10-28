import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { helpers } from 'src/app/modules/Helpers/helpers';
import { IndicadorService } from 'src/app/servicios/kpis/indicador.service';

@Component({
  selector: 'app-gestion-registro-evaluacion-indicador',
  templateUrl: './gestion-registro-evaluacion-indicador.component.html',
  styleUrls: ['./gestion-registro-evaluacion-indicador.component.css'],
})
export class GestionRegistroEvaluacionIndicadorComponent {
  requiredFieldsValid: boolean = false;
  numero: any = 1;
  model: any = {};
  periodos: any = [];
  variables: any = [];
  acciones: any = [];
  paquetes: any = [];
  procesos: any = [];
  responsables: any = [];
  fuenteDatos: any = [];
  respuesta: any = {};
  constructor(
    private _dialog: MatDialogRef<GestionRegistroEvaluacionIndicadorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indicadorService: IndicadorService,
    private modalService: ModalService,
    private helper: helpers
  ) {
    this.acciones = data[1];
    this.numero = data[0].numero;
    if (this.numero != 3) {
      this.model = data[0];
    } else {
      this.model = data[0];
      this.model.isChecked = true;
    }
  }
  onRequiredFieldsValidityChange(validity: boolean) {
    console.log("validity:::",validity)
    this.requiredFieldsValid = validity;
  }
  cerrarDialog(opcion: number) {
    this._dialog.close(opcion);
  }
  registrar() {
    this.model.ID_USUARIO_CREA = localStorage.getItem('Id');

    this.indicadorService.asignarRgistroEvaluaion(this.model).subscribe({
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
