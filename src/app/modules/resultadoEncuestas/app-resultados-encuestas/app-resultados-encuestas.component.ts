import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ColorLista } from 'src/app/servicios/api/models/color';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-resultados-encuestas',
  templateUrl: './app-resultados-encuestas.component.html',
  styleUrls: ['./app-resultados-encuestas.component.css']
})

export class AppResultadosEncuestasComponent implements OnInit, AfterViewInit {
  showModal: boolean = false;
  arrayEncuestas = [];
  colorWallpaper: ColorLista;
  colorTitle: ColorLista;
  isCollapsed = true;
  mostrarNotificacion: boolean = false;
  datos: any = [];
  dataInitial: any = [];
  selectedEncuesta: any = {};
  datosResultados: any = [];
  datosIniciales: any = [];
  datosChart: any = [];

  datosTabla = [
    { nombre: 'John', edad: 25, ciudad: 'New York' },
    { nombre: 'Alice', edad: 30, ciudad: 'Los Angeles' },
    { nombre: 'Bob', edad: 28, ciudad: 'Chicago' }
  ];

  columnas = ['nombre', 'edad', 'ciudad'];

  //paginación
  pages = 1;
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  datatotal: number = 0;
  contentArray: any = [];
  currentPage: number = 1
  filterArray: any = [];
  datosResultadosAgrupados: any = {};
  respuestasAgrupadas: { [key: string]: { pregunta: string, tipo: string, respuestas: string[] } } = {};

  constructor(
    public ApiService: ApiService,
    private router: Router
  ) { }

  ngAfterViewInit() {
    // this.radioButton();
  }

  ngOnInit(): void {
    this.ApiService.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;

    this.fnListEncuestas();
    this.fnConsultActivities();
  }

  fnListEncuestas() {
    this.ApiService.getEncuestas().subscribe((data) => {
      this.datos = data;
      this.filterArray = this.datos;
      this.arrayEncuestas = data;
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

  fnConsultActivities() {
    this.ApiService.getEncuestas().subscribe((data: any) => {
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
        if (!data) {
          console.error('Datos vacíos o indefinidos.');
          return;
        }
        this.datosResultados = this.agruparRespuestas(data);
      });

    this.ApiService.diagramasEncuesta(ID_MAE_ENCUESTA)
      .subscribe((data: any) => {
        this.datosChart = data;
        this.datosChart.forEach((preguntaData, index) => {
          this.processPreguntaData('radioButton', preguntaData, index);
          this.processPreguntaData('checkbox', preguntaData, index);
          this.processPreguntaData('desplegable', preguntaData, index);
        });
      });
  }

  agruparRespuestas(data: any[]): any[] {
    const respuestasAgrupadas: any[] = [];

    data.forEach(grupo => {
      const respuestasAgrupadasPorPregunta: any = {};

      grupo.RESPUESTA.forEach(respuesta => {
        if (respuesta.TIPO === 'respuestaCorta' || respuesta.TIPO === 'respuestaLarga') {
          if (!respuestasAgrupadasPorPregunta[respuesta.DESCRIPCION_PREGUNTA]) {
            respuestasAgrupadasPorPregunta[respuesta.DESCRIPCION_PREGUNTA] = [];
          }

          respuestasAgrupadasPorPregunta[respuesta.DESCRIPCION_PREGUNTA].push(respuesta.RESPUESTA);
        }
      });

      const respuestasAgrupadasArray = Object.keys(respuestasAgrupadasPorPregunta).map(descripcion => ({
        DESCRIPCION_PREGUNTA: descripcion,
        RESPUESTAS: respuestasAgrupadasPorPregunta[descripcion],
      }));

      respuestasAgrupadas.push({
        TITULO: grupo.TITULO,
        RESPUESTAS: respuestasAgrupadasArray,
      });
    });

    return respuestasAgrupadas;
  }

  contarRespuestasNoVacias(respuestas: string[]): number {
    return respuestas.filter(r => r !== '').length;
  }

  fnShowResultados(ID_MAE_ENCUESTA: number, num: number) {
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

  //DIAGRAMAS
  labelsRadio: string[][] = [];
  porcentajesRadio: number[][] = [];
  labelsDesplegable: string[][] = [];
  porcentajesDesplegable: number[][] = [];
  labelsCheck: string[][] = [];
  porcentajesCheck: number[][] = [];

  processPreguntaData(tipo: string, preguntaData: any, index: number) {
    switch (tipo) {
      case 'radioButton':
        this.labelsRadio[index] = preguntaData.RESUMEN.map(item => item.ITEM);
        this.porcentajesRadio[index] = preguntaData.RESUMEN.map(item => item.PORCENTAJE);
        break;
      case 'checkbox':
        this.labelsCheck[index] = preguntaData.RESUMEN.map(item => item.ITEM);
        this.porcentajesCheck[index] = preguntaData.RESUMEN.map(item => item.PORCENTAJE);
        break;
      case 'desplegable':
        this.labelsDesplegable[index] = preguntaData.RESUMEN.map(item => item.ITEM);
        this.porcentajesDesplegable[index] = preguntaData.RESUMEN.map(item => item.PORCENTAJE);
        break;
      default:
        console.error(`Tipo de pregunta no reconocido: ${tipo}`);
        break;
    }
  }

  getTotalRadioResponses(resumen: any[]): number {
    return resumen.reduce((total, item) => total + item.N_RESPUESTAS, 0);
  }

  getSumOfNonEmptyResponses(resumen: any[]): number {
    return resumen.filter(respuesta => respuesta.RESPUESTA !== '').length;
  }

  // radioButton() {
  //   if (!this.datosChart || this.datosChart.length === 0) {
  //     return;
  //   }

  //   const radioButtonData = this.datosChart.find(item => item.TIPO === 'radioButton');
  //   const desplegableData = this.datosChart.find(item => item.TIPO === 'desplegable');
  //   const checkData = this.datosChart.find(item => item.TIPO === 'checkbox');

  //   this.labelsRadio = radioButtonData.RESUMEN.map(item => item.ITEM);
  //   this.porcentajesRadio = radioButtonData.RESUMEN.map(item => item.PORCENTAJE);

  //   this.labelsDesplegable = desplegableData.RESUMEN.map(item => item.ITEM);
  //   this.porcentajesDesplegable = desplegableData.RESUMEN.map(item => item.PORCENTAJE);

  //   this.labelsCheck = checkData.RESUMEN.map(item => item.ITEM);
  //   this.porcentajesCheck = checkData.RESUMEN.map(item => item.PORCENTAJE);
  //   console.log(this.labelsCheck, this.porcentajesCheck)
  // }

  // hayPreguntasTipoEspecifico(respuestas: any[], tipo: string): boolean {
  //   return respuestas.some(respuesta => respuesta.TIPO === tipo);
  // }

  // esRespuestaCortaORepsuestaLarga(respuesta: any): boolean {
  //   // Aquí asumimos que tienes un campo "tipo" en tu objeto de respuesta
  //   // que indica el tipo de respuesta (respuestaCorta o respuestaLarga)
  //   return respuesta.tipo === 'respuestaCorta' || respuesta.tipo === 'respuestaLarga';
  // }

}