import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { ApiService } from 'src/app/servicios/api/api.service';
import { diagrama } from './diagrama';

@Component({
  selector: 'app-app-proc-requisitos-legales',
  templateUrl: './app-proc-requisitos-legales.component.html',
  styleUrls: ['./app-proc-requisitos-legales.component.css']
})
export class AppProcRequisitosLegalesComponent implements OnInit{
  public formRequisitosLegales!: FormGroup;
  datosUsuario: any = [];
  datos: any = [];
  pst: any;
  logo: any;
  valoresForm: any = [];
  isEditarActivo: boolean = true;
  actualizacion: any;
  evaluacion: any;

  constructor(
    private api: ApiService,  
  ) {}

  ngOnInit() {
    this.formRequisitosLegales = new FormGroup({
      actualizacion: new FormControl('', [Validators.required]),
      evaluacion: new FormControl('', [Validators.required]),
    });
    this.usuario();
    this.updateForm();
  }

  usuario(){
    this.api.getUsuario()
    .subscribe((data: any) => {
      this.datosUsuario = data;
      this.pst = data.NOMBRE_PST;
      this.logo = data.LOGO
    })
  }

  generatePDF(){
    
    var headerElement = {};
  
    if (this.logo == null) {
      headerElement = { text: this.logo, fit: [50, 50], alignment: 'center', margin: [0, 3, 0, 3], rowSpan: 2 };
    } else {
      headerElement = { image: this.logo, fit: [50, 50], alignment: 'center', margin: [0, 3, 0, 3], rowSpan: 2 };
    }
    const pdfDefinition: any = {
      header: {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [     
              headerElement,
              { text: this.pst, alignment: 'center', margin:[ 0, 21, 0, 21 ], rowSpan: 2},
              { text: 'PROCEDIMIENTO PARA LA IDENTIFICACIÓN Y EVALUACIÓN DE REQUISITOS LEGALES', alignment: 'center',rowSpan: 2, margin:[ 0,9,0,9 ] },
              { text: 'CÓDIGO: GS-P-02', alignment: 'center' }
            ],
            [
              {},
              {},
              '',
              { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 12, 0, 12 ] },
            ]
          ]
        },
        margin:[ 45, 8, 45, 8 ],
        fontSize: 11,
      },
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageMargins: [ 45, 80, 45, 80 ],
      content: [
          { text: '1. OBJETIVOS', style: ['subtitulo'] },
          { text: 'Identificar, documentar, tener acceso, cumplir y evaluar los requisitos legales que le sean aplicables a la organización.' },
          '\n',
          { text: '2. ALCANCE', style: ['subtitulo']},
          { text: '​​​Este documento aplica para la normatividad legal en los aspectos turísticos, ambientales, sociales, culturales, económicos y laborales, así como para la normatividad en los ámbitos nacional, regional y local.' },
          '\n',
          { text: '3. DEFINICIONES', style: ['subtitulo']},
          {
            ul: [
              {
                text: [
                  {text: 'Decreto: ', bold: true},
                  '​​Acto administrativo que reglamenta una ley, expedido por el Gobierno nacional',
                ]
              },
              {
                text: [
                  {text: 'Decreto Ley: ', bold: true},
                  '​​norma expedida por el presidente de la república en uso de facultades extraordinarias otorgadas por el congreso nacional, que ostenta la misma jerarquía de una ley',
                ]
              },
              {
                text: [
                  {text: 'Ley: ', bold: true},
                  '​​​Norma expedida y sancionada por el Congreso de la República, de obligatorio cumplimiento.',
                ]
              },
              {
                text: [
                  {text: 'Resolución: ', bold: true},
                  'acto administrativo que reglamenta un decreto o impone unas obligaciones, de carácter general o particular, dependiendo a ​​quién​​ está dirigida y ​​está​​ expedida por los ministerios o demás autoridades administrativas de orden nacional o territorial.​​​',
                ]
              },
            ]
          },
          '\n',
          { text: '4. ACLARACIÓN', style: ['subtitulo'] },
          { text: 'No aplica.' },
          '\n',
          { text: '5. DESCRIPCIÓN DE ACTIVIDADES', style: ['subtitulo'] },
          { text: '5.1. GENERALIDADES', style: ['subtitulo'] },
          { text: '​​Para la identificación y evaluación de los requisitos legales aplicables, debe tenerse en cuenta la normatividad nacional, regional y local aplicable, entre la que se debe considerar:​ ' },
          '\n',
          {
            ul: [
              'La operación del establecimiento',
              'Los planes de ordenamiento territorial',
              'La accesibilidad de instalaciones',
              'La protección de datos personales',
              'La prevención de la explotación sexual comercial de niños, niñas y adolescentes (ESCNNA) y de la trata de personas.',
              'Las zonas de carga y descarga',
              'Uso de recursos naturales',
              'Disposición de Residuos y Vertimientos '
            ]
          },
          '\n',
          { text: '​​Si se realiza alguna otra actividad que requiera cumplir con un marco legal o una licencia o autorización adicional a la de la actividad habitual del establecimiento, ésta debe incluirse en la matriz de requisitos legales​, ​gestionarse, mantenerse vigente, estar en posesión del establecimiento​, ​y velar por su cumplimiento​.'},
          '\n',
          { text: '5.2. CONSULTA E IDENTIFICACIÓN DE LA LEGISLACIÓN  ​​APLICABLE', style: ['subtitulo'] },
          { text: 'El Responsable de Sostenibilidad y los líderes de proceso, deben ​​identificar la normatividad legal aplicable a la organización, consultando, entre otras, las siguientes fuentes de información:'},
          '\n',
          '​​Fuentes para identificar requisitos turísticos:',
          '\n',
          {
            ul: [
              '​Ministerio de Comercio, Industria y Turismo http://www.mincit.gov.co',
              'Alcaldías.',
              '​​​​​Agremiaciones como Cotelco, Acodres, Anato, etc.',
              '​​Fontur. http://fontur.com.co​ ',
              '​​​Superintendencia de Industria y Comercio. https://www.sic.gov.co/'
            ]
          },
          '\n',
          '​​Fuentes para identificar requisitos medioambientales:',
          '\n',
          {
            ul: [
              'Ministerio de Ambiente y Desarrollo Sostenible. http://www.minambiente.gov.co',
              '​​​Secretaría de Salud​​.',
              '​​​​​​​Secretaría de Ambiente.',
              '​​​​​Corporaciones Autónomas Ambientales de la región.​​ '
            ]
          },
          '\n',
          '​​Fuentes para identificar requisitos culturales:',
          '\n',
          {
            ul: [
              '​​Ministerio de Cultura. https://www.mincultura.gov.co',
              '​​​​​​Secretaría de Cultura.',
              '​​​​​​​​​​Gestores culturales.'
            ]
          },
          '\n',
          '​​Fuentes para identificar requisitos económicos:',
          '\n',
          {
            ul: [
              '​​​​Ministerio de trabajo. https://www.mintrabajo.gov.co/',
              '​​​​​​Banco de la República. https://www.banrep.gov.co/es',
              '​​​​​​​​​​​​Ministerio de Comercio, Industria y Turismo. http://www.mincit.gov.co​ ',
              'Dirección de aduanas e impuestos nacionales (DIAN). https://www.dian.gov.co/'
            ]
          },
          '\n',
          '​​​​Fuentes para identificar requisitos laborales:',
          '\n',
          {
            ul: [
              '​​​​Ministerio de trabajo. https://www.mintrabajo.gov.co/',
              '​​​​​​Banco de la República. https://www.banrep.gov.co/es',
              '​​​​​​​​​​​​Ministerio de Comercio, Industria y Turismo. http://www.mincit.gov.co​ ',
              'Dirección de aduanas e impuestos nacionales (DIAN). https://www.dian.gov.co/'
            ]
          },
          '\n',
          '​​Otros sitios web:',
          '\n',
          {
            ul: [
              '​​​​http://www.mitic.gov.co',
              '​​​​​​http://www.mininterior.gov.co',
              '​​​​​​​​​​​​http://www.presidencia.gov.co'
            ]
          },
          '\n',
          '​​Demás páginas web que ​la organización​ considere necesario consultar.',
          '\n',
          { text: '5.3. ELABORACIÓN DE LA MATRIZ DE REQUISITOS LEGALES Y OTROS', style: ['subtitulo'] },
          '​​Una vez se ha identificado la normatividad legal aplicable al establecimiento, el Responsable de Sostenibilidad ​​Líder de sostenibilidad debe elaborar la Matriz de requisitos legales, en la cual se determina la forma de dar cumplimiento por parte de la empresa y se realiza la posterior evaluación.​',
          '\n',
          'La Alta dirección garantiza la disponibilidad de los recursos necesarios para cumplir con las exigencias contempladas en los requisitos de sostenibilidad y otros requisitos identificados en la Matriz de Requisitos Legales.',
          '\n',
          { text: '5.4. ACTUALIZACIÓN DE LA MATRIZ LEGAL', style: ['subtitulo'] },
          { text:'​​El Responsable de Sostenibilidad ​​Líder de sostenibilidad, en conjunto con los líderes de proceso, deben actualizar la matriz de requisitos legales cada vez que se identifique un cambio en la normatividad legal aplicable, nuevas disposiciones que se deban cumplir, o como mínimo cada ' + this.actualizacion }, 
          '\n',
          '​​Los responsables, evalúan si los nuevos requisitos o las modificaciones en materia​ de​ sostenibilidad',
          '\n',
          {
            ul: [
              '​​​​Son de aplicación para la empresa',
              '​​​​​​Permiten asegurar el cumplimiento futuro de la política de sostenibilidad',
              '​​​​​​​​​​​​Afectan a las autorizaciones existentes y a otros requisitos de la organización, como son los programas de sostenibilidad'
            ]
          },
          '\n',
          '​​​En caso afirmativo, se deben incluir los nuevos requisitos en la matriz legal.​​',
          '\n',
          { text: '5.5. COMUNICACIÓN DE LOS REQUISITOS LEGALES Y OTROS REQUISITOS', style: ['subtitulo'] },
          'El Responsable de Sostenibilidad ​de​be​​ comunicar ​los requisitos legales​ a las personas responsables de su cumplimiento, de manera oportuna.​',
          '\n',
          { text: '5.6. EVALUACIÓN DEL CUMPLIMIENTO DE LOS REQUISITOS LEGALES', style: ['subtitulo'] },
          { text: 'El Responsable de Sostenibilidad es el responsable de planificar y gestionar la evaluación del cumplimiento de los requisitos legales aplicables ​en la empresa​. M​ínimo ' + this.evaluacion + ' ​Se ​verifica​ el cumplimiento de ​​la normatividad legal ​​en ​la matriz de requisitos legales​,​ donde se define ​si los requisitos se cumplen, están en proceso o no se cumplen​. Esta evaluación puede realizarse por componente: ambiental, sociocultural, económico u otro, registrando su fecha de evaluación por componente, sin que esta exceda el plazo establecido. Si se presentan hallazgos de cumplimiento parcial o no cumplimiento en la evaluación, se debe establecer el plan de intervención.' },
          '\n',
          { text: '5.7. ELABORACIÓN, EJECUCIÓN Y SEGUIMIENTO DEL PLAN DE INTERVENCIÓN', style: ['subtitulo'] },
          'De acuerdo con los resultados de la evaluación, cuando no se cumple con los requisitos legales se requiere elaborar un plan de intervención que establezca las acciones a realizar, fecha para la ejecución y responsable de la ejecución.  Debe realizarse el respectivo seguimiento y registrar su estado, hasta el cierre del hallazgo.',
          '\n',
          { text: '5.8. DIAGRAMA DE FLUJO', style: ['subtitulo'] },
          '\n',
          { image: diagrama, alignment: 'center' }
      ],
      styles: {
        subtitulo: {
          bold: true, 
          margin:[ 0, 0, 0, 5 ]
        }
      }
    }
    pdfMake.createPdf(pdfDefinition).open();
  }
  
  capturarValor(event: Event) {
    //idSelect: para que al volver a guardar se actualice el valor nuevo que se editó
    const idSelect = (event.target as HTMLSelectElement).id;
   
    const valorSeleccionado = (event.target as HTMLSelectElement).value;
    
    const textoPreg = (event.target as HTMLSelectElement).previousElementSibling?.textContent;
    
    if (textoPreg) {
      const result = this.valoresForm.find((o: any) => o.PREGUNTA === textoPreg);
      if (result) {
        result.RESPUESTA = valorSeleccionado;
      } else {
        this.valoresForm.push({
          ID_RESPUESTA_FORMULARIOS: idSelect ? parseInt(idSelect) : 0,
          FK_MAE_FORMULARIOS: 1,
          PREGUNTA: textoPreg,
          ORDEN: 0,//mel
          RESPUESTA: valorSeleccionado,
          FK_USUARIO: localStorage.getItem('Id')
        });
      }
    }
  }

  saveForm(){  
    this.api.saveForms(this.valoresForm)
    .subscribe( data => {
      
      this.datos = data;
      // Deshabilitar los campos después de guardar
      this.formRequisitosLegales.get('actualizacion')?.disable();
      this.formRequisitosLegales.get('evaluacion')?.disable();
      // Recargar la ventana
      window.location.reload();
    });
  }

  activarCampos(){
      // Habilitar los campos después de guardar
      this.formRequisitosLegales.get('actualizacion')?.enable();
      this.formRequisitosLegales.get('evaluacion')?.enable();
  }

  updateForm() {
    this.api.getForms()
   
    .subscribe((data: any) => {
      this.datos = data;
      
      data.RESPUESTAS.forEach((respuesta: any) => {
        const pregunta = respuesta.PREGUNTA;
        const valorRespuesta = respuesta.ID_RESPUESTA_FORMULARIOS;
        this.formRequisitosLegales.get(pregunta)?.patchValue(valorRespuesta);
       
      });
      if (data.RESPUESTAS && data.RESPUESTAS.length > 0) {
        // Activar boton de editar
        this.isEditarActivo = false
        this.datos = data;

        // Verificar si las respuestas existen y asignar los valores al formulario
        const respuestaActualizacion = this.datos.RESPUESTAS.find(RESPUESTAS => RESPUESTAS.PREGUNTA === '¿Cuál es la frecuencia de actualización de matriz de requisitos legales?');
        const respuestaEvaluacion = this.datos.RESPUESTAS.find(RESPUESTAS => RESPUESTAS.PREGUNTA === '¿Cuál es la frecuencia de evaluación de matriz de requisitos legales?'); 
        if (respuestaActualizacion) {
          this.formRequisitosLegales.get('actualizacion').setValue(respuestaActualizacion.RESPUESTA);
          if (respuestaActualizacion.RESPUESTA === 'semestral') {
            this.actualizacion = 'seis meses.';
          } else if (respuestaActualizacion.RESPUESTA === 'anual') {
            this.actualizacion = 'una vez al año.';
          }
        }  
        if (respuestaEvaluacion) {
          this.formRequisitosLegales.get('evaluacion').setValue(respuestaEvaluacion.RESPUESTA);
          if (respuestaEvaluacion.RESPUESTA === 'semestral') {
            this.evaluacion = 'seis meses.';
          } else if (respuestaEvaluacion.RESPUESTA === 'anual') {
            this.evaluacion = 'una vez al año.';
          }
        }    
        // Deshabilitar los campos después de guardar
        this.formRequisitosLegales.get('actualizacion')?.disable();
        this.formRequisitosLegales.get('evaluacion')?.disable();
      }
    })
  }
}

