import { Component } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ColorLista } from 'src/app/servicios/api/models/color';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-resultados-encuestas',
  templateUrl: './app-resultados-encuestas.component.html',
  styleUrls: ['./app-resultados-encuestas.component.css']
})

export class AppResultadosEncuestasComponent {
  showModal: boolean = false;
  arrayEncuestas = [];
  colorWallpaper:ColorLista;
  colorTitle:ColorLista;
  isCollapsed = true;
  mostrarNotificacion : boolean = false;
  datos: any = [];
  dataInitial: any = [];
  selectedEncuesta: any = {};
  datosResultados: any = [];

  //paginación
  pages = 1;
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  datatotal: number = 0;
  contentArray: any = [];
  currentPage: number = 1
  filterArray: any = [];

  constructor(
    public ApiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ApiService.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;

    this.fnListEncuestas();
  }

  fnListEncuestas() {
    this.ApiService.getEncuestas().subscribe((data) => {
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

  fnConsultActivities(){
    this.ApiService.getEncuestas().subscribe((data) => {
      this.datos = data;
      this.dataInitial = data;
      
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
  
  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * 7;
    const endItem = event.page * 7;
    this.datos = this.dataInitial.slice(startItem, endItem);
    this.totalRegistros = this.datos.length;
  }  

  personasArray(num: number): number[] {
      return num > 0 ? Array.from({ length: num }, (_, i) => i + 1) : [];
  }
  
  fnShowModal(ID_MAE_ENCUESTA: number) {
      this.selectedEncuesta = this.datos.find((encuesta: any) => encuesta.ID_MAE_ENCUESTA === ID_MAE_ENCUESTA);
      this.showModal = true;

      this.ApiService.getEncuestasResultados(ID_MAE_ENCUESTA)
      .subscribe(data => {
        this.datosResultados = data
        console.log(this.datosResultados)
      })
  }

  fnShowResultados(ID_MAE_ENCUESTA: number, num: number){
    console.log(num)
    this.router.navigate(['/resultadosEncuestasPreguntas', ID_MAE_ENCUESTA, num]);
  }

  getFechaRespuesta(numEncuestado: number): string[] {
    const fechas: string[] = [];
  
    if (this.datosResultados && this.datosResultados.length > 0) {
      const respuestasPersona = this.datosResultados
        .filter(respuesta => respuesta.RESPUESTA && respuesta.RESPUESTA.length > 0)
        .map(respuesta => respuesta.RESPUESTA.find(item => item.NUM_ENCUESTADO === numEncuestado))
        .filter(item => item !== undefined);
  
      respuestasPersona.forEach(item => {
        const fechaReg = item.FECHA_REG;
        const formattedDate = new Date(fechaReg).toLocaleDateString();
        fechas.push(formattedDate);
      });
    }
  
    return fechas;
  }
}