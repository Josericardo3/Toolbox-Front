import { HttpClient } from '@angular/common/http';
import { compileDeclareInjectorFromMetadata } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { head } from 'lodash';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { title } from 'process';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-app-diagnostico-doc',
  templateUrl: './app-diagnostico-doc.component.html',
  styleUrls: ['./app-diagnostico-doc.component.css']
})
export class AppDiagnosticoDocComponent implements OnInit {
  datos: any = [];
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
  ) { }

  ngOnInit(): void {
    this.http.get('https://www.toolbox.somee.com/api/Usuario/ListaChequeo?idnorma=5&idusuariopst=15')
    // this.ApiService.getDiagnostico()
    .subscribe((data: any) => {
      this.datos = data;
      console.log(this.datos, data)
      this.nombrePst = this.datos.usuario?.nombrePst;
      this.nit = this.datos.usuario?.nit;
      this.rnt = this.datos.usuario?.rnt;
      const normaValue = JSON.parse(window.localStorage.getItem('norma'));
      this.idn = normaValue[0].id;
      this.nombreResponsableSostenibilidad = this.datos.usuario?.nombreResponsableSostenibilidad
      this.telefonoResponsableSostenibilidad = this.datos.usuario?.telefonoResponsableSostenibilidad
      this.correoResponsableSostenibilidad = this.datos.usuario?.correoResponsableSostenibilidad
      console.log(this.nombrePst, this.nit, this.rnt, this.idn, this.nombreResponsableSostenibilidad),
   
      
      console.log(this.numeral)
    });
  }

  generateDiagnostico() {
    const pdfDefinition: any = {
      pageSize: {
        width: 793,
        height: 1122,
        margin: 37
      },
      content: [
        {
          toc: {
            title: {text: 'Informe de diagnóstico', style: [ 'header' ]}
          }
        },
        {
          table: {
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
          }
        },
        '\n\n',
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
          }
        },
        '\n\n',
        {
          table: {
            body: [
              [
                { text: '3. Resultados del diagnóstico', colSpan: 5, alignment: 'center', bold: true},
                {},
                {},
                {},
                {}
              ],
              [
                { text: this.numeral, colSpan: 5, alignment: 'center', bold: true},
                {},
                {},
                {},
                {}
              ],
              [
                {text: 'Cumplimiento', bold: true},
                {text: 'No Aplica', bold: true},
                {text: 'No Cumple', bold: true},
                {text: 'Cumple Parcialmente	', bold: true},
                {text: 'Cumple', bold: true},
              ],
              [
                {text: '50%', bold: true},
                {text: '0', bold: true},
                {text: '1', bold: true},
                {text: '2', bold: true},
                {text: '3', bold: true},
              ],
              [
                {text: 'Requisito', bold: true},
                {text: 'Calificación', bold: true},
                {text: 'Observaciones', bold: true, colSpan: 3},
                {},
                {},
              ],
              // Aquí empieza la tabla dinámica
              ...this.datos.calificacion.map((item: any) => [
                item.tituloRequisito,
                item.calificado,
                {text: item.evidencia, colSpan: 3, alignment: 'center'},
                {},
                {},
              ]),
              [
                {Text: 'grafica', colSpan: 5, alignment: 'center'},
                {},
                {},
                {},
                {}
              ]
            ]
          }
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
    pdfMake.createPdf(pdfDefinition).download();
  }

  saveForm(){
    this.router.navigate(['/diagnostico'])
  }
  generate() {
    const pdfDefinition: any = {
      content: [
        {
          table: {
            body: [
              [
                { text: '1. Información general del Prestador de Servicios Turísticos - PST', colSpan: 4, alignment: 'center', bold: true},
                {},
                {},
                {}
              ],
              [              'Nombre del prestador de servicios turísticos PST',              {text: this.nombrePst, colSpan:3, alignment: 'center'},              {},              {}            ],
              [              'Número de identificación tributaria NIT',              this.nit,              'Registro Nacional de Turismo RNT',              this.rnt            ]
            ]
          }
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          table: {
            widths: [ '*', '*' ],
            body: [
              [
                { text: '2. Metodología de calificación diagnóstico', alignment: 'center', bold: true, colSpan: 2},
                {}
              ],
              [              {                text: 'Califique, acorde con la siguiente escala:\n\nC = Cumple: Se encuentra documentado, implementado, socializado y es adecuado para la organización.\nCP = Cumple parcialmente: Se encuentra parcialmente documentado o en su totalidad pero no está implementado o está en proceso de implementación o se ejecutan actividades pero no están documentadas.\nNC = No cumple: No se ha realizado ninguna acción respecto al requisito.\nNA = No aplica: No es aplicable el requisito a la organización.',                colSpan: 2              },              {}            ]
            ]
          }
        }
      ],
    }
    pdfMake.createPdf(pdfDefinition).download();
  }
  
}
