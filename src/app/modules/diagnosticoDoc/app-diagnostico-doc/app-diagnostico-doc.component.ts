import { HttpClient } from '@angular/common/http';
import { compileDeclareInjectorFromMetadata } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { head } from 'lodash';
import { ApiService } from 'src/app/servicios/api/api.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-app-diagnostico-doc',
  templateUrl: './app-diagnostico-doc.component.html',
  styleUrls: ['./app-diagnostico-doc.component.css']
})
export class AppDiagnosticoDocComponent implements OnInit {
  datos: any = [];
  datosD: any = [];
  idn: string;

  nombrePst: string;
  nit: string;
  rnt: string;
  nombreResponsableSostenibilidad: string;
  telefonoResponsableSostenibilidad: string;
  correoResponsableSostenibilidad: string;

  numeral: string;
  
  constructor( 
    private router: Router,
    private http: HttpClient,
    private ApiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.getListaChequeo();
    this.getListaDiagnostico();
  }

  getListaChequeo(){
    this.http.get('https://www.toolbox.somee.com/api/Usuario/ListaChequeo?idnorma=5&idusuariopst=15')
    // this.ApiService.getDiagnostico()
    .subscribe((data: any) => {
      this.datos = data;
      this.nombrePst = this.datos.usuario?.nombrePst;
      this.nit = this.datos.usuario?.nit;
      this.rnt = this.datos.usuario?.rnt;
      const normaValue = JSON.parse(window.localStorage.getItem('norma'));
      this.idn = normaValue[0].id;
      this.nombreResponsableSostenibilidad = this.datos.usuario?.nombreResponsableSostenibilidad;
      this.telefonoResponsableSostenibilidad = this.datos.usuario?.telefonoResponsableSostenibilidad;
      this.correoResponsableSostenibilidad = this.datos.usuario?.correoResponsableSostenibilidad;
    });
  }

  getListaDiagnostico(){
    // this.http.get('https://www.toolbox.somee.com/api/Usuario/ListaDiagnostico?idnorma=5&idusuariopst=15')
    this.ApiService.getListaDiagnosticoApi()
    .subscribe((data: any) => {
      this.datosD = data;
      // this.datosD = data;
      this.nombrePst = this.datosD.usuario?.nombrePst;
      this.nit = this.datosD.usuario?.nit;
      this.rnt = this.datosD.usuario?.rnt;
      const normaValue = JSON.parse(window.localStorage.getItem('norma'));
      this.idn = normaValue[0].id;
      this.nombreResponsableSostenibilidad = this.datosD.usuario?.nombreResponsableSostenibilidad;
      this.telefonoResponsableSostenibilidad = this.datosD.usuario?.telefonoResponsableSostenibilidad;
      this.correoResponsableSostenibilidad = this.datosD.usuario?.correoResponsableSostenibilidad;
    });
  }

  getListaPlanMejora(){
    this.http.get('')
    .subscribe((data: any) => {
      this.datos = data;
      this.datos = data;
      this.nombrePst = this.datos.usuario?.nombrePst;
      this.nit = this.datos.usuario?.nit;
      this.rnt = this.datos.usuario?.rnt;
      const normaValue = JSON.parse(window.localStorage.getItem('norma'));
      this.idn = normaValue[0].id;
      this.nombreResponsableSostenibilidad = this.datos.usuario?.nombreResponsableSostenibilidad;
      this.telefonoResponsableSostenibilidad = this.datos.usuario?.telefonoResponsableSostenibilidad;
      this.correoResponsableSostenibilidad = this.datos.usuario?.correoResponsableSostenibilidad;
    });
  }

  generateDiagnostico() {
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
                '',
                'Subcategoría en el RNT	',
                ''
              ],
              [
                'Municipio',
                '',
                'Departamento',
                ''
              ],
              [
                'NTC de Turismo',
                this.idn,
                'Etapa del diagnóstico',
                ''
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
            widths: [ '*', '*', '*', '*', '*' ],
            body: [
              [
                {text: '3. Resultados del diagnóstico', alignment: 'center', bold: true, colSpan: 5},
                {},
                {},
                {},
                {}
              ],
              [
                {text: 'numeraltitulo', alignment: 'center', bold: true, colSpan: 5},
                {},
                {},
                {},
                {}
              ],
              [
                {text: 'Cumplimiento' },
                {text: 'No Aplica' },
                {text: 'No Cumple' },
                {text: 'Cumple Parcialmente	' },
                {text: 'Cumple' }
              ],
              [
                'porNC',      
                'numeroNA',      
                'numeroNC',      
                'numeroCP',      
                'numeroC'
              ],
              [
                {text: 'Requisito', alignment: 'center', bold: true },
                {text: 'Calificación', alignment: 'center', bold: true },
                {text: 'Observaciones', alignment: 'center', bold: true, colSpan: 3 },
                {},
                {}
              ],
              [
                { text: 'req', alignment: 'center', bold: true },      
                { text: 'cal', alignment: 'center', bold: true },      
                { text: 'evi', alignment: 'center', bold: true, colSpan: 3 },      
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
        }
      }
    }

    // Loop through the objects in the 'agrupacion' array and add a new row to the table body for each object
    this.datosD.agrupacion.forEach(obj => {
      pdfDefinition.content[0].table.body.push([
        { text: obj.numeral, colSpan: 5 },
        {},
        {},
        {},
        {}
      ]);
      pdfDefinition.content[0].table.body.push([
        obj.porcentajeNC,
        obj.numeroRequisitoNA,
        obj.numeroRequisitoNC,
        obj.numeroRequisitoCP,
        obj.numeroRequisitoC
      ]);
      pdfDefinition.content[0].table.body.push([
        { text: obj.requisito, alignment: 'justify' },
        { text: obj.calificado },
        { text: obj.evidencia, colSpan: 3 },
        {},
        {}
      ]);
    });

    pdfMake.createPdf(pdfDefinition).download('Informe_de_diagnóstico.pdf');
  }

  generateListaChequeo(){
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
                '',
                'Subcategoría en el RNT	',
                ''
              ],
              [
                'Municipio',
                '',
                'Departamento',
                ''
              ],
              [
                'NTC de Turismo',
                this.idn,
                'Etapa del diagnóstico',
                ''
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
              ...this.datos.calificacion.map((item: any) => [
                {text: item.numeral, style: [ 'dinamicTable' ]},
                {text: item.tituloRequisito, style: [ 'dinamicTable' ]},
                {text: item.requisito, fontSize: 10},
                {text: item.evidencia, fontSize: 10},
                {text: item.calificado, style: [ 'dinamicTable' ]},
                {text: item.observacion, style: [ 'dinamicTable' ]}
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
                '',
                'Subcategoría en el RNT	',
                ''
              ],
              [
                'Municipio',
                '',
                'Departamento',
                ''
              ],
              [
                'NTC de Turismo',
                this.idn,
                'Etapa del diagnóstico',
                ''
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
            widths: [ '*', '*', '*' ],
            body: [
              [
                { text: 'ACCIONES A APLICAR SEGÚN RESULTADOS', colSpan: 3, style: [ 'planMejora' ] },
                {},
                {}
              ],
              [
                { text: 'ACCIÓN PARA NO CUMPLE (NC)', style: [ 'planMejora' ] },
                { text: 'ACCIÓN PARA CUMPLE PARCIALMENTE (CP)', style: [ 'planMejora' ] },
                { text: 'ACCIÓN PARA CUMPLE (C)', style: [ 'planMejora' ] },
              ],
              [
                'Por medio de la asistencia técnica del proyecto se apoyará para que junto al PEST se logre cumplir con los productos.',
                'Se revisará, adecuará, actualizará, implementará y se hará seguimiento durante la asistencia técnica del proyecto para lograr cumplir con la totalidad del requisito.',
                'El PEST debe mantener el cumpliendo de este requisito y nuestra asistencia técnica apoyará para que así sea, acompañando en la implementación del presente requisito.'
              ]
            ]
          }
        },
        '\n',
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
        }
      }
    }
    pdfMake.createPdf(pdfDefinition).download('Informe_de_plan_de_mejora.pdf');
  }

  saveForm(){
    this.router.navigate(['/diagnostico'])
  }
}
