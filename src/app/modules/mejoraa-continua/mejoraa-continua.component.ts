import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ColorLista } from 'src/app/servicios/api/models/color';

@Component({
  selector: 'app-mejoraa-continua',
  templateUrl: './mejoraa-continua.component.html',
  styleUrls: ['./mejoraa-continua.component.css']
})
export class MejoraaContinuaComponent {

  rolessArray: any = [];
  dataInitial: any = [];
  totalPaginas: number = 0;
  datatotal: number = 0;
  contentArray: any = [];
  currentPage: number = 1;
  totalRegistros: number = 0;
  caracteristicaIndice: number = -1;
  pages = 1;
  filter: string = '';
  showfilter: boolean = false;
  result: boolean = false;
  idrol:number;
  colorWallpaper: ColorLista;
  colorTitle: ColorLista;
  isCollapsed = true;
  mostrarNotificacion: boolean = false;

  constructor(
    public ApiService: ApiService,
    private cd: ChangeDetectorRef,
    private router: Router,

  ) { }
  ngOnInit() {
    this.ApiService.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;
    
    if(Number(localStorage.getItem('rol'))=== 7){
      this.router.navigate(['/tablaEncuestas']);
    }
    this.fnConsultMejoraContinua();
  }  
  
  fnConsultMejoraContinua() {
    this.ApiService.getMejoraContinua().subscribe((data) => {
      this.rolessArray = data;
      this.dataInitial = data;
      //paginado
      const totalPag = data.length;
      this.totalPaginas = Math.ceil(totalPag / 7);
      if (this.totalPaginas == 0) this.totalPaginas = 1;
      
      this.datatotal = this.dataInitial.length;
      this.rolessArray = this.dataInitial.slice(0, 7);
      this.contentArray = data;
      this.currentPage = 1
      if (this.datatotal >= 7) {
        this.totalRegistros = 7;
      } else {
        this.totalRegistros = this.dataInitial.length;
      }
    })
  }

  fnActivityEditarCancelar() {
    this.caracteristicaIndice = -1;
  }

  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;

    if (this.filter.trim() !== '') {
      this.datatotal = this.contentArray.length;
      this.rolessArray = this.contentArray.slice(startItem, endItem)
    } else {
      this.datatotal = this.dataInitial.length;
      this.rolessArray = this.dataInitial.slice(startItem, endItem)
    }
    this.totalRegistros = this.rolessArray.length;
    this.cd.detectChanges();
  }

  fnFiltro() {
    this.showfilter = !this.showfilter;
  }
  //fecini: string;
  //fecfin: string;

  filterResult() {
    this.result = false;
    if (!this.filter) {
      this.rolessArray = this.dataInitial;
      //para el paginado
      this.pages = 1;
      const totalPag = this.rolessArray.length;
      this.totalPaginas = Math.ceil(totalPag / 7);
      if (this.totalPaginas == 0) this.totalPaginas = 1;
      this.contentArray = this.rolessArray;
      this.totalRegistros = this.rolessArray.length;
      this.datatotal = this.rolessArray.length;
      if (this.totalRegistros == this.datatotal && this.totalRegistros >= 7) this.totalRegistros = 7;
      this.rolessArray = this.rolessArray.slice(0, 7);
      return this.rolessArray.length > 0 ? this.rolessArray : this.result = true;
    }
    else {
      let arrayTemp = this.dataInitial.filter((item) =>
        (item.DESCRIPCION.toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
        || (item.NTC.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
        || (item.REQUISITOS.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
        || (item.TIPO.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
        || (item.FECHA_INICIO.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
        || (item.FECHA_FIN.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
        || (item.ESTADO.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
      )
      //this.fecfin = this.form.get('fechafin').value;
      //this.fecini = this.form.get('fechainicio').value;

      //let arrayTemp = this.dataInitial.filter((item) =>
      //  (item.FECHA_INICIO >= this.fecini && item.FECHA_FIN <= this.fecfin)
      //)
      //console.log(arrayTemp);
      this.contentArray = [];
      this.rolessArray = arrayTemp;
      //para el paginado
      this.pages = 1;
      const totalPag = this.rolessArray.length;
      this.totalPaginas = Math.ceil(totalPag / 7);
      if (this.totalPaginas == 0) this.totalPaginas = 1;
      this.contentArray = this.rolessArray;
      this.totalRegistros = this.rolessArray.length;
      this.datatotal = this.rolessArray.length;
      if (this.totalRegistros == this.datatotal && this.totalRegistros >= 7) this.totalRegistros = 7;
      this.rolessArray = this.rolessArray.slice(0, 7);
      return this.rolessArray.length > 0 ? this.rolessArray : this.result = true;
    }
  }

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      this.idrol = Number(rol);
      return Number(rol);
    }
    return 0;
  }


}
