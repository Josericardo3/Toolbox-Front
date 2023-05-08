import { compileDeclareInjectorFromMetadata } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { head } from 'lodash';
import { ApiService } from 'src/app/servicios/api/api.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
// import * as d3 from 'd3';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { Chart } from 'chart.js/auto'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { createCanvas } from 'canvas';
const chartJSNodeCanvas = require('chartjs-node-canvas');
import html2canvas from 'html2canvas';
// import * as canvasToBuffer from 'canvas-to-buffer';
// import * as puppeteer from 'puppeteer';
import * as htmlToImage from 'html-to-image';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-app-diagnostico-doc',
  templateUrl: './app-diagnostico-doc.component.html',
  styleUrls: ['./app-diagnostico-doc.component.css']
})
export class AppDiagnosticoDocComponent implements OnInit {
  @ViewChild('chartContainer') chartContainer: ElementRef;
  //Lista diagnóstico
  datosD: any = [];
  NTC: string;
  nombrePstD: string;
  nitD: string;
  rntD: string;
  nombreResponsableSostenibilidadD: string;
  telefonoResponsableSostenibilidadD: string;
  correoResponsableSostenibilidadD: string;
  categoriarntD: string;
  subcategoriarntD: string;
  municipioD: any;
  departamentoD: any;
  etapaD: any;
  totales: any;
  analisis: any;
  etapaInicial: any;
  etapaIntermedia: any;
  etapaFinal: any;
  nombreAsesor: any;
  fechaInforme: any

  //Lista Pla de Mejora
  datosP: any = [];
  NTCP: string;
  nombrePstP: string;
  nitP: string;
  rntP: string;
  nombreResponsableSostenibilidadP: string;
  telefonoResponsableSostenibilidadP: string;
  correoResponsableSostenibilidadP: string;
  categoriarntP: string;
  subcategoriarntP: string;
  municipioP: any;
  departamentoP: any;
  etapaP: any;
  nombreAsesorP: any;
  fechaInformeP: any;

  //Lista de chequeo
  NTCL: string;
  datosL: any = [];
  nombrePst: string;
  nit: string;
  rnt: string;
  nombreResponsableSostenibilidad: string;
  telefonoResponsableSostenibilidad: string;
  correoResponsableSostenibilidad: string;
  categoriarnt: string;
  subcategoriarnt: string;
  municipio: any;
  departamento: any;
  etapa: any;
  numeroRequisitoNA: any;
  numeroRequisitoNC: any;
  numeroRequisitoCP: any;
  numeroRequisitoC: any;
  totalNumeroRequisito: any;
  porcentajeNA: any;
  porcentajeNC: any;
  porcentajeCP: any;
  porcentajeC: any;

  numeral: string;
  showModal = false;
  valorModal: any;
  valoresModal: any;

  chartImage: any;

  imageData: string;
  pdfImage: string;
  dataUrlMain = '';


  constructor(
    private router: Router,
    private ApiService: ApiService,
    private http: HttpClient,
    private Message: ModalService,
  ) { }

  ngOnInit(): void {
  //     // Llamamos a la función captureChart() y luego a generatePDF() en la promesa
  // this.captureChart().then(() => {
  //   this.generatePDF();
  // }).catch((error) => {
  //   console.error('Error al convertir el gráfico en una imagen:', error);
  // });
    this.getListaChequeo();
    this.getListaDiagnostico();
    this.getListaPlanMejora();
  }

  getListaChequeo() {
    // var normaValue = window.localStorage.getItem('idNormaSelected');
    // var idUsuario = window.localStorage.getItem('Id');
    // this.http.get(`https://www.toolbox.somee.com/api/ListaChequeo/ListaChequeo?idnorma=${normaValue}&idusuariopst=${idUsuario}`)
    this.ApiService.getListaChequeoApi()
      .subscribe((data: any) => {
        this.datosL = data;
        this.nombrePst = this.datosL.usuario?.nombrePst;
        this.nit = this.datosL.usuario?.nit;
        this.rnt = this.datosL.usuario?.rnt;
        const normaValue = JSON.parse(window.localStorage.getItem('norma'));
        const idn = normaValue[0].norma;
        const a = idn.split(" ")[0];
        const b = idn.split(" ")[1];
        this.NTCL = a + ' ' + b
        this.nombreResponsableSostenibilidad = this.datosL.usuario?.nombreResponsableSostenibilidad;
        this.telefonoResponsableSostenibilidad = this.datosL.usuario?.telefonoResponsableSostenibilidad;
        this.correoResponsableSostenibilidad = this.datosL.usuario?.correoResponsableSostenibilidad;
        this.categoriarnt = this.datosL.usuario?.categoriarnt;
        this.subcategoriarnt = this.datosL.usuario?.subcategoriarnt;
        this.municipio = this.datosL.usuario?.municipio;
        this.departamento = this.datosL.usuario?.departamento;
        this.etapa = this.datosL.usuario?.etapaDiagnostico;
        this.numeroRequisitoNA = this.datosL.numeroRequisitoNA;
        this.numeroRequisitoNC = this.datosL.numeroRequisitoNC;
        this.numeroRequisitoCP = this.datosL.numeroRequisitoCP;
        this.numeroRequisitoC = this.datosL.numeroRequisitoC;
        this.totalNumeroRequisito = this.datosL.totalNumeroRequisito;
        this.porcentajeNA = this.datosL.porcentajeNA;
        this.porcentajeNC = this.datosL.porcentajeNC;
        this.porcentajeCP = this.datosL.porcentajeCP;
        this.porcentajeC = this.datosL.porcentajeC;
      });
  }

  getListaDiagnostico() {
    // var normaValue = window.localStorage.getItem('idNormaSelected');
    // var idUsuario = window.localStorage.getItem('Id');
    // this.http.get(`https://www.toolbox.somee.com/api/ListaChequeo/ListaDiagnostico?idnorma=${normaValue}&idusuariopst=${idUsuario}`)
    this.ApiService.getListaDiagnosticoApi()
      .subscribe((data: any) => {
        this.datosD = data;
        this.nombrePstD = this.datosD.usuario?.nombrePst;
        this.nitD = this.datosD.usuario?.nit;
        this.rntD = this.datosD.usuario?.rnt;
        const normaValue = JSON.parse(window.localStorage.getItem('norma'));
        const idn = normaValue[0].norma;
        const a = idn.split(" ")[0];
        const b = idn.split(" ")[1];
        this.NTC = a + ' ' + b
        this.nombreResponsableSostenibilidadD = this.datosD.usuario?.nombreResponsableSostenibilidad;
        this.telefonoResponsableSostenibilidadD = this.datosD.usuario?.telefonoResponsableSostenibilidad;
        this.correoResponsableSostenibilidadD = this.datosD.usuario?.correoResponsableSostenibilidad;
        this.categoriarntD = this.datosD.usuario?.categoriarnt;
        this.subcategoriarntD = this.datosD.usuario?.subcategoriarnt;
        this.municipioD = this.datosD.usuario?.municipio,
          this.departamentoD = this.datosD.usuario?.departamento
        this.etapaD = this.datosD.usuario?.etapaDiagnostico;
        this.analisis = this.datosD.analisis;
        this.etapaInicial = this.datosD.etapaInicial;
        this.etapaIntermedia = this.datosD.etapaIntermedia;
        this.etapaFinal = this.datosD.etapaFinal;
        this.nombreAsesor = this.datosD.nombreAsesor;
        this.fechaInforme = this.datosD.fechaInforme;
        // Calcular totales
        this.totales = this.datosD.consolidado.reduce((acc: any, val: any) => {
          acc.noAplica += parseFloat(val.noAplica);
          acc.noCumple += parseFloat(val.noCumple);
          acc.cumpleParcial += parseFloat(val.cumpleParcial);
          acc.cumple += parseFloat(val.cumple);
          return acc;
        }, { noAplica: 0, noCumple: 0, cumpleParcial: 0, cumple: 0 });
      })
  }

  getListaPlanMejora() {
    // var normaValue = window.localStorage.getItem('idNormaSelected');
    // var idUsuario = window.localStorage.getItem('Id');
    // this.http.get(`https://www.toolbox.somee.com/api/PlanMejora/PlanMejora?idnorma=${normaValue}&idusuariopst=${idUsuario}`)
    this.ApiService.getPlanMejoraApi()
      .subscribe((data: any) => {
        this.datosP = data;
        this.nombrePstP = this.datosP.usuario?.nombrePst;
        this.nitP = this.datosP.usuario?.nit;
        this.rntP = this.datosP.usuario?.rnt;
        const normaValue = JSON.parse(window.localStorage.getItem('norma'));
        const idn = normaValue[0].norma;
        const a = idn.split(" ")[0];
        const b = idn.split(" ")[1];
        this.NTCP = a + ' ' + b
        this.nombreResponsableSostenibilidadP = this.datosP.usuario?.nombreResponsableSostenibilidad;
        this.telefonoResponsableSostenibilidadP = this.datosP.usuario?.telefonoResponsableSostenibilidad;
        this.correoResponsableSostenibilidadP = this.datosP.usuario?.correoResponsableSostenibilidad;
        this.categoriarntP = this.datosP.usuario?.categoriarnt;
        this.subcategoriarntP = this.datosP.usuario?.subcategoriarnt;
        this.municipioP = this.datosP.usuario?.municipio;
        this.departamentoP = this.datosP.usuario?.departamento;
        this.etapaP = this.datosP.usuario?.etapaDiagnostico;
        this.nombreAsesorP = this.datosP.nombreAsesor;
        this.fechaInformeP = this.datosP.fechaInforme;
      });
  }

  base64Image: string = "";
  captureChart() {
      this.chartContainer.nativeElement.style.display = 'block';
  
      const data = {
        labels: ['C', 'CP', 'NC', 'NA'],
        datasets: [
          {
            data: [10, 20, 30, 40],
            backgroundColor: ['#00986c', '#2ca880', '#57bd9e', '#7ad3be'],
          },
        ],
      };
  
      const canvas = document.getElementById('myChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'pie',
        data,
      });
  
      // Convertir el gráfico a base64
      const base64Image = canvas.toDataURL('image/png');
      console.log(base64Image)
  
      // Crear el objeto pdfMake y agregar la imagen al documento
      const docDefinition = {
        content: [
          {
            image: base64Image,
            width: 400,
          },
        ],
      };
      pdfMake.createPdf(docDefinition).open();
    
    // this.generatePDF(this.base64Image);
  
    // return new Promise((resolve, reject) => {
    //   if (this.base64Image) {
    //     resolve(this.base64Image);
    //   } else {
    //     reject("Error al convertir el gráfico en una imagen.");
    //   }
    // });
  }

  // generatePDF(base64Image: string) {
  //   const docDefinition: any = {
  //     content: [
  //       { image: base64Image }
  //     ]
  //   };
  //   pdfMake.createPdf(docDefinition).download('chart.pdf');
  // }
  

  // public chart: HTMLCanvasElement;

  // public generatePDF() {
  //   const node = document.querySelector('#chart');

  //   domtoimage.toPng(node).then((dataUrl) => {
  //     const docDefinition = {
  //       content: [{
  //         image: dataUrl,
  //         width: 500
  //       }]
  //     };

  //     pdfMake.createPdf(docDefinition).open();
  //   });
  // }


  generateDiagnostico() {
    if (!!!this.datosD) {
      const title = "Error";
      const message = "No se encontró información para generar el informe de diagnóstico"
      this.Message.showModal(title, message);
    } else {
      // Mostrar temporalmente el contenedor de gráficos

      this.captureChart();
      const pdfDefinition: any = {
        pageSize: {
          width: 794,
          height: 1123
        },
        pageMargins: [30, 30, 30, 30],
        content: [
          {
            toc: {
              title: { text: 'Informe de diagnóstico', style: ['header'] }
            }
          },
          {
            table: {
              widths: ['*', '*', '*', '*'],
              body: [
                [
                  { text: '1. Información general del Prestador de Servicios Turísticos - PST', colSpan: 4, alignment: 'center', bold: true },
                  {},
                  {},
                  {}
                ],
                [
                  'Nombre del prestador de servicios turísticos PST',
                  { text: this.nombrePstD, colSpan: 3, alignment: 'center' },
                  {},
                  {}
                ],
                [
                  'Número de identificación tributaria NIT',
                  this.nitD,
                  'Registro Nacional de Turismo RNT',
                  this.rntD
                ],
                [
                  'Categoría del RNT',
                  this.categoriarntD,
                  'Subcategoría del RNT	',
                  this.subcategoriarntD
                ],
                [
                  'Municipio',
                  this.municipioD,
                  'Departamento',
                  this.departamentoD
                ],
                [
                  'NTC de Turismo',
                  this.NTC,
                  'Etapa del diagnóstico',
                  this.etapaD
                ],
                [
                  'Nombre del responsable de sostenibilidad',
                  this.nombreResponsableSostenibilidadD,
                  'Teléfono de contacto del responsable de sostenibilidad',
                  this.telefonoResponsableSostenibilidadD
                ],
                [
                  'Correo del responsable de sostenibilidad',
                  { text: this.correoResponsableSostenibilidadD, colSpan: 2, alignment: 'center' },
                  {},
                  ''
                ]
              ]
            },
            fontSize: 10,
          },
          '\n',
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { text: '2. Metodología de calificación diagnóstico', alignment: 'center', bold: true, colSpan: 2 },
                  {}
                ],
                [
                  {
                    text: 'Califique, acorde con la siguiente escala:\n\nC = Cumple: Se encuentra documentado, implementado, socializado y es adecuado para la organización.\nCP = Cumple parcialmente: Se encuentra parcialmente documentado o en su totalidad, pero no está implementado o está en proceso de implementación o se ejecutan actividades pero no están documentadas.\nNC = No cumple: No se ha realizado ninguna acción respecto al requisito.\nNA = No aplica: No es aplicable el requisito a la organización.',
                    colSpan: 2
                  },
                  {}
                ]
              ]
            },
            fontSize: 10,
          },
          '\n',
          {
            table: {
              widths: ['*', '*', '*', '*', '*'],
              body: [
                [
                  { text: '3. Resultados del diagnóstico', colSpan: 5, style: ['tituloDinamico'] },
                  {},
                  {},
                  {},
                  {}
                ],
              ],
            },
            fontSize: 10,
          },
          '\n'
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10],
            alignment: 'center',
          },
          tituloDinamico: {
            alignment: 'center',
            bold: true,
            fontSize: 10,
          },
        }
      }
      pdfDefinition.content.push(
        {
          table: {
            widths: ['auto', '*', '*', '*', '*', '*'],
            body: [
              [
                { text: '3. Resultados consolidado diagnóstico', colSpan: 6, style: ['tituloDinamico'] },
                {},
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Requisito', alignment: 'center' },
                { text: 'No Aplica', alignment: 'center' },
                { text: 'No Cumple', alignment: 'center' },
                { text: 'Cumple Parcialmente', alignment: 'center' },
                { text: 'Cumple', alignment: 'center' },
                { text: '% Cumplimiento', alignment: 'center' },
              ],
              ...this.datosD.consolidado.map((item: any) => [
                { text: item.requisito },
                { text: item.noAplica, alignment: 'center' },
                { text: item.noCumple, alignment: 'center' },
                { text: item.cumpleParcial, alignment: 'center' },
                { text: item.cumple, alignment: 'center' },
                { text: item.porcCumple, alignment: 'center' }
              ]),
              [
                { text: 'TOTAL', style: ['tituloDinamico'] },
                { text: this.totales.noAplica.toFixed(0), alignment: 'center' },
                { text: this.totales.noCumple.toFixed(0), alignment: 'center' },
                { text: this.totales.cumpleParcial.toFixed(0), alignment: 'center' },
                { text: this.totales.cumple.toFixed(0), alignment: 'center' },
                { text: ((this.totales.cumple + this.totales.cumpleParcial) / (this.totales.noAplica + this.totales.noCumple + this.totales.cumple + this.totales.cumpleParcial)).toFixed(0) + '%', alignment: 'center' }
              ]
            ],
          },
          fontSize: 10,
        },
        '\n',
        {
          table: {
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Gráfico por calificación de cumplimiento', alignment: 'center', bold: true, colSpan: 5 },
                {},
                {},
                {},
                {}
              ],
              [
                { image: 'this.imgCircular', colSpan: 5 },
                {},
                {},
                {},
                {}
              ]
            ]
          },
          fontSize: 10,
        },
        '\n',
        {
          table: {
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Gráfico por requisitos de norma', alignment: 'center', bold: true, colSpan: 5 },
                {},
                {},
                {},
                {}
              ],
              [
                { image: 'this.imgLineal', colSpan: 5 },
                {},
                {},
                {},
                {}
              ]
            ]
          },
          fontSize: 10,
        },
        '\n',
        {
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              [
                { text: '4. Interpretación de resultados diagnóstico', alignment: 'center', bold: true, colSpan: 6 },
                {},
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'G', colSpan: 6 },
                {},
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Análisis', alignment: 'center', bold: true },
                { text: this.analisis, colSpan: 5 },
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Etapa Inicial', alignment: 'center', bold: true, rowSpan: 2 },
                { text: 'Cumplimiento', alignment: 'center' },
                { text: 'Etapa Intermedia', alignment: 'center', bold: true, rowSpan: 2 },
                { text: 'Cumplimiento', alignment: 'center' },
                { text: 'Etapa Final', alignment: 'center', bold: true, rowSpan: 2 },
                { text: 'Cumplimiento', alignment: 'center' }
              ],
              [
                '',
                { text: this.etapaInicial, alignment: 'center' },
                '',
                { text: this.etapaIntermedia, alignment: 'center' },
                '',
                { text: this.etapaFinal, alignment: 'center' },
              ]
            ]
          },
          fontSize: 10,
        },
        '\n',
        {
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Nombre del Asesor', alignment: 'center', bold: true },
                { text: this.nombreAsesor, colSpan: 2 },
                {},
                { text: 'Fecha del informe', alignment: 'center', bold: true },
                { text: this.fechaInforme, colSpan: 2 },
                {}
              ]
            ]
          },
          fontSize: 10,
        }
      );
      this.datosD.agrupacion.forEach((obj: any) => {
        pdfDefinition.content[5].table.body.push([
          { text: obj.tituloprincipal, colSpan: 5, style: ['tituloDinamico'] },
          {},
          {},
          {},
          {}
        ]);
        pdfDefinition.content[5].table.body.push([
          { text: 'Cumplimiento', style: ['tituloDinamico'] },
          { text: 'No Aplica', style: ['tituloDinamico'] },
          { text: 'No Cumple', style: ['tituloDinamico'] },
          { text: 'Cumple Parcialmente', style: ['tituloDinamico'] },
          { text: 'Cumple', style: ['tituloDinamico'] }
        ]);
        pdfDefinition.content[5].table.body.push([
          { text: obj.porcentajeC, style: ['tituloDinamico'] },
          { text: obj.numeroRequisitoNA, style: ['tituloDinamico'] },
          { text: obj.numeroRequisitoNC, style: ['tituloDinamico'] },
          { text: obj.numeroRequisitoCP, style: ['tituloDinamico'] },
          { text: obj.numeroRequisitoC, style: ['tituloDinamico'] }
        ]);
        pdfDefinition.content[5].table.body.push([
          { text: 'Requisito', style: ['tituloDinamico'] },
          { text: 'Calificación', style: ['tituloDinamico'] },
          { text: 'Observaciones', colSpan: 3, style: ['tituloDinamico'] },
          {},
          {}
        ]);
        obj.listacampos.forEach((i: any) => {
          pdfDefinition.content[5].table.body.push([
            { text: i.tituloRequisito, alignment: 'center' },
            { text: i.calificado, alignment: 'center' },
            { text: i.observacion, colSpan: 3, alignment: 'justify' },
            {},
            {}
          ]);
        });
        pdfDefinition.content[5].table.body.push([
          { text: 'this.chartImage', width: 500, alignment: 'center', colSpan: 5 },
          {},
          {},
          {},
          {}
        ]);
      });
      const title = "Se descargó correctamente";
      const message = "La descarga se ha realizado exitosamente"
      this.Message.showModal(title, message);
      pdfMake.createPdf(pdfDefinition).download('Informe_de_diagnóstico.pdf');
    }
  }

  generateListaChequeo() {
    if (!!!this.datosL.usuario) {
      const title = "No hay datos";
      const message = "No hay datos para generar el informe"
      this.Message.showModal(title, message);
      return;
    }
    const pdfDefinition: any = {
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageMargins: [30, 30, 30, 30],
      content: [
        {
          toc: {
            title: { text: 'Informe de lista de chequeo', style: ['header'] }
          }
        },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: '1. Información general del Prestador de Servicios Turísticos - PST', colSpan: 4, alignment: 'center', bold: true },
                {},
                {},
                {}
              ],
              [
                'Nombre del prestador de servicios turísticos PST',
                { text: this.nombrePst, colSpan: 3, alignment: 'center' },
                {},
                {}
              ],
              [
                'Número de identificación tributaria NIT',
                this.nit,
                'Registro Nacional de Turismo RNT',
                this.rnt
              ],
              [
                'Categoría del RNT',
                this.categoriarnt,
                'Subcategoría del RNT	',
                this.subcategoriarnt
              ],
              [
                'Municipio',
                this.municipio,
                'Departamento',
                this.departamento
              ],
              [
                'NTC de Turismo',
                this.NTCL,
                'Etapa del diagnóstico',
                this.etapa
              ],
              [
                'Nombre del responsable de sostenibilidad',
                this.nombreResponsableSostenibilidad,
                'Teléfono de contacto del responsable de sostenibilidad',
                this.telefonoResponsableSostenibilidad
              ],
              [
                'Correo del responsable de sostenibilidad',
                { text: this.correoResponsableSostenibilidad, colSpan: 2, alignment: 'center' },
                {},
                ''
              ]
            ]
          },
          fontSize: 10,
        },
        '\n',
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: '2. Metodología de calificación diagnóstico', alignment: 'center', bold: true, colSpan: 2, fontSize: 10 },
                {}
              ],
              [
                {
                  text: 'Califique, acorde con la siguiente escala:\n\nC = Cumple: Se encuentra documentado, implementado, socializado y es adecuado para la organización.\nCP = Cumple parcialmente: Se encuentra parcialmente documentado o en su totalidad, pero no está implementado o está en proceso de implementación o se ejecutan actividades pero no están documentadas.\nNC = No cumple: No se ha realizado ninguna acción respecto al requisito.\nNA = No aplica: No es aplicable el requisito a la organización.',
                  colSpan: 2, fontSize: 10
                },
                {}
              ]
            ]
          }
        },
        '\n',
        {
          table: {
            widths: [80, 85, 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Numeral', style: ['tituloDinamico'] },
                { text: 'Título del requisito', style: ['tituloDinamico'] },
                { text: 'Requisito', style: ['tituloDinamico'] },
                { text: 'Posible evidencia', style: ['tituloDinamico'] },
                { text: 'Calificación', style: ['tituloDinamico'] },
                { text: 'Observaciones', style: ['tituloDinamico'] },
              ],
              // Aquí va el título NUMERAL
              ...this.datosL.calificacion.map((item: any) => [
                { text: item.numeral, style: ['dinamicTable'] },
                { text: item.tituloRequisito, style: ['dinamicTable'] },
                { text: item.requisito, fontSize: 10 },
                { text: item.evidencia, fontSize: 10 },
                { text: item.calificado, style: ['dinamicTable'] },
                { text: item.observacion, style: ['dinamicTable'] }
              ])
            ],
          }
        },
        '\n',
        {
          table: {
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: [
              [
                { text: '3. Resultados lista de chequeo', colSpan: 7, style: ['tituloDinamico'] },
                {},
                {},
                {},
                {},
                {},
                {}
              ],
              [
                '',
                { text: 'Criterios', alignment: 'center' },
                { text: 'NA', alignment: 'center' },
                { text: 'NC', alignment: 'center' },
                { text: 'CP', alignment: 'center' },
                { text: 'C', alignment: 'center' },
                { text: 'Total', alignment: 'center' }
              ],
              [
                { text: 'TOTAL', alignment: 'center' },
                { text: 'Número de requisitos', alignment: 'center' },
                { text: this.numeroRequisitoNA, alignment: 'center' },
                { text: this.numeroRequisitoNC, alignment: 'center' },
                { text: this.numeroRequisitoCP, alignment: 'center' },
                { text: this.numeroRequisitoC, alignment: 'center' },
                { text: this.totalNumeroRequisito, alignment: 'center' }
              ],
              [
                { text: 'TOTAL', alignment: 'center' },
                { text: 'Porcentaje  de cumplimiento', alignment: 'center' },
                { text: this.porcentajeNA, alignment: 'center' },
                { text: this.porcentajeNC, alignment: 'center' },
                { text: this.porcentajeCP, alignment: 'center' },
                { text: this.porcentajeC, alignment: 'center' },
                ''
              ]
            ],
          },
          fontSize: 10,
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 10],
          alignment: 'center',
        },
        tituloDinamico: {
          alignment: 'center',
          bold: true,
          fontSize: 10,
        },
        dinamicTable: {
          fontSize: 10,
          alignment: 'center'
        }
      }
    }
    const title = "Se descargó correctamente";
    const message = "La descarga se ha realizado exitosamente"
    this.Message.showModal(title, message);
    pdfMake.createPdf(pdfDefinition).download('Informe_de_lista_de_chequeo.pdf');
  }

  generatePlanMejora() {
    if (!!!this.datosP.usuario) {
      const title = "No hay datos";
      const message = "No hay datos para generar el informe"
      this.Message.showModal(title, message);
      return;
    }
    const pdfDefinition: any = {
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageMargins: [30, 30, 30, 30],
      content: [
        {
          toc: {
            title: { text: 'Informe de plan de mejora', style: ['header'] }
          }
        },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: '1. Información general del Prestador de Servicios Turísticos - PST', colSpan: 4, alignment: 'center', bold: true },
                {},
                {},
                {}
              ],
              [
                'Nombre del prestador de servicios turísticos PST',
                { text: this.nombrePstP, colSpan: 3, alignment: 'center' },
                {},
                {}
              ],
              [
                'Número de identificación tributaria NIT',
                this.nitP,
                'Registro Nacional de Turismo RNT',
                this.rntP
              ],
              [
                'Categoría del RNT',
                this.categoriarntP,
                'Subcategoría del RNT	',
                this.subcategoriarntP
              ],
              [
                'Municipio',
                this.municipioP,
                'Departamento',
                this.departamentoP
              ],
              [
                'NTC de Turismo',
                this.NTCP,
                'Etapa del diagnóstico',
                this.etapaP
              ],
              [
                'Nombre del responsable de sostenibilidad',
                this.nombreResponsableSostenibilidadP,
                'Teléfono de contacto del responsable de sostenibilidad',
                this.telefonoResponsableSostenibilidadP
              ],
              [
                'Correo del responsable de sostenibilidad',
                { text: this.correoResponsableSostenibilidadP, colSpan: 2, alignment: 'center' },
                {},
                ''
              ]
            ]
          },
          fontSize: 10,
        },
        '\n',
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: '2. Metodología de calificación diagnóstico', alignment: 'center', bold: true, colSpan: 2 },
                {}
              ],
              [
                {
                  text: 'Califique, acorde con la siguiente escala:\n\nC = Cumple: Se encuentra documentado, implementado, socializado y es adecuado para la organización.\nCP = Cumple parcialmente: Se encuentra parcialmente documentado o en su totalidad, pero no está implementado o está en proceso de implementación o se ejecutan actividades pero no están documentadas.\nNC = No cumple: No se ha realizado ninguna acción respecto al requisito.\nNA = No aplica: No es aplicable el requisito a la organización.',
                  colSpan: 2
                },
                {}
              ]
            ]
          },
          fontSize: 10,
        },
        '\n',
        {
          table: {
            widths: [80, 85, 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Numeral', style: ['tituloDinamico'] },
                { text: 'Titulo del requisito', style: ['tituloDinamico'] },
                { text: 'Posible evidencia', style: ['tituloDinamico'] },
                { text: 'Estado', style: ['tituloDinamico'] },
                { text: 'Actividad general o fase a realizar', style: ['tituloDinamico'] },
                { text: 'Duración', style: ['tituloDinamico'] },
              ],
              // Aquí va el título NUMERAL
              ...this.datosP.calificacion.map((item: any) => [
                { text: item.numeral, style: ['dinamicTable'] },
                { text: item.tituloRequisito, style: ['dinamicTable'] },
                { text: item.evidencia, fontSize: 10 },
                { text: item.calificado, style: ['dinamicTable'] },
                { text: item.observacion, fontSize: 10 },
                { text: item.duracion, style: ['dinamicTable'] }
              ]),
            ]
          }
        },
        '\n',
        {
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Responsables	', alignment: 'center', bold: true },
                { text: 'Isoluciones da asistencia técnica (80 horas virtuales y 4 visitas presenciales) y el PST.', colSpan: 5 },
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Nombre del Asesor', alignment: 'center', bold: true },
                { text: this.nombreAsesorP, colSpan: 2 },
                {},
                { text: 'Fecha del informe', alignment: 'center', bold: true },
                { text: this.fechaInformeP, colSpan: 2 },
                {}
              ]
            ]
          },
          fontSize: 10,
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 10],
          alignment: 'center',
        },
        planMejora: {
          alignment: 'center',
          bold: true,
          fontSize: 10
        },
        tituloDinamico: {
          alignment: 'center',
          bold: true,
          fontSize: 10,
        },
        dinamicTable: {
          fontSize: 10,
          alignment: 'center'
        }
      }
    }
    const title = "Se descargó correctamente";
    const message = "La descarga se ha realizado exitosamente"
    this.Message.showModal(title, message);
    pdfMake.createPdf(pdfDefinition).download('Informe_de_plan_de_mejora.pdf');
  }

  saveForm() {
    this.router.navigate(['/dashboard'])
  }
}
