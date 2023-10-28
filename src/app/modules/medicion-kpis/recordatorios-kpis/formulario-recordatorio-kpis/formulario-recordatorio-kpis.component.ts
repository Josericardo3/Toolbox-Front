import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { helpers } from 'src/app/modules/Helpers/helpers';
import { IndicadorService } from 'src/app/servicios/kpis/indicador.service';

@Component({
  selector: 'app-formulario-recordatorio-kpis',
  templateUrl: './formulario-recordatorio-kpis.component.html',
  styleUrls: ['./formulario-recordatorio-kpis.component.css']
})
export class FormularioRecordatorioKpisComponent {
  model:any={};
  respuesta:any={};
  modelInfo:any={};
  constructor(
    private _dialog: MatDialogRef<FormularioRecordatorioKpisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private indicadorService: IndicadorService,
    private modalService: ModalService,
    private helper: helpers
  ) {
    this.modelInfo=this.data[0];
    console.log(data)
    this.model.ID_EVALUACION_INDICADOR=this.data[0].ID_EVALUACION_INDICADOR;
    this.model.HORA_RECORDATORIOR = new Date();
    this.model.HORA_RECORDATORIOR.setHours(6, 0, 0, 0);
  }
  cerrarDialog(opcion: number) {
    this._dialog.close(opcion);
  }
  registrar(){
    console.log(this.model)
    this.model.FECHA_RECORDATORIO= this.helper.convertirFecha(this.model.FECHA_RECORDATORIOR)
    this.model.HORA_RECORDATORIO= this.helper.convertirHora(this.model.HORA_RECORDATORIOR)
    console.log(this.model)
    this.indicadorService.registrarRecordatorio(this.model).subscribe({
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
 
}
