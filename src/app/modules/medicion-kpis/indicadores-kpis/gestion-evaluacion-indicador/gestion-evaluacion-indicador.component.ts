import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { helpers } from 'src/app/modules/Helpers/helpers';
import { IndicadorService } from 'src/app/servicios/kpis/indicador.service';

@Component({
  selector: 'app-gestion-evaluacion-indicador',
  templateUrl: './gestion-evaluacion-indicador.component.html',
  styleUrls: ['./gestion-evaluacion-indicador.component.css'],
})
export class GestionEvaluacionIndicadorComponent {
  requiredFieldsValid: boolean = false;
  numero: any = 1;
  model: any = {};
  periodos: any = [];
  variables: any = [];
  paquetes: any = [];
  procesos: any = [];
  responsables: any = [];
  fuenteDatos: any = [];
  respuesta: any = {};
  constructor(
    private _dialog: MatDialogRef<GestionEvaluacionIndicadorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indicadorService: IndicadorService,
    private modalService: ModalService,
    private helper: helpers
  ) {
    this.procesos = data[1];
    this.responsables = data[2];
    this.fuenteDatos = data[3];
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
    if(!this.model.esDisminuir && !this.model.esIncremento){
      const title = 'Alerta.';
      this.modalService.showModal(title, "Favor seleccione si la meta es para incrementar o disminuir");
      return;
    }
    if(this.model.esDisminuir){
      this.model.ES_INCREMENTO=false;
    }
    this.model.ID_USUARIO_CREA = localStorage.getItem('Id');

    this.indicadorService.asignarEvaluaion(this.model).subscribe({
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
