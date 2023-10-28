import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ObjetivoService } from 'src/app/servicios/kpis/objetivo.service';
import { GestionObjetivoKpiComponent } from './gestion-objetivo-kpi/gestion-objetivo-kpi.component';
import * as _ from 'lodash';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { helpers } from '../../Helpers/helpers';
import { AlertComponent } from '../../alert/alert.component';
import { environment } from 'src/environments/environment.prod';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-objetivos-kpis',
  templateUrl: './objetivos-kpis.component.html',
  styleUrls: ['./objetivos-kpis.component.css'],
})
export class ObjetivosKpisComponent {
  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'valcumplimiento',
    'opciones',
  ];
  dataSource: any = [];
  filter: any = { search: '' };
  listaObjetivos: any = [];
  //paginacion
  currentPage: number = 1;
  pages = 1;
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  datatotal: number = 0;
  dataEnvio: any = [];

  temporalData: any = {};
  //Paginacion
  pageSizeOptions = environment.PageSizeOptions;
  totalItems: number = 0;
  pageEvenet!: PageEvent;
  pageIndex = 0;
  pageSize = environment.PageSize;
  constructor(
    private objetivoService: ObjetivoService,
    private _dialog: MatDialog,
    private modalService: ModalService,
    private helpers: helpers,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.obtenerTabla();
  }

  aniadirObjetivo(numero: number, info: any) {
    if (numero == 1) {
      this.dataEnvio = { numero: numero, VAL_CUMPLIMIENTO: 0 };
    } else {
      info.numero = numero;
      this.dataEnvio = info;
    }
    this.abrirDialog();
  }
  abrirDialog() {
    var temp = _.cloneDeep(this.listaObjetivos);
    var dialogRef = this._dialog.open(GestionObjetivoKpiComponent, {
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
    this.objetivoService.obtenerTabla(this.filter).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.listaObjetivos = x.Data;

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
        descripcion: '¿Estás seguro? Al eliminar el objetivo se eliminaran los indicadores asignados a el',
        color: 'warning',
        tieneIcono: true,
        muestraAceptar: false,
        muestraCancelar: false,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.objetivoService.eliminar(elemet).subscribe({
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
