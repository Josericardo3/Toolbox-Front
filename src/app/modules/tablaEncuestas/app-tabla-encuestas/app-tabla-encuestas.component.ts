import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api/api.service';
import { Router } from '@angular/router';
import { ColorLista } from 'src/app/servicios/api/models/color';

@Component({
  selector: 'app-app-tabla-encuestas',
  templateUrl: './app-tabla-encuestas.component.html',
  styleUrls: ['./app-tabla-encuestas.component.css']
})
export class AppTablaEncuestasComponent implements OnInit, AfterViewInit{
  showModal: boolean = false;
  mostrarBuscador: boolean = false;
  busqueda: string = '';
  arrayEncuestas = [];
  colorWallpaper: ColorLista;
  colorTitle: ColorLista;
  isCollapsed = true;
  mostrarNotificacion: boolean = false;

  indiceAEliminar: number = -1;
  valorRecibido = 0;
  caracteristicaIndiceEliminar: number = -1;

  result: boolean = false;

    //paginación
    pages = 1;
    totalPaginas: number = 0;
    totalRegistros: number = 0;
    datatotal: number = 0;
    contentArray: any = [];
    currentPage: number = 1
    filterArray: any = [];
    datos: any = [];
    dataInitial: any = [];

  constructor(
    public api: ApiService,
    private router: Router
  ) {}

  ngOnInit(){
    this.api.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;
  }

  ngAfterViewInit() {
    this.fnListEncuestas();
  }

  filtrarDatos() {
    this.result = false;
    if (!this.busqueda) {
      this.datos = this.dataInitial;
      this.updatePaginado(this.dataInitial);
      this.result = false;
    }
    else {      
      const terminoBusqueda = this.busqueda.toLowerCase();
      const filter = this.arrayEncuestas.filter((campo: any) =>
        (campo.TITULO && campo.TITULO.toLowerCase().includes(terminoBusqueda)) ||
        (campo.NUM_ENCUESTADOS && campo.NUM_ENCUESTADOS.toString().toLowerCase().includes(terminoBusqueda))
      );
      this.datos = filter;

      this.updatePaginado(filter);
      // Verificar si se encontraron resultados
      if (filter.length === 0) {
        this.result = true;
      }
    }
  }

  fnListEncuestas() {
    this.api.getEncuestas().subscribe((data) => {
      this.datos = data;
      this.filterArray = this.datos;
      this.arrayEncuestas = data;
      this.dataInitial= data;
      
    // Paginado inicial
    const totalPag = data.length;
    this.totalPaginas = Math.ceil(totalPag / 7);
    if (isNaN(this.totalPaginas) || this.totalPaginas === 0) {
      this.totalPaginas = 1;
    }
    this.datatotal = this.dataInitial.length;
    this.datos = this.dataInitial.slice(0, 7);
    this.contentArray = data;
    this.currentPage = 1;
    if (this.datatotal >= 7) {
      this.totalRegistros = 7;
    } else {
      this.totalRegistros = this.dataInitial.length;
    }
    })
  }

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }

  eliminarEncuesta(id: any) {
    this.indiceAEliminar = id;
    console.log(this.indiceAEliminar, id)
  }

  recibirValor(valor: number) {
    this.valorRecibido = valor;
    this.caracteristicaIndiceEliminar = this.valorRecibido;
    if (valor == -2) this.fnListEncuestas();
  }

  editarEncuesta(id: any) {
    this.router.navigate(['/encuesta', 'editar', id]);
  }

  updatePaginado(filter: any) {
    ///para el paginado
    this.pages = 1;
    const totalPag = filter.length;
    this.totalPaginas = Math.ceil(totalPag / 7);
    if (this.totalPaginas == 0) this.totalPaginas = 1;
    this.contentArray = filter;
    this.totalRegistros = filter.length;
    this.datatotal = filter.length;
    if (this.totalRegistros == this.datatotal && this.totalRegistros >= 7) this.totalRegistros = 7;
    filter = filter.slice(0, 7);
    this.datos = filter;
  }
  
  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * 7;
    const endItem = event.page * 7;
    this.datos = this.dataInitial.slice(startItem, endItem);
    this.totalRegistros = this.datos.length;
  }

}
