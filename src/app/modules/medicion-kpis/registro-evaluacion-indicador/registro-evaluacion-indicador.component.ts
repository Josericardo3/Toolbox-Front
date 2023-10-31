import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';
import { FuenteDatoService } from 'src/app/servicios/kpis/fuente-dato.service';
import { IndicadorService } from 'src/app/servicios/kpis/indicador.service';
import { ObjetivoService } from 'src/app/servicios/kpis/objetivo.service';
import { PaqueteService } from 'src/app/servicios/kpis/paquete.service';
import { PeridoMedicionService } from 'src/app/servicios/kpis/periodo.service';
import { ProcesoService } from 'src/app/servicios/kpis/proceso.service';
import { VariableService } from 'src/app/servicios/kpis/variable.service';
import { environment } from 'src/environments/environment.prod';
import { GestionRegistroEvaluacionIndicadorComponent } from './gestion-registro-evaluacion-indicador/gestion-registro-evaluacion-indicador.component';
import { AccionService } from 'src/app/servicios/kpis/accion.service';
import { DetalleRegistroEvaluacionIndicadorComponent } from './detalle-registro-evaluacion-indicador/detalle-registro-evaluacion-indicador.component';

@Component({
  selector: 'app-registro-evaluacion-indicador',
  templateUrl: './registro-evaluacion-indicador.component.html',
  styleUrls: ['./registro-evaluacion-indicador.component.css'],
})
export class RegistroEvaluacionIndicadorComponent {
  filter: any = { search: '' };
  filterPaquete: any = { search: '' };
  filterAccion: any = { search: '' };
  dataSource: any = [];
  ID_USUARIO: any;
  normas: any = [];
  normaSelected: any = [];
  dataEnvio: any = {};
  listaEvaluacionIndicadores: any = [];
  displayedColumns: string[] = [
    'paquete',
    'proceso',
    'nombre',
    /*'descripcion',*/
    'calculo',
    'meta',
    'periodo',
    'sem',
    'opciones',
  ];

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

  dataPaquete: any = [];
  dataAccion: any = [];
  constructor(
    private paqueteService: PaqueteService,
    private indicadorService: IndicadorService,
    private _dialog: MatDialog,
    private modalService: ModalService,
    private accionService: AccionService
  ) {}
  ngOnInit(): void {
    this.obtenerComboPaquetes();
    this.obtenerComboAcciones();
    this.dataEnvio.ID_PAQUETE=0;
    this.ID_USUARIO = localStorage.getItem('Id');
    this.normas = JSON.parse(localStorage.getItem('norma'));
    this.normaSelected = localStorage.getItem('normaSelected');
    if (this.normaSelected != null || this.normaSelected != undefined) {
      var filtro = this.normas.filter((x) => x.NORMA == this.normaSelected)[0];
      this.dataEnvio.ID_NORMA = filtro.ID_NORMA;

      this.buscar();
    }
  }
  obtenerComboAcciones() {
    this.accionService.obtenerCombo(this.filterAccion).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.dataAccion = x.Data;
        } else {
        }
      },
      error: (e) => {},
    });
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
  cambiarNorma(event: any) {
    this.dataEnvio.ID_NORMA = event.value;
    //this.buscar();
  }
  cambiarPaquete(event: any) {
    // this.dataEnvio.ID_PAQUETE = event.value;
    this.dataEnvio.ID_PAQUETE = event.target.value;
    this.buscar();
  }
  buscar() {
    this.obtenerTabla();
  }
  obtenerTabla() {
    this.filter.ID_NORMA = this.dataEnvio.ID_NORMA;
    this.filter.ID_PAQUETE = this.dataEnvio.ID_PAQUETE;
    this.filter.ID_USUARIO = this.ID_USUARIO;
    this.filter.skip = this.pageIndex * this.pageSize;
    this.filter.take = this.pageSize;
    this.indicadorService
      .obtenerTablaEvaluacionIndicador(this.filter)
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
  evaluarIndicador(numero, info: any) {
    if (numero == 1) {
      this.dataEnvio = {
        numero: numero,
        ID_USUARIO_MODIFICA: this.ID_USUARIO,
        ID_NORMA: this.dataEnvio.ID_NORMA,
        ID_PAQUETE: this.dataEnvio.ID_PAQUETE,
        VAL_CUMPLIMIENTO: 0,
      };
    } else {
      info.numero = numero;
      this.dataEnvio.ID_USUARIO_MODIFICA = this.ID_USUARIO;
      this.dataEnvio = info;
    }
    this.abrirDialog();
  }
  abrirDialog() {
    if (this.dataEnvio.ID_PAQUETE == undefined) {
      this.modalService.showModal('Alerta', 'Seleccione un paquete');
      return;
    }
    if (this.dataEnvio.ID_PAQUETE == 0) {
      this.modalService.showModal('Alerta', 'Seleccione un paquete');
      return;
    }
    if (this.dataEnvio.ID_NORMA == undefined) {
      this.modalService.showModal('Alerta', 'Seleccione una norma');
      return;
    }

    var dialogRef = this._dialog.open(
      GestionRegistroEvaluacionIndicadorComponent,
      {
        data: [this.dataEnvio, this.dataAccion],
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.opcion == 1) {
        this.modalService.showModal(result.title, result.mensaje);
        this.obtenerTabla();
      } else {
      }
    });
  }
  abrirDetalle(info:any) {
    var dialogRef = this._dialog.open(
      DetalleRegistroEvaluacionIndicadorComponent,
      {
        data: [info],
        disableClose: true,
      }
    );
  }
}
