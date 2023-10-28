import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { PaqueteService } from 'src/app/servicios/kpis/paquete.service';
import { GestionPaqueteKpiComponent } from './gestion-paquete-kpi/gestion-paquete-kpi.component';
import * as _ from 'lodash';
import { AlertComponent } from '../../alert/alert.component';
import { environment } from 'src/environments/environment.prod';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.component.html',
  styleUrls: ['./paquetes.component.css'],
})
export class PaquetesComponent {
  displayedColumns: string[] = ['nombre', 'descripcion', 'opciones'];
  dataSource: any = [];
  filter: any = { search: '' };
  listaPaquetes: any = [];
  currentPage: number = 1;
  pages = 1;
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  dataEnvio: any = [];
  temporalData: any = {};

  //Paginacion
  pageSizeOptions = environment.PageSizeOptions;
  totalItems: number = 0;
  pageEvenet!: PageEvent;
  pageIndex = 0;
  private _pageSize = environment.PageSize;
  public get pageSize() {
    return this._pageSize;
  }
  public set pageSize(value) {
    this._pageSize = value;
  }
  constructor(
    private paqueteService: PaqueteService,
    private _dialog: MatDialog,
    private modalService: ModalService
  ) {}
  ngOnInit(): void {
    this.obtenerTabla();
  }

  aniadirPaquete(numero: number, info: any) {
    if (numero == 1) {
      this.dataEnvio = { numero: numero, VAL_CUMPLIMIENTO: 0 };
    } else {
      info.numero = numero;
      this.dataEnvio = info;
    }
    this.abrirDialog();
  }
  abrirDialog() {
    var temp = _.cloneDeep(this.listaPaquetes);
    var dialogRef = this._dialog.open(GestionPaqueteKpiComponent, {
      data: [this.dataEnvio],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.opcion == 1) {
        this.modalService.showModal(result.title, result.mensaje);
        this.obtenerTabla();
      } else {
        this.dataSource = temp;
      }
    });
  }
  cambioPagina(event: any) {
    this.pageEvenet = event;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.obtenerTabla();
  }
  obtenerTabla() {
    this.filter.skip = this.pageIndex * this.pageSize;
    this.filter.take = this.pageSize;
    this.paqueteService.obtenerTabla(this.filter).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.listaPaquetes = x.Data;
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
  eliminar(elemet: any) {
    const dialogRef = this._dialog.open(AlertComponent, {
      data: {
        icono: 'error_outline',
        titulo: 'Confirmar Eliminación',
        message: '',
        descripcion: '¿Estás seguro de que deseas eliminar este elemento?',
        color: 'warning',
        tieneIcono: true,
        muestraAceptar: false,
        muestraCancelar: false,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.paqueteService.eliminar(elemet).subscribe({
          next: (x) => {
            if (x.Confirmacion) {
              this.obtenerTabla();
              this.modalService.showModal('Confirmación', x.Mensaje);
            } else {
              this.modalService.showModal('Confirmación', x.Mensaje);
            }
          },
          error: (e) => {},
        });
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
