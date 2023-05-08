import { compileDeclareInjectorFromMetadata } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { head } from 'lodash';
import { ApiService } from 'src/app/servicios/api/api.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { SpinnerService } from "../../../servicios/spinnerService/spinner.service";
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service' 
//import { Chart } from 'chart.js';

// import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
// import { createCanvas } from 'canvas';
// const chartJSNodeCanvas = require('chartjs-node-canvas');

@Component({
  selector: 'app-app-diagnostico-doc',
  templateUrl: './app-diagnostico-doc.component.html',
  styleUrls: ['./app-diagnostico-doc.component.css']
})
export class AppDiagnosticoDocComponent implements OnInit {
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
  graficosimg: any = [];
  fechaInforme: any;
  review: any;
  listaRequisitos: any = [];
  requisitosCumplidos: any = [];

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
  imgTotal: any;
  imgTotalBar: any;
  numeral: string;
  showModal = false;
  valorModal: any;
  valoresModal: any;
  chartImage: any;
  totalesD: any;
  
  constructor( 
    private router: Router,
    private ApiService: ApiService,
    private http: HttpClient,
    private Message: ModalService,
    private sanitizer: DomSanitizer,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerService.llamarSpinner();
    this.getListaChequeo();
    this.getListaDiagnostico();
    this.getListaPlanMejora();
    //this.spinnerService.detenerSpinner();
  }

  getListaChequeo(){
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
      this.NTCL = a+' '+b
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

  getListaDiagnostico(){
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
      this.NTC = a+' '+b
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
      const arrayLength = this.datosD.agrupacion.length;
      var count = 0;
      const collection = {};
      console.log(this.datosD)
      for(let i = 0; i < arrayLength; i++){
        const obj = this.datosD.agrupacion[i];
        this.listaRequisitos.push(obj.tituloprincipal);
        collection[obj.numeralprincipal] = null;
        let values = {
          'C': 0,
          'NC': 0,
          'CP': 0,
          'NA': 0,
          'OTROS': 0
        }
        obj.listacampos.forEach((lstCampos: any, index) =>{
          switch (lstCampos.calificado) {
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
              collection[obj.numeralprincipal] = safeImageUrl;
              const foundObject = this.datosD.consolidado.find((element: any) => element.requisito === obj.tituloprincipal);
              foundObject.cumple = values.C;
              foundObject.noCumple = values.NC;
              foundObject.cumpleParcial = values.CP;
              foundObject.noAplica = values.NA;
              var sumaTotal = values.C + values.NC + values.CP + values.NA;
              var sumaCumple = values.C + values.CP;
              var porctotal = (sumaCumple / sumaTotal) * 100;
              foundObject.porcCumple = porctotal.toFixed(2);
              count++;
              if (count === arrayLength - 1) {
                setTimeout(() => {
                  this.getTotales();
                  this.getSubtotales();
                }, 1000);
              }
            };
            reader.readAsDataURL(data);
      });
      
      }
      this.graficosimg = collection;
      
      
    })
    // Calcular totales
  }
  getTotales(){
    this.totalesD = {
      cumple: this.datosD.consolidado.reduce((accumulator, obj) => accumulator + parseFloat(obj.cumple), 0).toFixed(2),
      noCumple: this.datosD.consolidado.reduce((accumulator, obj) => accumulator + parseFloat(obj.noCumple), 0).toFixed(2),
      cumpleParcial: this.datosD.consolidado.reduce((accumulator, obj) => accumulator + parseFloat(obj.cumpleParcial), 0).toFixed(2),
      noAplica: this.datosD.consolidado.reduce((accumulator, obj) => accumulator + parseFloat(obj.noAplica), 0).toFixed(2),
      porcCumple: ''
    }
    this.totalesD.porcCumple = (((this.totalesD.cumple) + Number(this.totalesD.cumpleParcial)) / (Number(this.totalesD.cumple) + Number(this.totalesD.noCumple) + Number(this.totalesD.cumpleParcial) + Number(this.totalesD.noAplica)) * 100).toFixed(2);
  }
  getSubtotales(){
    this.datosD.consolidado.forEach((element: any) => {
      this.requisitosCumplidos.push(element.porcCumple);
    });
  }
  getListaPlanMejora(){
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
      this.NTCP = a+' '+b
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
  generateGrafico() {
    try{
      var configChart = `{
        "type": "pie",
        "data": {
          "datasets": [
            {
              "data": [${this.totalesD.noAplica},${this.totalesD.cumpleParcial}, ${this.totalesD.noCumple}, ${this.totalesD.cumple}],
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
            this.imgTotal = safeImageUrl;
              this.generateGraficoBarras();
          };
          reader.readAsDataURL(data);
      });
    }catch(error){
      const title = "Advertencia";
      const message = "Se está generando el documento, por favor intente en unos segundos"
      this.Message.showModal(title,message);
    }
  }
  generateGraficoBarras() {
    console.log(this.listaRequisitos);
    var configChart = `{
      type: 'horizontalBar',
      data: {
        labels: ${JSON.stringify(this.listaRequisitos)},
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
                fontSize: 30
              },
            }],
            yAxes: [{
              ticks: {
                fontSize: 30
              },
            }]
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
    this.ApiService.getGraficoBarras(configChart)
      .subscribe((data: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          const safeImageUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(base64Data);
          this.imgTotalBar = safeImageUrl;
          this.generateDiagnostico();;
        };
        reader.readAsDataURL(data);
  });
    
  }
  
  generateDiagnostico() {
    try {
    console.log(this.imgTotal)
    if(!!!this.datosD){
      const title = "Error";
      const message = "No se encontró información para generar el informe de diagnóstico"
      this.Message.showModal(title,message);
    }else{
      
    const pdfDefinition: any = {
      pageSize: {
        width: 794,
        height: 1123
      },
      pageMargins: [ 30, 30, 30, 30 ],
      content: [
        {
          toc: {
            title: {text: 'Informe de diagnóstico', style: [ 'header' ]}
          }
        },
        {
          table: {
            widths: [ '*', '*', '*', '*' ],
            body: [
              [
                { text: '1. Información general del Prestador de Servicios Turísticos - PST', colSpan: 4, alignment: 'center', bold: true},
                {},
                {},
                {}
              ],
              [
                'Nombre del prestador de servicios turísticos PST',
                {text: this.nombrePstD, colSpan:3, alignment: 'center'},
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
                {text: this.correoResponsableSostenibilidadD, colSpan:2, alignment: 'center'},
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
            widths: [ '*', '*' ],
            body: [
              [
                { text: '2. Metodología de calificación diagnóstico', alignment: 'center', bold: true, colSpan: 2},
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
            widths: [ '*', '*', '*', '*','*' ],
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
          widths: [ 'auto', '*', '*', '*', '*', '*' ],
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
              {text: 'Requisito', alignment: 'center'},
              {text: 'No Aplica', alignment: 'center'},
              {text: 'No Cumple', alignment: 'center'},
              {text: 'Cumple Parcialmente', alignment: 'center'},
              {text: 'Cumple', alignment: 'center'},
              {text: '% Cumplimiento', alignment: 'center'},
            ],
            ...this.datosD.consolidado.map((item: any) => [
              {text: item.requisito},
              {text: item.noAplica, alignment: 'center'},
              {text: item.noCumple, alignment: 'center'},
              {text: item.cumpleParcial, alignment: 'center'},
              {text: item.cumple, alignment: 'center'},
              {text: item.porcCumple + "%", alignment: 'center'}
            ]),
            
            [
              { text: 'TOTAL', style: ['tituloDinamico'] }, 
              {text: this.totalesD.noAplica, alignment: 'center'},
              {text: this.totalesD.noCumple, alignment: 'center'},
              {text: this.totalesD.cumpleParcial, alignment: 'center'},
              {text: this.totalesD.cumple, alignment: 'center'},
              {text: this.totalesD.porcCumple + "%", alignment: 'center' }
            ]
          ],
        },
        fontSize: 10,
      },
      '\n',
      {
        table: {
          widths: [ '*', '*', '*', '*', '*' ],
          body: [
            [
              { text: 'Gráfico por calificación de cumplimiento', alignment: 'center', bold: true, colSpan: 5 },
              {},
              {},
              {},
              {}
            ],
            [
              {
                image:  this.imgTotal.changingThisBreaksApplicationSecurity,
                alignment: 'center',
                colSpan: 5,
                fit: [300, 180] // Especifica las dimensiones deseadas [ancho, alto]
              },
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
          widths: [ '*', '*', '*', '*', '*' ],
          body: [
            [
              { text: 'Gráfico por requisitos de norma', alignment: 'center', bold: true, colSpan: 5 },
              {},
              {},
              {},
              {}
            ],
            [
              {
                image:  this.imgTotalBar.changingThisBreaksApplicationSecurity,
                alignment: 'center',
                colSpan: 5,
                fit: [500, 300] // Especifica las dimensiones deseadas [ancho, alto]
              },
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
          widths: [ '*', '*', '*', '*', '*', '*' ],
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
              { text: 'El prestador de Servicios Turisticos ' + this.nombrePstD + ' cumple en un ' + this.totalesD.porcCumple + '% los requisitos de la norma ' + this.NTC, alignment: 'center', bold: true, colSpan: 6 },
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
              { text: this.totalesD.porcCumple + '%', alignment: 'center' },
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
          widths: [ '*', '*', '*', '*', '*', '*' ],
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
    this.datosD.agrupacion.forEach((obj: any,index) => {
      debugger
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
        {text: this.datosD.consolidado[index].porcCumple + "%", alignment: 'center'},
        {text: this.datosD.consolidado[index].noAplica, alignment: 'center'},
        {text: this.datosD.consolidado[index].noCumple, alignment: 'center'},
        {text: this.datosD.consolidado[index].cumpleParcial, alignment: 'center'},
        {text: this.datosD.consolidado[index].cumple, alignment: 'center'},
      ]);
      pdfDefinition.content[5].table.body.push([
        { text: 'Requisito', style: ['tituloDinamico'] },
        { text: 'Calificación', style: ['tituloDinamico'] },
        { text: 'Observaciones', colSpan: 3, style: ['tituloDinamico'] },
        {},              
        {}
       ]);
      
      obj.listacampos.forEach((i : any) => {
      pdfDefinition.content[5].table.body.push([
        { text: i.tituloRequisito, alignment: 'center' },
        { text: i.calificado, alignment: 'center' },
        { text: i.observacion, colSpan: 3, alignment: 'justify' },
        {},
        {}
      ]);
      });
      pdfDefinition.content[5].table.body.push([
        {
          image: this.graficosimg[obj.numeralprincipal].changingThisBreaksApplicationSecurity,
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
    this.Message.showModal(title,message);
    pdfMake.createPdf(pdfDefinition).download('Informe_de_diagnóstico.pdf');
    }
    } catch (error) {
        const title = "Advertencia";
        const message = "Ocurrió un problema, por favor intente nuevamente"
        this.Message.showModal(title,message);
    }

  }

  generateListaChequeo(){
    if(!!!this.datosL.usuario){
      const title = "No hay datos";
      const message = "No hay datos para generar el informe"
      this.Message.showModal(title,message);
      return;
    }
    const pdfDefinition: any = {
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageMargins: [ 30, 30, 30, 30 ],
      content: [
        {
          toc: {
            title: {text: 'Informe de lista de chequeo', style: [ 'header' ]}
          }
        },
        {
          table: {
            widths: [ '*', '*', '*', '*' ],
            body: [
              [
                { text: '1. Información general del Prestador de Servicios Turísticos - PST', colSpan: 4, alignment: 'center', bold: true},
                {},
                {},
                {}
              ],
              [
                'Nombre del prestador de servicios turísticos PST',
                {text: this.nombrePst, colSpan:3, alignment: 'center'},
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
                {text: this.correoResponsableSostenibilidad, colSpan:2, alignment: 'center'},
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
            widths: [ '*', '*' ],
            body: [
              [
                { text: '2. Metodología de calificación diagnóstico', alignment: 'center', bold: true, colSpan: 2, fontSize: 10},
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
            widths: [ 80, 85, 'auto', 'auto','auto', 'auto' ],
            body: [
              [
                {text: 'Numeral', style: ['tituloDinamico']},
                {text: 'Título del requisito', style: ['tituloDinamico']},
                {text: 'Requisito', style: ['tituloDinamico']},
                {text: 'Posible evidencia', style: ['tituloDinamico']},
                {text: 'Calificación', style: ['tituloDinamico']},
                {text: 'Observaciones', style: ['tituloDinamico']},
              ],
              // Aquí va el título NUMERAL
              ...this.datosL.calificacion.map((item: any) => [
                {text: item.numeral, style: [ 'dinamicTable' ]},
                {text: item.tituloRequisito, style: [ 'dinamicTable' ]},
                {text: item.requisito, fontSize: 10},
                {text: item.evidencia, fontSize: 10},
                {text: item.calificado, style: [ 'dinamicTable' ]},
                {text: item.observacion, style: [ 'dinamicTable' ]}
              ])
            ],
          }
        },
        '\n',
          {
            table: {
              widths: [ '*', '*', '*', '*', '*', '*', '*' ],
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
                  {text: 'Criterios', alignment: 'center'},
                  {text: 'NA', alignment: 'center'},
                  {text: 'NC', alignment: 'center'},
                  {text: 'CP', alignment: 'center'},
                  {text: 'C', alignment: 'center'},
                  {text: 'Total', alignment: 'center'}
                ],
                [
                  {text: 'TOTAL', alignment: 'center'},
                  {text: 'Número de requisitos', alignment: 'center'},
                  {text: this.numeroRequisitoNA, alignment: 'center'},
                  {text: this.numeroRequisitoNC, alignment: 'center'},
                  {text: this.numeroRequisitoCP, alignment: 'center'},
                  {text: this.numeroRequisitoC, alignment: 'center'},
                  {text: this.totalNumeroRequisito, alignment: 'center'}
                ],
                [
                  {text: 'TOTAL', alignment: 'center'},
                  {text: 'Porcentaje  de cumplimiento', alignment: 'center'},
                  {text: this.porcentajeNA, alignment: 'center'},
                  {text: this.porcentajeNC, alignment: 'center'},
                  {text: this.porcentajeCP, alignment: 'center'},
                  {text: this.porcentajeC, alignment: 'center'},
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
    this.Message.showModal(title,message);
    pdfMake.createPdf(pdfDefinition).download('Informe_de_lista_de_chequeo.pdf');
  }

  generatePlanMejora(){
    if(!!!this.datosP.usuario){
      const title = "No hay datos";
      const message = "No hay datos para generar el informe"
      this.Message.showModal(title,message);
      return;
    }
    const pdfDefinition: any = {
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageMargins: [ 30, 30, 30, 30 ],
      content: [
        {
          toc: {
            title: {text: 'Informe de plan de mejora', style: [ 'header' ]}
          }
        },
        {
          table: {
            widths: [ '*', '*', '*', '*' ],
            body: [
              [
                { text: '1. Información general del Prestador de Servicios Turísticos - PST', colSpan: 4, alignment: 'center', bold: true},
                {},
                {},
                {}
              ],
              [
                'Nombre del prestador de servicios turísticos PST',
                {text: this.nombrePstP, colSpan:3, alignment: 'center'},
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
                {text: this.correoResponsableSostenibilidadP, colSpan:2, alignment: 'center'},
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
            widths: [ '*', '*' ],
            body: [
              [
                { text: '2. Metodología de calificación diagnóstico', alignment: 'center', bold: true, colSpan: 2},
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
            widths: [ 80, 85, 'auto', 'auto','auto', 'auto' ],
            body: [
              [
                {text: 'Numeral', style: ['tituloDinamico']},
                {text: 'Titulo del requisito', style: ['tituloDinamico']},
                {text: 'Posible evidencia', style: ['tituloDinamico']},
                {text: 'Estado', style: ['tituloDinamico']},
                {text: 'Actividad general o fase a realizar', style: ['tituloDinamico']},
                {text: 'Duración', style: ['tituloDinamico']},
              ],
              // Aquí va el título NUMERAL
              ...this.datosP.calificacion.map((item: any) => [
                {text: item.numeral, style: [ 'dinamicTable' ]},
                {text: item.tituloRequisito, style: [ 'dinamicTable' ]},
                {text: item.evidencia, fontSize: 10},
                {text: item.calificado, style: [ 'dinamicTable' ]},
                {text: item.observacion, fontSize: 10},
                {text: item.duracion, style: [ 'dinamicTable' ]}
              ]),
            ]
          }
        },
        '\n',
        {
          table: {
            widths: [ '*', '*', '*', '*', '*', '*' ],
            body: [
              [
                { text: 'Responsables	', alignment: 'center', bold: true },
                { text: 'Isoluciones da asistencia técnica (80 horas virtuales y 4 visitas presenciales) y el PST.', colSpan: 5},
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
    this.Message.showModal(title,message);
    pdfMake.createPdf(pdfDefinition).download('Informe_de_plan_de_mejora.pdf');
  }

  saveForm(){
    this.router.navigate(['/dashboard'])
  }
}
