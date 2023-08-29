import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-actividades-planificadas',
  templateUrl: './app-actividades-planificadas.component.html',
  styleUrls: ['./app-actividades-planificadas.component.css']
})
export class AppActividadesPlanificadasComponent implements OnInit{

  mostrarBuscador: boolean = false;
  busqueda: string = '';
  result: boolean = false;
  dataInitial: any = [];
  datos: any = [];
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
    private api: ApiService,
  ) {}

  ngOnInit(){
    this.getTable();
  }

  getTable(){
    this.api.getActivities()
    .subscribe((data:any)=> {
      this.datos = data;
      this.dataInitial = data;
      this.cortarDatos = data;
        // Asigna colores según el estado de la auditoría
        this.datos.forEach(item => {
          if (item.ESTADO_PLANIFICACION.toLowerCase() === "programado") {
            item.statecolor = '#f5970a';
          } else if (item.ESTADO_PLANIFICACION.toLowerCase() === "en proceso") {
            item.statecolor = '#f4f80b'
          } else if (item.ESTADO_PLANIFICACION.toLowerCase() === "demorado") {
            item.statecolor = '#ff2a00';
          } else if (item.ESTADO_PLANIFICACION.toLowerCase() === "finalizado") {
            item.statecolor = '#068460';
          }
        });

        // Asigna datos1 a estadoArray
        this.estadoArray = this.datos;

      //paginado
      this.totalPaginas = Math.ceil(this.datos.length / 7);
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
    this.result = false;
    if (!this.busqueda) {
      this.estadoArray = this.dataInitial;
      this.updatePaginado(this.dataInitial);
    }

    this.estadoArray = this.dataInitial.filter(item =>
      item.NOMBRE_RESPONSABLE.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      item.DESCRIPCION.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      item.ESTADO_PLANIFICACION.toLowerCase().includes(this.busqueda.toLowerCase())
    );

    this.totalRegistros = this.estadoArray.length;
    this.cortarDatos = this.estadoArray;
    this.updatePaginado(this.estadoArray);
      if (this.estadoArray.length === 0) {
        this.result = true;
      }
  }

    //para el paginado
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
    this.estadoArray = this.cortarDatos.slice(startItem, Math.min(endItem, this.datos.length));
    this.totalRegistros = this.estadoArray.length;
  }

}
