import { Component, OnInit, ViewChild } from '@angular/core';
import { GestionIndicadorKpiComponent } from './gestion-indicador-kpi/gestion-indicador-kpi.component';
import { ObjetivoService } from 'src/app/servicios/kpis/objetivo.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { IndicadorService } from 'src/app/servicios/kpis/indicador.service';
import { PeridoMedicionService } from '../../../servicios/kpis/periodo.service';
import { VariableService } from 'src/app/servicios/kpis/variable.service';
import { PaqueteService } from 'src/app/servicios/kpis/paquete.service';
import { environment } from 'src/environments/environment.prod';
import { PageEvent } from '@angular/material/paginator';
import { AlertComponent } from '../../alert/alert.component';
import { GestionEvaluacionIndicadorComponent } from './gestion-evaluacion-indicador/gestion-evaluacion-indicador.component';
import { ProcesoService } from '../../../servicios/kpis/proceso.service';
import { ApiService } from 'src/app/servicios/api/api.service';
import { FuenteDatoService } from 'src/app/servicios/kpis/fuente-dato.service';
import { GraficoIndicadoresEvaluacionComponent } from './grafico-indicadores-evaluacion/grafico-indicadores-evaluacion.component';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-indicadores-kpis',
  templateUrl: './indicadores-kpis.component.html',
  styleUrls: ['./indicadores-kpis.component.css'],
})
export class IndicadoresKpisComponent {
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
    'opciones',
  ];
  expandedIndex = 0;
  dataSource: any = [];
  itemsT = ['Titulo'];
  dataEnvio: any = {};
  filter: any = { search: '' };
  filterPeriodo: any = { search: '' };
  filterVariable: any = { search: '' };
  filterPaquete: any = { search: '' };
  filterObjetivo: any = { search: '' };
  filterProceso: any = { search: '' };
  filterFuenteDato: any = { search: '' };
  filterAnios: any = { search: '' };
  listaIndicadores: any = [];
  dataPeriodo: any = [];
  dataVariable: any = [];
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
  dataEnvioAsignar: any = {};
  dataObjetivos: any = [];
  dataProcesos: any = [];
  dataResponsables: any = [];
  dataFuenteDatos: any = [];
  dataAnios: any = [];
  userInfor:any;
  tipoUsuario:any=0;
  @ViewChild(MatSelect) matSelect: MatSelect;
  constructor(
    private objetivoService: ObjetivoService,
    private procesoService: ProcesoService,
    private paqueteService: PaqueteService,
    private periodoMedicionService: PeridoMedicionService,
    private variableService: VariableService,
    private indicadorService: IndicadorService,
    private _dialog: MatDialog,
    private modalService: ModalService,
    private apiService: ApiService,
    private fuenteDatoService: FuenteDatoService
  ) {
    this.obtenerResponsabels();
  }
  ngOnInit(): void {
    this.obtenerAnios();
    this.obtenerComboPeriodoMedicion();
    this.obtenerComboVariables();
    this.obtenerComboPaquetes();
    this.obtenerComboObjetivos();
    this.obtenerComboProcesos();
    
    this.obtenerComboFuentesDatos();
    this.getUser();
    this.ID_USUARIO = localStorage.getItem('Id');
    this.normas = JSON.parse(localStorage.getItem('norma'));
    this.normaSelected = localStorage.getItem('normaSelected');
    this.tipoUsuario = localStorage.getItem('TIPO_USUARIO');
    this.dataEnvio.ID_PAQUETE=0;
  
    if (this.normaSelected != null || this.normaSelected != undefined) {
   
     var lista:any=[];
     this.normas.forEach(element => {
      if(element.NORMA == this.normaSelected){
        this.dataEnvio.NORMA=element.NORMA;
        lista.push(element.ID_NORMA)
      }
     });
   
   this.dataEnvio.ID_NORMA=lista;
   this.buscar();
    }
    if(this.tipoUsuario==3 || this.tipoUsuario==4){
      this.apiService.getNormaSelect().subscribe((data) => {
        
        this.normas=data;
        var lista:any=[];
        
        this.normas.forEach(element => {
          lista.push(element.ID_NORMA)
        });
        this.dataEnvio.ID_NORMA=lista;
        this.buscar();
      });
     
    }
    
  }
  buscar() {
    this.obtenerTabla();
  }
  getUser() {
    const idUsuario = window.localStorage.getItem('Id');
    this.apiService.getUser(idUsuario).subscribe((data: any) => {
      this.userInfor = data;
    })
  }
  obtenerAnios() {
    this.indicadorService.obtenerComboAnios(this.filterAnios).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.dataAnios = x.Data;
        } else {
        }
      },
      error: (e) => {},
    });
  }
  obtenerComboFuentesDatos() {
    this.fuenteDatoService.obtenerCombo(this.filterFuenteDato).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.dataFuenteDatos = x.Data;
        } else {
        }
      },
      error: (e) => {},
    });
  }
  obtenerResponsabels() {
    this.apiService.getListResponsible().subscribe({
      next: (x) => {
        this.dataResponsables = x;
      },
      error: (e) => {},
    });
  }
  obtenerComboProcesos() {
    this.procesoService.obtenerCombo(this.filterProceso).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.dataProcesos = x.Data;
        } else {
        }
      },
      error: (e) => {},
    });
  }
  obtenerComboObjetivos() {
    this.objetivoService.obtenerCombo(this.filterObjetivo).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.dataObjetivos = x.Data;
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
  obtenerComboPeriodoMedicion() {
    this.periodoMedicionService.obtenerCombo(this.filterPeriodo).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.dataPeriodo = x.Data;
        } else {
        }
      },
      error: (e) => {},
    });
  }
  obtenerComboVariables() {
    this.variableService.obtenerCombo(this.filterVariable).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.dataVariable = x.Data;
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
    this.indicadorService.obtenerTabla(this.filter).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.listaIndicadores = x.Data;
          this.dataSource = x.Data;
          this.totalItems = x.Total;
          this.totalPaginas = Math.ceil(this.totalItems / this.pageSize);
          if (this.totalPaginas == 0) this.totalPaginas = 1;
        } else {
          this.modalService.showModal('Alerta', x.Mensaje);
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

  aniadirIndicador(numero: number, info: any) {
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

    if (this.dataEnvio.ID_PAQUETE == undefined) {
      this.modalService.showModal('Alerta', 'Seleccione un paquete');
      return;
    }
    if (this.dataEnvio.ID_PAQUETE == 0) {
      this.modalService.showModal('Alerta', 'Seleccione un paquete');
      return;
    }
    if (this.dataEnvio.ID_NORMA.length < 1) {
      this.modalService.showModal('Alerta', 'Seleccione una norma');
      return;
    }

    var dialogRef = this._dialog.open(GestionIndicadorKpiComponent, {
      data: [
        this.dataEnvio,
        this.dataPeriodo,
        this.dataVariable,
        this.dataPaquete,
        this.dataObjetivos,
        this.userInfor
      ],
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
  eliminar(elemet: any) {
    elemet.ID_USUARIO_CREA = this.ID_USUARIO;
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
        this.indicadorService.eliminar(elemet).subscribe({
          next: (x) => {
            if (x.Confirmacion) {
              this.modalService.showModal('Confirmación', x.Mensaje);
              this.obtenerTabla();
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
  asignarIndicador(numero, info: any) {
    if (numero == 1) {
      this.dataEnvioAsignar = {
        numero: numero,
        ID_USUARIO_CREA: this.ID_USUARIO,
        ID_NORMA: this.dataEnvio.ID_NORMA,
      };
    } else {
      info.numero = numero;
      this.dataEnvioAsignar.ID_USUARIO_CREA = this.ID_USUARIO;
      this.dataEnvioAsignar = info;
    }
    this.abrirDialogAsignar();
  }
  abrirDialogAsignar() {
    if (this.dataEnvio.ID_NORMA == undefined) {
      this.modalService.showModal('Alerta', 'Seleccione una norma');
      return;
    }

    var dialogRef = this._dialog.open(GestionEvaluacionIndicadorComponent, {
      data: [
        this.dataEnvioAsignar,
        this.dataProcesos,
        this.dataResponsables,
        this.dataFuenteDatos,
        
      ],
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
  verGrafico(info:any) {
    if (this.dataEnvio.ID_NORMA == undefined) {
      this.modalService.showModal('Alerta', 'Seleccione una norma');
      return;
    }

    var dialogRef = this._dialog.open(GraficoIndicadoresEvaluacionComponent, {
      data: [
        info,this.dataProcesos,this.dataAnios
      ],
      disableClose: true,
    });
  }
  seleccionarTodos(event:any){

    //const seleccionarTodos = this.dataEnvio.ID_NORMA.length === this.normas.length;

    if (!event.source._selected) {
      // Si "Todos" está seleccionado, deselecciona todas las normas
      this.dataEnvio.ID_NORMA = [];
    } else {
      // Si "Todos" no está seleccionado, selecciona todas las normas
      this.dataEnvio.ID_NORMA = this.normas.map(item => item.ID_NORMA);
    }

    // Actualiza el valor del MatSelect
    this.matSelect.writeValue(this.dataEnvio.ID_NORMA);
    
  }
}
