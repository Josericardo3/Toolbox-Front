import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-resultados-auditoria',
  templateUrl: './app-resultados-auditoria.component.html',
  styleUrls: ['./app-resultados-auditoria.component.css']
})
export class AppResultadosAuditoriaComponent implements OnInit{
  mostrarBuscador: boolean = false;
  busqueda: string = '';
  result: boolean = false;
  dataInitial: any = [];
  datos1: any = [];
  datos2: {[key: number]: any} = {}
  estadoArray: any = [];
  cortarDatos: any = [];
  //paginación
  pages = 1;
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  datatotal: number = 0;
  contentArray: any = [];
  currentPage: number = 1

  constructor(
    public api: ApiService,
    public router: Router,
  ) {}

  ngOnInit(){
    this.getTable();
    this.filtrarDatos();
  }

  getTable(){
    const idPst = localStorage.getItem('Id')
    this.api.getListarAuditorias(Number(idPst)).subscribe((data:any)=> {
      this.dataInitial = data;
      this.datos1 = data;
      this.cortarDatos = data;
      this.datos1.forEach(item =>{
        this.api.getAuditorias(item.ID_AUDITORIA).subscribe((data2) => {
          this.datos2[item.ID_AUDITORIA] = data2;
        })
      })

        // Asigna colores según el estado de la auditoría
        this.datos1.forEach(item => {
          if (item.ESTADO_AUDITORIA.toLowerCase() === 'iniciado') {
            item.statecolor = '#f5970a';
          } else if (item.ESTADO_AUDITORIA.toLowerCase() === 'demorado') {
            item.statecolor = '#ff2a00';
          } else if (item.ESTADO_AUDITORIA.toLowerCase() === 'terminado') {
            item.statecolor = '#068460';
          }
        });

        // Asigna datos1 a estadoArray
        this.estadoArray = this.datos1;

        //paginado
        this.totalPaginas = Math.ceil(this.datos1.length / 7);
        if (this.totalPaginas === 0) {
          this.totalPaginas = 1;
        }
        this.datatotal = this.dataInitial.length;
        this.estadoArray = this.dataInitial.slice(0, 7);
        this.contentArray = data;
        this.currentPage = 1
        if (this.datatotal >= 7) {
          this.totalRegistros = 7;
        } else {
          this.totalRegistros = this.dataInitial.length;
        }      
    })
  }

  filtrarDatos() {
    if (!this.busqueda) {
      this.estadoArray = this.dataInitial;
      this.updatePaginado(this.dataInitial);
      this.result = false;
    }
  
    this.estadoArray = this.dataInitial.filter(item =>
      item.AUDITOR_LIDER.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      (this.datos2[item.ID_AUDITORIA]?.ALCANCE.toLowerCase().includes(this.busqueda.toLowerCase())) ||
      item.ESTADO_AUDITORIA.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  
    this.totalRegistros = this.estadoArray.length;
    this.cortarDatos = this.estadoArray;
    this.updatePaginado(this.estadoArray);
    if (this.estadoArray.length === 0) {
      this.result = true;
    }
  }

  updatePaginado(filter: any) {
    this.pages = 1;
    const totalPag = filter.length;
    this.totalPaginas = Math.ceil(totalPag / 7);
    if (this.totalPaginas == 0) this.totalPaginas = 1;
    this.contentArray = filter;
    this.totalRegistros = filter.length;
    this.datatotal = filter.length;
    if (this.totalRegistros == this.datatotal && this.totalRegistros >= 7) this.totalRegistros = 7;
    filter = filter.slice(0, 7);
    this.estadoArray = filter;
  }

  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    // Asegúrate de que startItem y endItem no excedan los límites del array datos1
    this.estadoArray = this.cortarDatos.slice(startItem, Math.min(endItem, this.datos1.length));
    this.totalRegistros = this.estadoArray.length;
  }
  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }
  
}
