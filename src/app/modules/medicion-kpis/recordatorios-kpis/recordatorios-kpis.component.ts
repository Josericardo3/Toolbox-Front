import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { IndicadorService } from 'src/app/servicios/kpis/indicador.service';
import { PaqueteService } from 'src/app/servicios/kpis/paquete.service';

import { environment } from 'src/environments/environment.prod';
import { FormularioRecordatorioKpisComponent } from './formulario-recordatorio-kpis/formulario-recordatorio-kpis.component';

@Component({
  selector: 'app-recordatorios-kpis',
  templateUrl: './recordatorios-kpis.component.html',
  styleUrls: ['./recordatorios-kpis.component.css'],
})
export class RecordatoriosKpisComponent {
  items = [
    'Indicador 1',
    'Indicador 2',
    'Indicador 3',
    'Indicador 4',
    'Indicador 5',
  ];
  displayedColumns: string[] = [
    'paquete',
    'nombre',
    'descripcion',
    'calculo',
    'periodo',
    'fechaRecordatorio',
    'opciones',
  ];

  dataSource: any = [];
  dataEnvio: any = {};
  filter: any = { search: '' };

  filterPaquete: any = { search: '' };
  dataPaquete: any = [];
  //paginacion
  currentPage: number = 1;
  pages = 1;
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  datatotal: number = 0;
  //Paginacion
  pageSizeOptions = environment.PageSizeOptions;
  totalItems: number = 0;
  pageEvenet!: PageEvent;
  pageIndex = 0;
  pageSize = environment.PageSize;
  ID_USUARIO: any;
  normas: any = [];
  normaSelected: any = [];

  listaEvaluacionIndicadores: any = [];
  constructor(
    private paqueteService: PaqueteService,
    private indicadorService: IndicadorService,
    private _dialog: MatDialog,
    private modalService: ModalService
  ) {}
  ngOnInit(): void {
    this.obtenerComboPaquetes();

    this.ID_USUARIO = localStorage.getItem('Id');
    this.normas = JSON.parse(localStorage.getItem('norma'));
    this.normaSelected = localStorage.getItem('normaSelected');
    this.dataEnvio.ID_PAQUETE = 0;
    if (this.normaSelected != null || this.normaSelected != undefined) {
      var filtro = this.normas.filter((x) => x.NORMA == this.normaSelected)[0];
      this.dataEnvio.ID_NORMA = filtro.ID_NORMA;
      this.buscar();
    }
  }
  buscar() {
    this.obtenerTabla();
  }
  obtenerComboPaquetes() {
    this.paqueteService.obtenerCombo(this.filterPaquete).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.dataPaquete = x.Data;
        } else {
        }
      },
      error: (e) => {},
    });
  }

  cambioPagina(event: any) {
    this.pageEvenet = event;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.obtenerTabla();
  }
  obtenerTabla() {
    this.filter.ID_NORMA = this.dataEnvio.ID_NORMA;
    this.filter.ID_PAQUETE = this.dataEnvio.ID_PAQUETE;
    this.filter.ID_USUARIO = this.ID_USUARIO;
    this.filter.skip = this.pageIndex * this.pageSize;
    this.filter.take = this.pageSize;
    this.indicadorService
      .obtenerTablaEvaluacionIndicadorPorUsuarioCrea(this.filter)
      .subscribe({
        next: (x) => {
          if (x.Confirmacion) {
            this.listaEvaluacionIndicadores = x.Data;
            this.dataSource = x.Data;
            this.totalItems = x.Total;
            this.totalPaginas = Math.ceil(this.totalItems / this.pageSize);
            if (this.totalPaginas == 0) this.totalPaginas = 1;
          } else {
          }
        },
        error: (e) => {},
      });
  }
  cambiarNorma(event: any) {
    this.dataEnvio.ID_NORMA = event.value;
    this.buscar();
  }
  cambiarPaquete(event: any) {
  
    this.dataEnvio.ID_PAQUETE = event.value;
    this.dataEnvio.ID_PAQUETE = event.target.value;
    this.buscar();
  }

  asignarRecordatorio(numero: number, info: any) {
    if (numero == 1) {
      this.dataEnvio = {
        numero: numero,
        ID_USUARIO_CREA: this.ID_USUARIO,
        ID_NORMA: this.dataEnvio.ID_NORMA,
        ID_PAQUETE: this.dataEnvio.ID_PAQUETE,
        VAL_CUMPLIMIENTO: 0,
      };
    } else {
      info.numero = numero;
      this.dataEnvio.ID_USUARIO_CREA = this.ID_USUARIO;
      this.dataEnvio = info;
    }
    this.abrirDialog();
  }

  abrirDialog() {
    if (this.dataEnvio.ID_NORMA == undefined) {
      this.modalService.showModal('Alerta', 'Seleccione una norma');
      return;
    }

    var dialogRef = this._dialog.open(FormularioRecordatorioKpisComponent, {
      data: [this.dataEnvio],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.opcion == 1) {
        this.modalService.showModal(result.title, result.mensaje);
        this.obtenerTabla();
      } else {
      }
    });
  }

  //paginado
  pageChanged(event: any): void {
    this.pageEvenet = event;
    this.pageIndex = event.page - 1;
    this.pageSize = event.itemsPerPage;
    this.totalPaginas = this.pageIndex;
    this.totalPaginas = Math.ceil(this.totalItems / this.pageSize);
    if (this.totalPaginas == 0) this.totalPaginas = 1;
    this.obtenerTabla();
    this.pages = event.page;
  }
}
