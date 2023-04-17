import { compileDeclareInjectorFromMetadata } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { head } from 'lodash';
import { ApiService } from 'src/app/servicios/api/api.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
// import Swal from 'sweetalert2';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service' 

//import { Chart } from 'chart.js';

//import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
//import { createCanvas } from 'canvas';
//const chartJSNodeCanvas = require('chartjs-node-canvas');


@Component({
  selector: 'app-app-diagnostico-doc',
  templateUrl: './app-diagnostico-doc.component.html',
  styleUrls: ['./app-diagnostico-doc.component.css']
})
export class AppDiagnosticoDocComponent implements OnInit {
  //Lista diagnóstico
  datosD: any = [];
  idnD: string;
  nombrePstD: string;
  nitD: string;
  rntD: string;
  nombreResponsableSostenibilidadD: string;
  telefonoResponsableSostenibilidadD: string;
  correoResponsableSostenibilidadD: string;

  //Lista Pla de nMejora
  datosP: any = [];
  idnP: string;
  nombrePstP: string;
  nitP: string;
  rntP: string;
  nombreResponsableSostenibilidadP: string;
  telefonoResponsableSostenibilidadP: string;
  correoResponsableSostenibilidadP: string;

  //Lista de chequeo
  idnL: string;
  datosL: any = [];
  nombrePst: string;
  nit: string;
  rnt: string;
  nombreResponsableSostenibilidad: string;
  telefonoResponsableSostenibilidad: string;
  correoResponsableSostenibilidad: string;

  numeral: string;
  
  constructor( 
    private router: Router,
    private ApiService: ApiService,
    private http: HttpClient,
    private Message: ModalService,
  ) { }

  ngOnInit(): void {
    this.getListaChequeo();
    this.getListaDiagnostico();
    this.getListaPlanMejora();
  }

  getListaChequeo(){
    var normaValue = window.localStorage.getItem('idNormaSelected');
    var idUsuario = window.localStorage.getItem('Id');
    this.http.get(`https://www.toolbox.somee.com/api/ListaChequeo/ListaChequeo?idnorma=${normaValue}&idusuariopst=${idUsuario}`)
    // this.ApiService.getListaChequeoApi()
    .subscribe((data: any) => {
      this.datosL = data;
      this.nombrePst = this.datosL.usuario?.nombrePst;
      this.nit = this.datosL.usuario?.nit;
      this.rnt = this.datosL.usuario?.rnt;
      const normaValue = JSON.parse(window.localStorage.getItem('norma'));
      this.idnL = normaValue[0].id;
      this.nombreResponsableSostenibilidad = this.datosL.usuario?.nombreResponsableSostenibilidad;
      this.telefonoResponsableSostenibilidad = this.datosL.usuario?.telefonoResponsableSostenibilidad;
      this.correoResponsableSostenibilidad = this.datosL.usuario?.correoResponsableSostenibilidad;
      console.log(this.nombrePst, this.nit, this.rnt, this.nombreResponsableSostenibilidad, this.telefonoResponsableSostenibilidad)
    });
  }

  getListaDiagnostico(){
    var normaValue = window.localStorage.getItem('idNormaSelected');
    var idUsuario = window.localStorage.getItem('Id');
    this.http.get(`https://www.toolbox.somee.com/api/ListaChequeo/ListaDiagnostico?idnorma=${normaValue}&idusuariopst=${idUsuario}`)
    // this.ApiService.getListaDiagnosticoApi()
    .subscribe((data: any) => {
      this.datosD = data;
      this.nombrePstD = this.datosD.usuario?.nombrePst;
      this.nitD = this.datosD.usuario?.nit;
      this.rntD = this.datosD.usuario?.rnt;
      const normaValue = JSON.parse(window.localStorage.getItem('norma'));
      this.idnD = normaValue[0].id;
      this.nombreResponsableSostenibilidadD = this.datosD.usuario?.nombreResponsableSostenibilidad;
      this.telefonoResponsableSostenibilidadD = this.datosD.usuario?.telefonoResponsableSostenibilidad;
      this.correoResponsableSostenibilidadD = this.datosD.usuario?.correoResponsableSostenibilidad;
      console.log(this.nombrePstD, this.nitD, this.rntD, this.idnD, this.nombreResponsableSostenibilidadD)
    });
  }

  getListaPlanMejora(){
    var normaValue = window.localStorage.getItem('idNormaSelected');
    var idUsuario = window.localStorage.getItem('Id');
    this.http.get(`https://www.toolbox.somee.com/api/PlanMejora/PlanMejora?idnorma=${normaValue}&idusuariopst=${idUsuario}`)
    // this.ApiService.getPlanMejoraApi()
    .subscribe((data: any) => {
      this.datosP = data;
      this.nombrePstP = this.datosP.usuario?.nombrePst;
      this.nitP = this.datosP.usuario?.nit;
      this.rntP = this.datosP.usuario?.rnt;
      const normaValue = JSON.parse(window.localStorage.getItem('norma'));
      this.idnP = normaValue[0].id;
      this.nombreResponsableSostenibilidadP = this.datosP.usuario?.nombreResponsableSostenibilidad;
      this.telefonoResponsableSostenibilidadP = this.datosP.usuario?.telefonoResponsableSostenibilidad;
      this.correoResponsableSostenibilidadP = this.datosP.usuario?.correoResponsableSostenibilidad;
    });
  }

  generateDiagnostico() {
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
                'Categoría en el RNT',
                this.datosD.usuario.idCategoriaRnt,
                'Subcategoría en el RNT	',
                this.datosD.usuario.idSubCategoriaRnt
              ],
              [
                'Municipio',
                this.datosD.usuario.municipio,
                'Departamento',
                this.datosD.usuario.departamento
              ],
              [
                'NTC de Turismo',
                this.idnD,
                'Etapa del diagnóstico',
                'Primera Etapa'
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
                  text: 'Califique, acorde con la siguiente escala:\n\nC = Cumple: Se encuentra documentado, implementado, socializado y es adecuado para la organización.\nCP = Cumple parcialmente: Se encuentra parcialmente documentado o en su totalidad pero no está implementado o está en proceso de implementación o se ejecutan actividades pero no están documentadas.\nNC = No cumple: No se ha realizado ninguna acción respecto al requisito.\nNA = No aplica: No es aplicable el requisito a la organización.',
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
        }
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
       {text: obj.porcentajeC, style: ['tituloDinamico']},
       {text: obj.numeroRequisitoNA, style: ['tituloDinamico']},
       {text: obj.numeroRequisitoNC, style: ['tituloDinamico']},
       {text: obj.numeroRequisitoCP, style: ['tituloDinamico']},
       {text: obj.numeroRequisitoC, style: ['tituloDinamico']}
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
// this.datosD.agrupacion.forEach((obj: any) => {
  const data = {
    datasets: [{
      // data: [obj.porcentajeNA, obj.porcentajeNC, obj.porcentajeCP, obj.porcentajeC],
      data: [20, 40, 10, 30],
      backgroundColor: ['red', 'green', 'blue', 'orange']
    }],
    labels: ['NA', 'NC', 'CP', 'C']
  };
  /*const chart = new Chart('canvas', {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            fontColor: 'black',
            fontSize: 14
          }
        },
      },
    }
  });*/
  const imageData = chart.toBase64Image();
  pdfDefinition.content[5].table.body.push([
    {  image: imageData, width: 100, height: 100, alignment: 'center', colSpan: 5 },
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
    
  }

//   generateDiagnostico2() {
//     // Crear el gráfico circular
// // const chartData = {
// //   labels: ['NA', 'NC', 'CP', 'C'],
// //   datasets: [{
// //     data: [this.porcentajeNA, this.porcentajeNC, this.porcentajeCP, this.porcentajeC],
// //     backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
// //   }]
// // };
// // const chartConfig = {
// //   type: 'doughnut',
// //   options: {
// //     responsive: false,
// //     maintainAspectRatio: false
// //   }
// // };
// // const chartCanvas = document.createElement('canvas');
// // const chartCtx = chartCanvas.getContext('2d');
// // const chart: Chart = new Chart(chartCtx, chartConfig);
// // const chart = new Chart(chartCtx, chartConfig);
// // chart.data = chartData;
// // chart.update();
// // const chartImage = chart.toDataURL('image/png'); // Convertir el canvas del gráfico en una imagen base64

//     const pdfDefinition: any = {
//       pageSize: {
//         width: 794,
//         height: 1123
//       },
//       pageMargins: [ 30, 30, 30, 30 ],
//       content: [
//         {
//           toc: {
//             title: {text: 'Informe de diagnóstico', style: [ 'header' ]}
//           }
//         },
//         {
//           table: {
//             widths: [ '*', '*', '*', '*' ],
//             body: [
//               [
//                 { text: '1. Información general del Prestador de Servicios Turísticos - PST', colSpan: 4, alignment: 'center', bold: true},
//                 {},
//                 {},
//                 {}
//               ],
//               [
//                 'Nombre del prestador de servicios turísticos PST',
//                 {text: this.nombrePstD, colSpan:3, alignment: 'center'},
//                 {},
//                 {}
//               ],
//               [
//                 'Número de identificación tributaria NIT',
//                 this.nitD,
//                 'Registro Nacional de Turismo RNT',
//                 this.rntD
//               ],
//               [
//                 'Categoría en el RNT',
//                 '',
//                 'Subcategoría en el RNT	',
//                 ''
//               ],
//               [
//                 'Municipio',
//                 '',
//                 'Departamento',
//                 ''
//               ],
//               [
//                 'NTC de Turismo',
//                 this.idnD,
//                 'Etapa del diagnóstico',
//                 ''
//               ],
//               [
//                 'Nombre del responsable de sostenibilidad',
//                 this.nombreResponsableSostenibilidadD,
//                 'Teléfono de contacto del responsable de sostenibilidad',
//                 this.telefonoResponsableSostenibilidadD
//               ],
//               [
//                 'Correo del responsable de sostenibilidad',
//                 {text: this.correoResponsableSostenibilidadD, colSpan:2, alignment: 'center'},
//                 {},
//                 ''
//               ]
//             ]
//           },
//           fontSize: 10,
//         },
//         '\n',
//         {
//           table: {
//             widths: [ '*', '*' ],
//             body: [
//               [
//                 { text: '2. Metodología de calificación diagnóstico', alignment: 'center', bold: true, colSpan: 2},
//                 {}
//               ],
//               [
//                 {
//                   text: 'Califique, acorde con la siguiente escala:\n\nC = Cumple: Se encuentra documentado, implementado, socializado y es adecuado para la organización.\nCP = Cumple parcialmente: Se encuentra parcialmente documentado o en su totalidad pero no está implementado o está en proceso de implementación o se ejecutan actividades pero no están documentadas.\nNC = No cumple: No se ha realizado ninguna acción respecto al requisito.\nNA = No aplica: No es aplicable el requisito a la organización.',
//                   colSpan: 2
//                 },
//                 {}
//               ]
//             ]
//           },
//           fontSize: 10,
//         },
//         '\n',
//         {
//           table: {
//             widths: [ '*', '*', '*', '*','*' ],
//             body: [
//               [
//                 { text: '3. Resultados del diagnóstico', colSpan: 5, style: ['tituloDinamico'] },
//                 {},
//                 {},
//                 {},
//                 {}
//               ],
//             ],
//           },
//           fontSize: 10,
//         }
//       ],
//       styles: {
//         header: {
//           fontSize: 16,
//           bold: true,
//           margin: [0, 10],
//           alignment: 'center',
//         },
//         tituloDinamico: {
//           alignment: 'center', 
//           bold: true,
//           fontSize: 10,
//         },
//       }
//     }
//     this.datosD.agrupacion.forEach((obj: any) => {
//       pdfDefinition.content[5].table.body.push([
//         { text: obj.tituloprincipal, colSpan: 5, style: ['tituloDinamico'] },
//         {},
//         {},
//         {},
//         {}
//       ]);
//       pdfDefinition.content[5].table.body.push([
//         { text: 'Cumplimiento', style: ['tituloDinamico'] },
//         { text: 'No Aplica', style: ['tituloDinamico'] },
//         { text: 'No Cumple', style: ['tituloDinamico'] },
//         { text: 'Cumple Parcialmente', style: ['tituloDinamico'] },
//         { text: 'Cumple', style: ['tituloDinamico'] }
//       ]);
//       pdfDefinition.content[5].table.body.push([
//        {text: obj.porcentajeC, style: ['tituloDinamico']},
//        {text: obj.numeroRequisitoNA, style: ['tituloDinamico']},
//        {text: obj.numeroRequisitoNC, style: ['tituloDinamico']},
//        {text: obj.numeroRequisitoCP, style: ['tituloDinamico']},
//        {text: obj.numeroRequisitoC, style: ['tituloDinamico']}
//       ]);
//       pdfDefinition.content[5].table.body.push([
//         { text: 'Requisito', style: ['tituloDinamico'] },
//         { text: 'Calificación', style: ['tituloDinamico'] },
//         { text: 'Observaciones', colSpan: 3, style: ['tituloDinamico'] },
//         {},              
//         {}
//       ]);
      
//       obj.listacampos.forEach((i : any) => {
//       pdfDefinition.content[5].table.body.push([
//         { text: i.tituloRequisito, alignment: 'center' },
//         { text: i.calificado, alignment: 'center' },
//         { text: i.observacion, colSpan: 3, alignment: 'justify' },
//         {},
//         {}
//       ]);
//       });
//       // this.datosD.agrupacion.forEach((obj: any) => {
//         const data = {
//           datasets: [{
//             // data: [obj.porcentajeNA, obj.porcentajeNC, obj.porcentajeCP, obj.porcentajeC],
//             data: [20, 40, 10, 30],
//             backgroundColor: ['red', 'green', 'blue', 'orange']
//           }],
//           labels: ['NA', 'NC', 'CP', 'C']
//         };
//         const chart = new Chart('canvas', {
//           type: 'pie',
//           data: data,
//           options: {
//             responsive: true,
//             plugins: {
//               legend: {
//                 position: 'bottom',
//                 labels: {
//                   fontColor: 'black',
//                   fontSize: 14
//                 }
//               },
//             },
//           }
//         });
//         const imageData = chart.toBase64Image();
//         pdfDefinition.content[5].table.body.push([
//           {  image: imageData, width: 100, height: 100, alignment: 'center', colSpan: 5 },
//           {},
//           {},              
//           {},
//           {}
//          ]);
//       // })

//       // });
//       // const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
//       // this.chart = new Chart("canvas", {
//       //   type: "pie",
//       //   data: {
//       //     labels: ['No Aplica', 'No Cumple', 'Cumple Parcialmente', 'Cumple'],
//       //     datasets: [
//       //       {
//       //         data: [
//       //           parseInt(obj.numeroRequisitoNA),
//       //           parseInt(obj.numeroRequisitoNC),
//       //           parseInt(obj.numeroRequisitoCP),
//       //           parseInt(obj.numeroRequisitoC)
//       //         ],
//       //         backgroundColor: colors,
//       //         fill: false
//       //       }
//       //     ]
//       //   }
//       // });
//       // pdfDefinition.content[5].table.body.push([
//       //   { image: this.chart, colSpan: 5, alignment: 'center' },
//       //   {},
//       //   {},
//       //   {},              
//       //   {}
//       //  ]);
//     });
//     const title = "Se descargó correctamente";
//     const message = "La descarga se ha realizado exitosamente"
//     this.Message.showModal(title,message);
//     pdfMake.createPdf(pdfDefinition).download('Informe_de_diagnóstico.pdf');
//   } 


  generateListaChequeo(){
    if(!!!this.datosL){
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
                'Categoría en el RNT',
                this.datosL.usuario.idCategoriaRnt,
                'Subcategoría en el RNT	',
                this.datosL.usuario.idSubCategoriaRnt
              ],
              [
                'Municipio',
                this.datosL.usuario.municipio,
                'Departamento',
                this.datosL.usuario.departamento
              ],
              [
                'NTC de Turismo',
                this.idnL,
                'Etapa del diagnóstico',
                'Primera Etapa'
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
                  text: 'Califique, acorde con la siguiente escala:\n\nC = Cumple: Se encuentra documentado, implementado, socializado y es adecuado para la organización.\nCP = Cumple parcialmente: Se encuentra parcialmente documentado o en su totalidad pero no está implementado o está en proceso de implementación o se ejecutan actividades pero no están documentadas.\nNC = No cumple: No se ha realizado ninguna acción respecto al requisito.\nNA = No aplica: No es aplicable el requisito a la organización.',
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
                {text: 'Titulo del requisito', style: ['tituloDinamico']},
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
                'Categoría en el RNT',
                this.datosP.usuario.idCategoriaRnt,
                'Subcategoría en el RNT',
                this.datosD.usuario.idSubCategoriaRnt
              ],
              [
                'Municipio',
                this.datosP.usuario.municipio,
                'Departamento',
                this.datosP.usuario.departamento
              ],
              [
                'NTC de Turismo',
                this.idnP,
                'Etapa del diagnóstico',
                'Primera Etapa'
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
                  text: 'Califique, acorde con la siguiente escala:\n\nC = Cumple: Se encuentra documentado, implementado, socializado y es adecuado para la organización.\nCP = Cumple parcialmente: Se encuentra parcialmente documentado o en su totalidad pero no está implementado o está en proceso de implementación o se ejecutan actividades pero no están documentadas.\nNC = No cumple: No se ha realizado ninguna acción respecto al requisito.\nNA = No aplica: No es aplicable el requisito a la organización.',
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
        }
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
