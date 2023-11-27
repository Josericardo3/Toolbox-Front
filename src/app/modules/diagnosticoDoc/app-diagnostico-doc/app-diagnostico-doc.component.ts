import { compileDeclareInjectorFromMetadata } from '@angular/compiler';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { head } from 'lodash';
import { ApiService } from 'src/app/servicios/api/api.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
// import * as d3 from 'd3';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
// import { Chart } from 'chart.js/auto'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { createCanvas } from 'canvas';
const chartJSNodeCanvas = require('chartjs-node-canvas');
import html2canvas from 'html2canvas';
// import * as canvasToBuffer from 'canvas-to-buffer';
// import * as puppeteer from 'puppeteer';
// import * as htmlToImage from 'html-to-image';
// import domtoimage from 'dom-to-image';
import { headerLogo, footerLogo } from './logoBase64';
//import * as htmlToImage from 'html-to-image';
//import domtoimage from 'dom-to-image';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SpinnerService } from 'src/app/servicios/spinnerService/spinner.service';
import { ColorLista } from 'src/app/servicios/api/models/color';

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
  graficoimg: any;

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
  listaRequisitos: any = [];
  graficosimg: any;
  totalesD: any;
  requisitosCumplidos: any = [];
  currentPage = 1;
  pageCount = 0;
  imgTotalBar: any;
  colorTitle:ColorLista;
  colorWallpaper:ColorLista;

  constructor(
    private router: Router,
    private ApiService: ApiService,
    private http: HttpClient,
    private Message: ModalService,
    private sanitizer: DomSanitizer,
    private spinnerService: SpinnerService,
  ) { }
  
  ngOnInit(): void {
    const id = Number(window.localStorage.getItem('Id'));
    this.ApiService.colorTempo(); 
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;

    this.ApiService.validateCaracterizacion(id).subscribe((data: any) => {
      if (data === true) {
        this.spinnerService.llamarSpinner();
        this.getListaChequeo();
        this.getListaDiagnostico();
        this.getListaPlanMejora();
      }
      else {
        this.router.navigate(['/dashboard']);
       
      }
    })
  }

  getListaChequeo() {
    this.ApiService.getListaChequeoApi()
      .subscribe((data: any) => {
        this.datosL = data;
        this.nombrePst = this.datosL.RESPONSE_USUARIO?.NOMBRE_PST;
        this.nit = this.datosL.RESPONSE_USUARIO?.NIT;
        this.rnt = this.datosL.RESPONSE_USUARIO?.RNT;
        const normaValue = JSON.parse(window.localStorage.getItem('norma'));
        const idn = normaValue[0].NORMA;
        const a = idn.split(" ")[0];
        const b = idn.split(" ")[1];
        this.NTCL = a + ' ' + b
        this.nombreResponsableSostenibilidad = this.datosL.RESPONSE_USUARIO?.NOMBRE_RESPONSABLE_SOSTENIBILIDAD;
        this.telefonoResponsableSostenibilidad = this.datosL.RESPONSE_USUARIO?.TELEFONO_RESPONSABLE_SOSTENIBILIDAD;
        this.correoResponsableSostenibilidad = this.datosL.RESPONSE_USUARIO?.CORREO_RESPONSABLE_SOSTENIBILIDAD;
        this.categoriarnt = this.datosL.RESPONSE_USUARIO?.CATEGORIA_RNT;
        this.subcategoriarnt = this.datosL.RESPONSE_USUARIO?.SUB_CATEGORIA_RNT;
        this.municipio = this.datosL.RESPONSE_USUARIO?.MUNICIPIO;
        this.departamento = this.datosL.RESPONSE_USUARIO?.DEPARTAMENTO;
        this.etapa = this.datosL.RESPONSE_USUARIO?.ETAPA_DIAGNOSTICO;
        this.numeroRequisitoNA = this.datosL.N_REQUISITO_NA;
        this.numeroRequisitoNC = this.datosL.N_REQUISITO_NC;
        this.numeroRequisitoCP = this.datosL.N_REQUISITO_CP;
        this.numeroRequisitoC = this.datosL.N_REQUISITO_C;
        this.totalNumeroRequisito = this.datosL.TOTAL_N_REQUISITO;
        this.porcentajeNA = this.datosL.PORCENTAJE_NA;
        this.porcentajeNC = this.datosL.PORCENTAJE_NC;
        this.porcentajeCP = this.datosL.PORCENTAJE_CP;
        this.porcentajeC = this.datosL.PORCENTAJE_C;
      });
  }

  getListaDiagnostico() {
    this.ApiService.getListaDiagnosticoApi()
      .subscribe((data: any) => {
        this.datosD = data;
        this.nombrePstD = this.datosD.DATA_USUARIO?.NOMBRE_PST;
        this.nitD = this.datosD.DATA_USUARIO?.NIT;
        this.rntD = this.datosD.DATA_USUARIO?.RNT;
        const normaValue = JSON.parse(window.localStorage.getItem('norma'));
        const idn = normaValue[0].NORMA;
        const a = idn.split(" ")[0];
        const b = idn.split(" ")[1];
        this.NTC = a + ' ' + b
        this.nombreResponsableSostenibilidadD = this.datosD.DATA_USUARIO?.NOMBRE_RESPONSABLE_SOSTENIBILIDAD;
        this.telefonoResponsableSostenibilidadD = this.datosD.DATA_USUARIO?.TELEFONO_RESPONSABLE_SOSTENIBILIDAD;
        this.correoResponsableSostenibilidadD = this.datosD.DATA_USUARIO?.CORREO_RESPONSABLE_SOSTENIBILIDAD;
        this.categoriarntD = this.datosD.DATA_USUARIO?.CATEGORIA_RNT;
        this.subcategoriarntD = this.datosD.DATA_USUARIO?.SUB_CATEGORIA_RNT;
        this.municipioD = this.datosD.DATA_USUARIO?.MUNICIPIO,
          this.departamentoD = this.datosD.DATA_USUARIO?.DEPARTAMENTO
        this.etapaD = this.datosD.DATA_USUARIO?.ETAPA_DIAGNOSTICO;
        this.analisis = this.datosD.ANALISIS;
        this.etapaInicial = this.datosD.ETAPA_INICIAL;
        this.etapaIntermedia = this.datosD.ETAPA_INTERMEDIA;
        this.etapaFinal = this.datosD.ETAPA_FINAL;
        this.nombreAsesor = this.datosD.NOMBRE_ASESOR;
        this.fechaInforme = this.datosD.FECHA_INFORME;
        const arrayLength = this.datosD.DATA_AGRUPACION.length;
        let count = 0;
        const collection = {};

        for (let i = 0; i < arrayLength; i++) {
          const obj = this.datosD.DATA_AGRUPACION[i];
          this.listaRequisitos.push(obj.TITULO_PRINCIPAL);
          collection[obj.NUMERAL_PRINCIPAL] = null;
          let values = {
            'C': 0,
            'NC': 0,
            'CP': 0,
            'NA': 0,
            'OTROS': 0
          }

          obj.LISTA_CAMPOS.forEach((lstCampos: any, index) => {
            switch (lstCampos.CALIFICADO) {
              case 'Cumple':
                values.C += 1;
                break;
              case 'No Cumple':
                values.NC += 1;
                break;
              case 'Cumple Parcialmente':
                values.CP += 1;
                break;
              case 'No Aplica':
                values.NA += 1;
                break;
              default:
                values.OTROS += 1;
                break;
            }
          })

          var configChart = `{
            "type": "doughnut",
            "data": {
              "datasets": [
                {
                  "data": [${values.NA},${values.NC}, ${values.CP}, ${values.C}],
                  "backgroundColor": [
                    "rgba(66, 133, 244, 255)",     // Azul
                    "rgba(234, 67, 53, 255)",    // Rojo
                    "rgba(251, 188, 4, 255)",  // Amarillo
                    "rgba(52, 168, 83, 255)"    // Verde
                  ],
                  "label": "Dataset 1"
                }
              ],
              "labels": ["No aplica", "No cumple", "Cumple Parcialmente", "Cumple"]
            },
            "options": {
              "cutout": "60%",
              "plugins": {
                "legend": {
                  "position": "right",
                  "align": "center",
                  "labels": {
                    "color": "black",
                    "fontSize": 16,
                    "fontStyle": "bold",
                    "pointStyle": "rect",
                    "usePointStyle": true,
                    "padding": 10
                  }
                },
                "tooltip": {
                  "enabled": false
                },
                "datalabels": {
                  "display": true,
                  "formatter": function(value, context) {
                    var dataset = context.dataset;
                    var data = dataset.data;
                    var total = data.reduce(function(sum, current) {
                      return sum + current;
                    }, 0);
                    var currentValue = data[context.dataIndex];
                    var percentage = ((currentValue / total) * 100).toFixed(2);
                    return percentage + "%";
                  },
                  "color": "black",
                  "font": {
                    "weight": "normal"
                  },
                  
                }
              }
            },
            "devicePixelRatio": 2,
            "width": 300,
            "height": 300
          }`

          this.ApiService.getGrafico(configChart)
            .subscribe((data: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64Data = reader.result as string;
                const safeImageUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(base64Data);
                collection[obj.NUMERAL_PRINCIPAL] = safeImageUrl;
                const foundObject = this.datosD.DATA_CONSOLIDADO.find((element: any) => element.REQUSITO === obj.TITULO_PRINCIPAL);
                foundObject.CUMPLE = values.C;
                foundObject.NO_CUMPLE = values.NC;
                foundObject.CUMPLE_PARCIAL = values.CP;
                foundObject.NO_APLICA = values.NA;
                var sumaTotal = values.C + values.NC + values.CP + values.NA;
                var sumaCumple = values.C ;
                var porctotal = (sumaCumple / sumaTotal) * 100;
                foundObject.PORC_CUMPLE = porctotal.toFixed(2);
                count++;
                if (count === arrayLength - 1) {
                  setTimeout(() => {
                    this.getTotales();
                    this.getSubtotales();
                    this.generateGrafico();
                  }, 1000);
                }
              };
              reader.readAsDataURL(data);
            });
        }
        this.graficosimg = collection;

        // Calcular totales
        this.totales = this.datosD.DATA_CONSOLIDADO.reduce((acc: any, val: any) => {
          acc.NO_APLICA += parseFloat(val.NO_APLICA);
          acc.NO_CUMPLE += parseFloat(val.NO_CUMPLE);
          acc.CUMPLE_PARCIAL += parseFloat(val.CUMPLE_PARCIAL);
          acc.CUMPLE += parseFloat(val.CUMPLE);
          return acc;
        }, { NO_APLICA: 0, NO_CUMPLE: 0, CUMPLE_PARCIAL: 0, CUMPLE: 0 });
      })
  }

  getTotales() {
    this.totalesD = {
      cumple: this.datosD.DATA_CONSOLIDADO.reduce((accumulator, obj) => accumulator + parseFloat(obj.CUMPLE), 0).toFixed(2),
      noCumple: this.datosD.DATA_CONSOLIDADO.reduce((accumulator, obj) => accumulator + parseFloat(obj.NO_CUMPLE), 0).toFixed(2),
      cumpleParcial: this.datosD.DATA_CONSOLIDADO.reduce((accumulator, obj) => accumulator + parseFloat(obj.CUMPLE_PARCIAL), 0).toFixed(2),
      noAplica: this.datosD.DATA_CONSOLIDADO.reduce((accumulator, obj) => accumulator + parseFloat(obj.NO_APLICA), 0).toFixed(2),
      porcCumple: ''
    }
    this.totalesD.porcCumple = (((this.totalesD.cumple) + Number(this.totalesD.cumpleParcial)) / (Number(this.totalesD.cumple) + Number(this.totalesD.noCumple) + Number(this.totalesD.cumpleParcial) + Number(this.totalesD.noAplica)) * 100).toFixed(2);
  }

  getSubtotales() {
    this.datosD.DATA_CONSOLIDADO.forEach((element: any) => {
      this.requisitosCumplidos.push(element.PORC_CUMPLE);
    });
  }

  getListaPlanMejora() {
    // var normaValue = window.localStorage.getItem('idNormaSelected');
    // var idUsuario = window.localStorage.getItem('Id');
    // this.http.get(`https://www.toolbox.somee.com/api/PlanMejora/PlanMejora?idnorma=${normaValue}&idusuariopst=${idUsuario}`)
    this.ApiService.getPlanMejoraApi()
      .subscribe((data: any) => {
        this.datosP = data;
        this.nombrePstP = this.datosP.USUARIO?.NOMBRE_PST;
        this.nitP = this.datosP.USUARIO?.NIT;
        this.rntP = this.datosP.USUARIO?.RNT;
        const normaValue = JSON.parse(window.localStorage.getItem('norma'));
        const idn = normaValue[0].NORMA;
        const a = idn.split(" ")[0];
        const b = idn.split(" ")[1];
        this.NTCP = a + ' ' + b
        this.nombreResponsableSostenibilidadP = this.datosP.USUARIO?.NOMBRE_RESPONSABLE_SOSTENIBILIDAD;
        this.telefonoResponsableSostenibilidadP = this.datosP.USUARIO?.TELEFONO_RESPONSABLE_SOSTENIBILIDAD;
        this.correoResponsableSostenibilidadP = this.datosP.USUARIO?.CORREO_RESPONSABLE_SOSTENIBILIDAD;
        this.categoriarntP = this.datosP.USUARIO?.CATEGORIA_RNT;
        this.subcategoriarntP = this.datosP.USUARIO?.SUB_CATEGORIA_RNT;
        this.municipioP = this.datosP.USUARIO?.MUNICIPIO;
        this.departamentoP = this.datosP.USUARIO?.DEPARTAMENTO;
        this.etapaP = this.datosP.USUARIO?.ETAPA_DIAGNOSTICO;
        this.nombreAsesorP = this.datosP.NOMBRE_ASESOR;
        this.fechaInformeP = this.datosP.FECHA_INFORME;
      });
  }

  generateGrafico() {
    try {
      var configChart = `{
        "type": "pie",
        "data": {
          "datasets": [
            {
              "data": [${this.totalesD.noAplica},${this.totalesD.noCumple}, ${this.totalesD.cumpleParcial}, ${this.totalesD.cumple}],
              "backgroundColor": [
                "rgba(66, 133, 244, 255)",     // Azul
                "rgba(234, 67, 53, 255)",    // Rojo
                "rgba(251, 188, 4, 255)",  // Amarillo
                "rgba(52, 168, 83, 255)"    // Verde
              ],
              "label": "Dataset 1"
            }
          ],
          "labels": ["No aplica", "No cumple", "Cumple Parcialmente", "Cumple"]
        },
        "options": {
          "cutout": "60%",
          "plugins": {
            "legend": {
              "position": "right",
              "align": "center",
              "labels": {
                "color": "black",
                "fontSize": 16,
                "fontStyle": "bold",
                "pointStyle": "rect",
                "usePointStyle": true,
                "padding": 10
              }
            },
            "tooltip": {
              "enabled": false
            },
            "datalabels": {
              "display": function(context) {
                return context.dataset.data[context.dataIndex] / context.dataset.data.reduce((a, b) => a + b, 0) * 100 > 0;
              },
                "formatter": function(value, context) {
                var dataset = context.dataset;
                var data = dataset.data;
                var total = data.reduce(function(sum, current) {
                  return sum + current;
                }, 0);
                var currentValue = data[context.dataIndex];
                var percentage = ((currentValue / total) * 100).toFixed(2);
                return percentage + "%";
              },
              "color": "black",
              "font": {
                "weight": "normal"
              }
            }
          }
        },
        "devicePixelRatio": 2,
        "width": 300,
        "height": 300
      }`

      this.ApiService.getGrafico(configChart)
        .subscribe((data: Blob) => {


          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result as string;
            const safeImageUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(base64Data);
            this.chartImage = safeImageUrl;

            // yesi this.imgTotal = safeImageUrl;
            this.generateGraficoBarras();
          };
          reader.readAsDataURL(data);
        });
    } catch (error) {
      const title = "Advertencia";
      const message = "Se está generando el documento, por favor intente en unos segundos"
      this.Message.showModal(title, message);
    }
  }

  generateGraficoBarras() {
    const listaRequisitosMayusculas = this.listaRequisitos.map(requisito => requisito.toUpperCase());
    const configChart = `{
      type: 'horizontalBar',
      data: {
        labels: ${JSON.stringify(listaRequisitosMayusculas)},
        datasets: [
          {
            label: 'Cumplimiento',
            data: [${this.requisitosCumplidos.map((cumplimiento) => parseFloat(cumplimiento))}],
            backgroundColor: 'rgba(9,60,146,255)',
            borderColor: 'rgba(9,60,146,255)',
            borderWidth: 1,
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: '#fff',
              font: {
                weight: 'bold',
                size: 16,
              },
              formatter: function(value, context) {
                return value;
              },
              labels: {
                title: {
                  font: {
                    weight: 'bold',
                    size: 16,
                  },
                },
              },
            },
          }, ],
        },
        options: {
          scales: {
            xAxes: [{
              ticks: {
                callback: function(value) {
                  return value + "%";
                },
                suggestedMax: 100,
                beginAtZero: true,
                fontSize: 10
              },
              maxBarThickness: 20,
            }],
            yAxes: [{
              ticks: {
                fontSize: 8
              },
            }
          ]
          },
          legend: {
            display: false
          },
          title: {
            display: false,
          }
        },
      }
    `
    this.ApiService.getGrafico(configChart)
      .subscribe((data: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          const safeImageUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(base64Data);
          this.imgTotalBar = safeImageUrl;
          // this.generateDiagnostico();;
        };
        reader.readAsDataURL(data);
      });
  }

  generateDiagnostico() {
    if (!!!this.datosD) {
      const title = "Error";
      const message = "No se encontró información para generar el informe de diagnóstico"
      this.Message.showModal(title, message);
    } else {
      const pdfDefinition: any = {
        header: {
          columns: [
            { image: headerLogo, fit: [150, 150], style: ['headerLogo'] }
          ]
        },
        footer: function (currentPage: number, pageCount: number) {
          return {
            columns: [
              {
                text: [
                  { text: 'Página ', style: ['footer'], alignment: 'left' },
                  { text: currentPage.toString(), style: ['footerPage'], alignment: 'left' },
                  { text: ' de ', style: ['footer'], alignment: 'left' },
                  { text: pageCount.toString(), style: ['footerPage'], alignment: 'left' }
                ],
                alignment: 'left',
                margin: [30, 20, 20, 20]
              },
              { image: footerLogo, fit: [200, 200], style: ['footerLogo'], alignment: 'right' }
            ]
          }
        },
        pageSize: {
          width: 794,
          height: 1123
        },

        pageMargins: [40, 60, 40, 60],
        content: [
          {
            toc: {
              title: { text: 'INFORME DE DIAGNÓSTICO', style: ['header'] }
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
          headerLogo: {
            margin: [30, 30, 30, 30],
            alignment: 'left'
          },
          footerLogo: {
            margin: [0, 10, 10, 0],
            alignment: 'right'
          },
          footer: {
            fontSize: 10,
            margin: [0, 0, 0, 10],
          },
          footerPage: {
            fontSize: 10,
            bold: true
          }
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
              ...this.datosD.DATA_CONSOLIDADO.map((item: any) => [
                { text: item.REQUSITO },
                { text: item.NO_APLICA, alignment: 'center' },
                { text: item.NO_CUMPLE, alignment: 'center' },
                { text: item.CUMPLE_PARCIAL, alignment: 'center' },
                { text: item.CUMPLE, alignment: 'center' },
                { text: item.PORC_CUMPLE+"%", alignment: 'center' }
              ]),
              [
                { text: 'TOTAL', style: ['tituloDinamico'] },
                { text: this.totales.NO_APLICA.toFixed(0), alignment: 'center' },
                { text: this.totales.NO_CUMPLE.toFixed(0), alignment: 'center' },
                { text: this.totales.CUMPLE_PARCIAL.toFixed(0), alignment: 'center' },
                { text: this.totales.CUMPLE.toFixed(0), alignment: 'center' },
                { text: ((this.totales.CUMPLE)*100 / (this.totales.NO_APLICA + this.totales.NO_CUMPLE + this.totales.CUMPLE + this.totales.CUMPLE_PARCIAL)).toFixed(0) + '%', alignment: 'center' }
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
                {image: this.chartImage ? this.chartImage.changingThisBreaksApplicationSecurity : '',width: 500, alignment: 'center', colSpan: 5 },
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
                { image: this.imgTotalBar? this.imgTotalBar.changingThisBreaksApplicationSecurity: '', alignment: 'center', colSpan: 5 },
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
                { text: '', colSpan: 6 },
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
      this.datosD.DATA_AGRUPACION.forEach((obj: any) => {
        pdfDefinition.content[5].table.body.push([
          { text: obj.TITULO_PRINCIPAL, colSpan: 5, style: ['tituloDinamico'] },
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
          { text: obj.PORCENTAJE_C, style: ['tituloDinamico'] },
          { text: obj.N_REQUISITO_NA, style: ['tituloDinamico'] },
          { text: obj.N_REQUISITO_NC, style: ['tituloDinamico'] },
          { text: obj.N_REQUISITO_CP, style: ['tituloDinamico'] },
          { text: obj.N_REQUISITO_C, style: ['tituloDinamico'] }
        ]);
        pdfDefinition.content[5].table.body.push([
          { text: 'Requisito', style: ['tituloDinamico'] },
          { text: 'Calificación', style: ['tituloDinamico'] },
          { text: 'Observaciones', colSpan: 3, style: ['tituloDinamico'] },
          {},
          {}
        ]);
        obj.LISTA_CAMPOS.forEach((i: any) => {
          pdfDefinition.content[5].table.body.push([
            { text: i.TITULO_REQUISITO, alignment: 'center' },
            { text: i.CALIFICADO, alignment: 'center' },
            { text: i.OBSERVACION, colSpan: 3, alignment: 'justify' },
            {},
            {}
          ]);
        });
        pdfDefinition.content[5].table.body.push([
          {
            image: this.graficosimg[obj.NUMERAL_PRINCIPAL]? this.graficosimg[obj.NUMERAL_PRINCIPAL].changingThisBreaksApplicationSecurity : '',
            alignment: 'center',
            colSpan: 5,
            fit: [300, 180] // Especifica las dimensiones deseadas [ancho, alto]
          },
          {},
          {},
          {},
          {}
        ]);
      });
      const title = "Se descargó correctamente";
      const message = "La descarga se ha realizado exitosamente"
      this.Message.showModal(title, message);
      pdfMake.createPdf(pdfDefinition).open();
    }
  }

  generateListaChequeo() {
    if (!!!this.datosL.RESPONSE_USUARIO) {
      const title = "No hay datos";
      const message = "No hay datos para generar el informe"
      this.Message.showModal(title, message);
      return;
    }
    const pdfDefinition: any = {
      header: {
        columns: [
          { image: headerLogo, fit: [150, 150], style: ['headerLogo'] }
        ]
      },
      footer: function (currentPage: number, pageCount: number) {
        return {
          columns: [
            {
              text: [
                { text: 'Página ', style: ['footer'], alignment: 'left' },
                { text: currentPage.toString(), style: ['footerPage'], alignment: 'left' },
                { text: ' de ', style: ['footer'], alignment: 'left' },
                { text: pageCount.toString(), style: ['footerPage'], alignment: 'left' }
              ],
              alignment: 'left',
              margin: [30, 20, 20, 20]
            },
            { image: footerLogo, fit: [200, 200], style: ['footerLogo'], alignment: 'right' }
          ]
        }
      },
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          toc: {
            title: { text: 'LISTA DE CHEQUEO', style: ['header'] }
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
              ...this.datosL.RESPONSE_CALIFICACION.map((item: any) => [
                { text: item.NUMERAL, style: ['dinamicTable'] },
                { text: item.TITULO_REQUISITO, style: ['dinamicTable'] },
                { text: item.REQUISITO, fontSize: 10 },
                { text: item.EVIDENCIA, fontSize: 10 },
                { text: item.CALIFICADO, style: ['dinamicTable'] },
                { text: item.OBSERVACION, style: ['dinamicTable'] }
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
          margin: [20, 20, 20, 20],
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
        },
        headerLogo: {
          margin: [30, 20, 20, 20],
          alignment: 'left'
        },
        footerLogo: {
          margin: [0, 10, 10, 0],
          alignment: 'right'
        },
        footer: {
          fontSize: 10,
          margin: [0, 0, 0, 10],
        },
        footerPage: {
          fontSize: 10,
          bold: true
        }
      }
    }
    const title = "Se descargó correctamente";
    const message = "La descarga se ha realizado exitosamente"
    this.Message.showModal(title, message);
    pdfMake.createPdf(pdfDefinition).open();
  }

  generatePlanMejora() {
    if (!!!this.datosP.USUARIO) {
      const title = "No hay datos";
      const message = "No hay datos para generar el informe"
      this.Message.showModal(title, message);
      return;
    }
    const pdfDefinition: any = {
      header: {
        columns: [
          { image: headerLogo, fit: [150, 150], style: ['headerLogo'] }
        ]
      },
      footer: function (currentPage: number, pageCount: number) {
        return {
          columns: [
            {
              text: [
                { text: 'Página ', style: ['footer'], alignment: 'left' },
                { text: currentPage.toString(), style: ['footerPage'], alignment: 'left' },
                { text: ' de ', style: ['footer'], alignment: 'left' },
                { text: pageCount.toString(), style: ['footerPage'], alignment: 'left' }
              ],
              alignment: 'left',
              margin: [30, 20, 20, 20]
            },
            { image: footerLogo, fit: [200, 200], style: ['footerLogo'], alignment: 'right' }
          ]
        }
      },
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageMargins: [40, 120, 40, 120],
      content: [
        {
          toc: {
            title: { text: 'PLAN DE MEJORA', style: ['header'] }
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
              ...this.datosP.DATA_CALIFICACION.map((item: any) => [
                { text: item.NUMERAL, style: ['dinamicTable'] },
                { text: item.TITULO_REQUISITO, style: ['dinamicTable'] },
                { text: item.EVIDENCIA, fontSize: 10 },
                { text: item.CALIFICADO, style: ['dinamicTable'] },
                { text: item.OBSERVACION, fontSize: 10 },
                { text: item.DURACION, style: ['dinamicTable'] }
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
        },
        headerLogo: {
          margin: [30, 30, 30, 30],
          alignment: 'left'
        },
        footerLogo: {
          margin: [0, 10, 10, 0],
          alignment: 'right'
        },
        footer: {
          fontSize: 10,
          margin: [0, 0, 0, 10],
        },
        footerPage: {
          fontSize: 10,
          bold: true
        }
      }
    }
    const title = "Se descargó correctamente";
    const message = "La descarga se ha realizado exitosamente"
    this.Message.showModal(title, message);
    pdfMake.createPdf(pdfDefinition).open();
  }
  
  saveForm() {
    this.router.navigate(['/dashboard'])
  }

  coloresProgress: string[] = ['#fc3a3a', '#fc6a3a', '#f5d773'];
}
