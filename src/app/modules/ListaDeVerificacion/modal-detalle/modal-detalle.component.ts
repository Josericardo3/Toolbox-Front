import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.component.html',
  styleUrls: ['./modal-detalle.component.css']
})
export class ModalDetalleComponent implements OnInit{
  @Input() idAuditoria: number;
  @Output() valorEnviado = new EventEmitter<any>();

  detalleAuditoria: any; // Variable para almacenar el detalle de auditoría
  detalle: any;
  showModal = false;

  CODIGO: string;
  EQUIPO_AUDITOR: string;
  ALCANCE: string;
  FECHA_REUNION_APERTURA: any;
  HORA_REUNION_APERTURA: any;
  FECHA_REUNION_CIERRE: any;
  HORA_REUNION_CIERRE: any;
  // FECHA_AUDITORIA
  PROCESOS: any[];

  constructor(public apiService: ApiService,public ApiService: ApiService,){}

  ngOnInit(){}

  getDetalleAuditor() {
    this.apiService.getAuditorias(this.idAuditoria)
    .subscribe((data:any) => {
        // this.detalleAuditoria = data;
        this.CODIGO = data.CODIGO;
        this.EQUIPO_AUDITOR = data.AUDITOR_LIDER;
        this.ALCANCE = data.ALCANCE;
        this.HORA_REUNION_APERTURA = data.HORA_REUNION_APERTURA;
        this.FECHA_REUNION_CIERRE = data.FECHA_REUNION_CIERRE;
        this.HORA_REUNION_CIERRE = data.HORA_REUNION_CIERRE;
        this.FECHA_REUNION_APERTURA = data.FECHA_REUNION_APERTURA;
        this.PROCESOS = data.PROCESOS;
        console.log(data, this.ALCANCE, data.ALCANCE, data.alcance)
      },
      error => {
        console.error(error);
      }
    );
  }

  selectedAuditoria: any = {};
  idProceso: any;
  idRequisito: any;
  preguntasArr: any;
  showLeader: boolean = false;
  showProcessLeader: string = '';
  showLeaderCargo: string = '';
  showAudited: string = '';
  showDocuments: string = '';
  arrayRequired: any = [];

 enviarValor(id: number,index: number ) {
    const valor ={
      ID_AUDITORIA: this.idAuditoria,
      ID_PROCESO_AUDITORIA: id,
      index: index
    }
    this.valorEnviado.emit(valor);
  }

}