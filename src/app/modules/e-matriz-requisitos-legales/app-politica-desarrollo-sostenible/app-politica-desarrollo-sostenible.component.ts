import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';


class Pregunta {
  PREGUNTA: string;
  RESPUESTA: string;
  ORDEN: number;
  OTRO_VALOR?: string;
  FK_USUARIO: number;
}
class Adicional {
  orden: number;
  preguntas: Pregunta[];
  guardadoMemoria: false;
}


@Component({
  selector: 'app-app-politica-desarrollo-sostenible',
  templateUrl: './app-politica-desarrollo-sostenible.component.html',
  styleUrls: ['./app-politica-desarrollo-sostenible.component.css'],
  providers: [DatePipe]
})
export class AppPoliticaDesarrolloSostenibleComponent implements OnInit {
  estructura: any;
  seleccion: string = '';
  showInput: boolean = false;

  preguntasRespuestasArray: any[] = []

  constructor(
    private Message: ModalService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {
    this.estructura = {
      establecimiento: {} as Pregunta,
      sostenibilidad: {} as Pregunta,
      compromisoEmpresa: {} as Pregunta,
      adicionales: [] as Adicional[]
    };
  }

  ngOnInit() {
    this.usuario();
    this.getDataFor();
  }

  datosUsuario: any = [];
  datos: any = [];
  pst!: string;
  logo: any;
  valoresForm: any = [];
  razonSocial: any;

  usuario() {
    this.api.getUsuario()
      .subscribe((data: any) => {
        this.datosUsuario = data;
        this.pst = data.NOMBRE_PST;
        this.logo = data.LOGO
        this.razonSocial = data.RAZON_SOCIAL_PST;
      })
  }
  establecimiento: any;

  disableBtn = false;
  disableBtnEditar: boolean = false;

  accionActivo = "";

  edicion: boolean = false;
  pilaresEstrategicos: any;
  compromiso: any;
  diferenciadores: any;
  comoSeComunica: any;
  quienComunica: any;
  cuando: any;
  dondeEstaraDisponible: any;
  disablePDF: boolean = false;
  ubicación: string = '';
  getDataFor() {
    this.api.getDataForm()
      .subscribe((response: any) => {
        let data = response.RESPUESTAS;
        this.ubicación = response.DEPARTAMENTO + ', ' + response.MUNICIPIO
        if (data.length > 0) { //ya hubo registro previo "ESTO ES EDICION"
          this.accionActivo = "editar";
          this.edicion = true;
          this.disableBtn = true;
          this.disableBtnEditar = false;
          this.diferenciadores = data[0].RESPUESTA;
          this.pilaresEstrategicos = data[1].RESPUESTA;
          this.compromiso = data[2].RESPUESTA;
          // this.data = data
          const preguntaEstablecimiento = '¿Cuáles son los principales componentes o los tópicos o diferenciadores que resalta en la misión de su establecimiento?';
          const preguntaSostenibilidad = '¿Cuáles son los principales pilares o componentes del plan estratégico que desea promover y priorizar?';
          const preguntaCompromiso = '¿Cuál es el compromiso de la empresa con el sistema de gestión de sostenibilidad?'

          this.estructura.establecimiento = data.find(item => item.PREGUNTA === preguntaEstablecimiento);
          this.estructura.sostenibilidad = data.find(item => item.PREGUNTA === preguntaSostenibilidad);
          this.estructura.compromisoEmpresa = data.find(item => item.PREGUNTA === preguntaCompromiso);

          let datosAgrupados = this.groupBy(response.RESPUESTA_GRILLA, 'ORDEN');

          Object.keys(datosAgrupados).forEach((orden) => {
            const tab = {
              orden: Number(orden),
              preguntas: datosAgrupados[orden].map((e: any) => {
                if (e.PREGUNTA === "¿Cuándo?") {
                  e.RESPUESTA = e.RESPUESTA.trim() == "" ? "" : new Date(e.RESPUESTA);
                }
                return e;
              })
            };
            this.estructura.adicionales.push(tab);
          });
          //ordenamiento

          let ordenPregunta1 = "¿Cómo se comunica la política?";
          let ordenPregunta2 = "¿Quién comunica?";
          let ordenPregunta3 = "¿Cuándo?";
          let ordenPregunta4 = "¿Dónde estará disponible?";

          this.estructura.adicionales.forEach(tab => {
            let preguntasOrdenado = []
            tab.preguntas.forEach(item => {
              if (ordenPregunta1 == item.PREGUNTA) {
                preguntasOrdenado[0] = item;
              }
              else if (ordenPregunta2 == item.PREGUNTA) {
                preguntasOrdenado[1] = item;
              }
              else if (ordenPregunta3 == item.PREGUNTA) {
                preguntasOrdenado[2] = item;
              }
              else if (ordenPregunta4 == item.PREGUNTA) {
                preguntasOrdenado[3] = item;
              }
            });
            tab.preguntas = preguntasOrdenado;
            tab.preguntas = tab.preguntas.map((valor:any)=>{
               valor.OTRO_VALOR= ""
               if(valor.RESPUESTA !== 'Página web' && valor.RESPUESTA !== 'Redes sociales') valor.OTRO_VALOR= valor.RESPUESTA;
               return valor; 
            })
          });
        }
        else {  //no existe registro previo  "NUEVO"
          this.accionActivo = "guardar";
          this.edicion = false;
          this.disableBtnEditar = true;
          this.disablePDF = true;
          let id = localStorage.getItem('Id');
          this.estructura.establecimiento = {
            "ID_RESPUESTA_FORMULARIOS": 0,
            "FK_MAE_FORMULARIOS": 3,
            "PREGUNTA": "¿Cuáles son los principales componentes o los tópicos o diferenciadores que resalta en la misión de su establecimiento?",
            "ORDEN": 0,
            "RESPUESTA": "",
            "OTRO_VALOR": "",
            "FK_USUARIO": Number(id)
          }

          this.estructura.sostenibilidad = {
            "ID_RESPUESTA_FORMULARIOS": 0,
            "FK_MAE_FORMULARIOS": 3,
            "PREGUNTA": "¿Cuáles son los principales pilares o componentes del plan estratégico que desea promover y priorizar?",
            "ORDEN": 0,
            "RESPUESTA": "",
            "OTRO_VALOR": "",
            "FK_USUARIO": Number(id)
          }

          this.estructura.compromisoEmpresa = {
            "ID_RESPUESTA_FORMULARIOS": 0,
            "FK_MAE_FORMULARIOS": 3,
            "PREGUNTA": "¿Cuál es el compromiso de la empresa con el sistema de gestión de sostenibilidad?",
            "ORDEN": 0,
            "RESPUESTA": "",
            "OTRO_VALOR": "",
            "FK_USUARIO": Number(id)
          }

        }
      })
  }

  saveForm() {
    let id = localStorage.getItem('Id');
    let preguntasRequest = [];

    this.estructura.compromisoEmpresa.FK_USUARIO = Number(id);
    preguntasRequest[0] = this.estructura.compromisoEmpresa;

    this.estructura.establecimiento.FK_USUARIO = Number(id);
    preguntasRequest[1] = this.estructura.establecimiento;

    this.estructura.sostenibilidad.FK_USUARIO = Number(id);
    preguntasRequest[2] = this.estructura.sostenibilidad;

    let indice = 3;
    this.estructura.adicionales.forEach(tab => {
      tab.preguntas.forEach(item => {
        if (typeof item.RESPUESTA !== "string" && item.pregunta == "¿Cuándo?") {
          item.RESPUESTA = this.datePipe.transform(item.RESPUESTA, 'dd-MM-yyyy')
        }
        if (item.PREGUNTA == "¿Dónde estará disponible?" && item.RESPUESTA == "Otro") {
          item.RESPUESTA = item.OTRO_VALOR;
        }
        preguntasRequest[indice] = item;
        item.FK_USUARIO = Number(id);
        indice++;
      });
    });
    this.api.saveForms(preguntasRequest)
      .subscribe((data: any) => {
        if (data.StatusCode === 200) {
          this.disablePDF = false;
          this.botonCancelar = false;
          this.botonOcultar = true;
          const title = "Operacion Exitosa.";
          const message = data.Message;
          this.estructura = {
            establecimiento: {} as Pregunta,
            sostenibilidad: {} as Pregunta,
            compromisoEmpresa: {} as Pregunta,
            adicionales: [] as Adicional[]
          };
          this.getDataFor();
          this.Message.showModal(title, message);
        }
      });
  }

  botonCancelar: boolean = false;
  ocultarEditar: boolean = false;
  botonOcultar: boolean = true;
  activarCampos() {
    this.accionActivo = "guardar";
    this.disableBtn = false;
    this.botonCancelar = true;
    this.ocultarEditar = true;
    this.botonOcultar = false;
    this.disablePDF = true;
    this.disableDelete = false;
  }
  llenadoIncorrecto(): boolean {
    let incorrecto = true;
    if (this.estructura.establecimiento.RESPUESTA.trim() == "" ||
      this.estructura.sostenibilidad.RESPUESTA.trim() == "" ||
      this.estructura.compromisoEmpresa.RESPUESTA.trim() == "") {
      incorrecto = true;
    }
    else incorrecto = false;
    
    this.estructura.adicionales.forEach(tab => {

      tab.preguntas.forEach(item => {

        if( item.PREGUNTA == "¿Cuándo?" ){

          if (typeof item.RESPUESTA == "string") {
            if (item.RESPUESTA.trim() == "") incorrecto = true;
          }
          else if (item.RESPUESTA === undefined)incorrecto = true;
        }
       else if (item.RESPUESTA.trim() == "") {
          incorrecto = true;
        }

       else if (item.RESPUESTA.trim() == "") {

          incorrecto = true;

        }

        if (item.RESPUESTA == "Otro" && item.OTRO_VALOR.trim() == "") {

          incorrecto = true;

        }

      });

    });

    return incorrecto;
  }
  cancelarEdit() {
    this.botonOcultar = true;
    this.botonCancelar = false;
    this.disablePDF = false;
    this.disableDelete = true;
    this.estructura = {
      establecimiento: {} as Pregunta,
      sostenibilidad: {} as Pregunta,
      compromisoEmpresa: {} as Pregunta,
      adicionales: [] as Adicional[]
    };
    this.getDataFor();
  }

  agregarAdicional() {
    let id = localStorage.getItem('Id');
    let maxOrden = this.estructura.adicionales.reduce((max, adicional) => {
      return adicional.orden > max ? adicional.orden : max;
    }, 0);
    let newOrden = maxOrden + 1;
    const tab = {
      orden: newOrden,
      preguntas: [
        {
          "ID_RESPUESTA_FORMULARIOS": 0,
          "FK_MAE_FORMULARIOS": 3,
          "PREGUNTA": "¿Cómo se comunica la política?",
          "ORDEN": newOrden,
          "RESPUESTA": "",
          "OTRO_VALOR": "",
          "FK_USUARIO": Number(id)
        },
        {
          "ID_RESPUESTA_FORMULARIOS": 0,
          "FK_MAE_FORMULARIOS": 3,
          "PREGUNTA": "¿Quién comunica?",
          "ORDEN": newOrden,
          "RESPUESTA": "",
          "OTRO_VALOR": "",
          "FK_USUARIO": Number(id)
        },
        {
          "ID_RESPUESTA_FORMULARIOS": 0,
          "FK_MAE_FORMULARIOS": 3,
          "PREGUNTA": "¿Cuándo?",
          "ORDEN": newOrden,
          "RESPUESTA": "",
          "OTRO_VALOR": "",
          "FK_USUARIO": Number(id)
        },
        {
          "ID_RESPUESTA_FORMULARIOS": 0,
          "FK_MAE_FORMULARIOS": 3,
          "PREGUNTA": "¿Dónde estará disponible?",
          "ORDEN": newOrden,
          "RESPUESTA": "",
          "OTRO_VALOR": "",
          "FK_USUARIO": Number(id)
        }
      ]
    };
    this.estructura.adicionales.push(tab);
  }
  disableDelete: boolean = true;
  eliminarTab(orden: number) {
    // this.tabs = this.tabs.filter(tab => tab.id !== id);

    const arrayTempoDelete = [];
    const tempo = this.estructura.adicionales.filter(tab => tab.orden === orden);
    for (let i = 0; i < tempo.length; i++) {
      if (tempo[i].orden === orden) {
        for (let j = 0; j < tempo[i].preguntas.length; j++) {
          arrayTempoDelete.push(tempo[i].preguntas[j].ID_RESPUESTA_FORMULARIOS)
        }
      }
    }
    this.api.deleteForm(arrayTempoDelete)
      .subscribe((data: any) => {
        alert(orden)

        if (data.data == 200) {
          const title = "Operacion Exitosa.";
          const message = data.Mensaje;
          this.Message.showModal(title, message);
        }
        else {
          const title = "Operacion no exitosa.";
          const message = "Vuelva a intentarlo.";
          this.Message.showModal(title, message);
        }
      })


  }

  // Función auxiliar para agrupar los datos por una propiedad específica
  dateInputChange(pregunta: Pregunta, event: any) {
    // Lógica adicional para el cambio de fecha, si es necesario
  }

  checkboxChange(pregunta: Pregunta, value: string) {
    pregunta.RESPUESTA = value;
    pregunta.OTRO_VALOR = '';
    if (value !== 'Página web' && value !== 'Redes sociales') {
    }
  }

  groupBy(arr: any[], prop: string) {
    return arr.reduce((groups, item) => {
      const val = item[prop];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  }
  estructuraArrayPDF: any = [];
  generatePDF() {
    for (let i = 0; i < this.estructura.adicionales.length; i++) {
      const tempoAdicional = this.estructura.adicionales[i].preguntas;
      for (let j = 0; j < tempoAdicional.length; j++) {
        this.estructuraArrayPDF = tempoAdicional[j];
      }
    }

    const pdfDefinition: any = {
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageMargins: [80, 80, 80, 80],
      content: [
        { text: 'TALLER POLÍTICA DE DESARROLLO SOSTENIBLE', style: ['titulo1'] },
        { text: 'INTRODUCCIÓN', style: ['titulo2'] },
        { text: 'Por medio del presente taller se busca construir la política de desarrollo sostenible de la organización; a través de la cual, la alta dirección, es decir las personas o grupo de personas que dirigen la organización, de manera conjunta con sus colaboradores, establecen las intenciones y dirección de la empresa respecto a la sostenibilidad.', style: ['parrafo'] },
        { text: 'Esta política debe expresar claramente el propósito de la organización, debe estar alineada con los objetivos estratégicos de sostenibilidad, manifestar su interés de cumplir con los requisitos legales y su compromiso con la mejora continua.', style: ['parrafo'] },
        { text: 'Una vez documentada la política, ésta debe ser comunicada y divulgada a las partes interesadas de la organización.', style: ['parrafo'] },
        { text: 'CONCEPTOS RELACIONADOS', style: ['subtitulo'] },
        {
          text: [
            { text: 'Alta dirección.', style: 'negritaOracion' },
            ' Persona o grupo de personas que dirige y controla una organización al más alto nivel.'
          ],
          style: 'parrafo'
        },
        {
          text: [
            { text: 'Política.', style: 'negritaOracion' },
            ' Intenciones y dirección de una organización, como las expresa formalmente su alta dirección.'
          ],
          style: 'parrafo'
        },
        {
          text: [
            { text: 'Política de sostenibilidad.', style: 'negritaOracion' },
            ' Intenciones y dirección de una organización, relacionadas con la sostenibilidad, según lo expresado formalmente por su alta dirección.'
          ],
          style: 'parrafo'
        },
        {
          text: [
            { text: 'Sistema de gestión.', style: 'negritaOracion' },
            'Conjunto de elementos de una organización que están interrelacionados o que interactúan para establecer políticas y objetivos y procesos para lograr estos objetivos.'
          ],
          style: 'parrafo'
        },
        {
          text: [
            { text: 'Sistema de gestión de la sostenibilidad.', style: 'negritaOracion' },
            'Conjunto de elementos de una organización que están interrelacionados o que interactúan para establecer políticas objetivos y procesos para lograr estos objetivos.'
          ],
          style: 'parrafo'
        },
        {
          text: [
            { text: 'Sostenibilidad.', style: 'negritaOracion' },
            'Estado del sistema global, que incluye aspectos ambientales, sociales y económicos, en el que se satisfacen las necesidades del presente sin comprometer la capacidad de las generaciones futuras para satisfacer sus propias necesidades.'
          ],
          style: 'parrafo'
        },
        { text: '\n\n' }, // Salto de línea}
        { text: 'MODELOS DE POLÍTICA DE DESARROLLO SOSTENIBLE (Ejercicio práctico)', style: ['subtitulo'] },
        { text: 'A continuación, tenemos dos ejemplos de política de desarrollo sostenible. Por favor léalas e identifique su cumplimiento acorde a los requisitos de la NTC 6503.', style: ['parrafo'] },
        { text: '\n\n' }, // Salto de línea}
        { text: 'POLÍTICA 1.', style: ['parrafo'] },
        {
          text: [
            { text: 'NOMBRE DEL PST ', style: ['parrafo'] },
            { text: 'ofrece servicios de alojamiento y hospedaje;', decoration: 'underline' },
            'nuestros huéspedes reciben',
            { text: 'estándares de calidad: seguridad, confianza, disposición, planificación que son nuestras herramientas para la satisfacción de sus necesidades y expectativas.', decoration: 'underline' },
            'Nuestro enfoque por procesos nos permite desarrollar un análisis de nuestros productos y servicios para identificar ',
            { text: 'mejoras que nos permitan alcanzar nuestros resultados.', decoration: 'underline' },
          ],
          style: 'parrafo'
        },
        {
          text: [
            'Implementamos principios de sostenibilidad desarrollando planes para el ',
            { text: ' cumplimiento de los requisitos legales ', decoration: 'underline' }, // Línea debajo del texto
            'que se orienten a la protección del medio ambiente, difusión del conocimiento  de las tradiciones socioculturales de la región, y promovemos el bienestar económico laboral de nuestro personal, capacitándolo para fortalecer nuestros servicios.'
          ],
          style: 'parrafo'
        },
        { text: 'POLÍTICA 2.', style: ['parrafo'] },
        {
          text: [
            { text: 'NOMBRE DEL PST, ', style: ['parrafo'] },
            { text: 'ofrece ambientes familiares que satisfacen las expectativas de sus huéspedes,', decoration: 'underline' },
            'manteniendo, orientados por la sostenibilidad turística, implementando programas con los siguientes compromisos:'
          ],
          style: 'parrafo'
        },
        {
          ul: [
            {
              text: [
                'Seguimiento al ',
                { text: 'cumplimiento de los requisitos legales', decoration: 'underline' },
                ' en enfoques de protección ambiental, promoción sociocultural y económico.'
              ],
              margin: [0, 0, 0, 10]
            },
            {
              text: [
                { text: 'Control a los impactos negativos', decoration: 'underline' },
                ' que se puedan generar de nuestras actividades y ',
                { text: 'potenciando los positivos.', decoration: 'underline' },
              ],
              margin: [0, 0, 0, 10]
            },
            {
              text: [
                { text: 'Sensibilizando a huéspedes y proveedores, y capacitando a nuestros colaboradores', decoration: 'underline' },
                ' en la protección de flora y fauna, los bienes de interés cultural y la prevención de la explotación sexual de niños, niñas y adolescentes. ',
              ],
              margin: [0, 0, 0, 10]
            },
            {
              text: [
                'La gerencia está ',
                { text: 'comprometida con el seguimiento y monitoreo permanente', decoration: 'underline' },
                ' de los programas de sostenibilidad para ',
                { text: 'asegurar el mejoramiento continuo del SGS.', decoration: 'underline' },
              ],
              margin: [0, 0, 0, 10]
            },
          ],
          style: 'lista'
        },
        { text: '\n\n' }, // Salto de línea}
        { text: 'CONSTRUCCIÓN DE LA POLÍTICA DE DESARROLLO SOSTENIBLE', style: ['subtitulo'] },
        { text: '1. Basado en los ejemplos y en la filosofía de su empresa, responda las siguientes preguntas:', margin: [10, 0, 0, 10] },
        {
          table: {
            widths: ['*', '*'], // Dos columnas de igual tamaño
            headerRows: 1, // Especificamos que la primera fila es el encabezado
            body: [
              [
                { text: 'PREGUNTA', style: 'encabezado' },
                { text: 'RESPUESTA', style: 'encabezado' },
              ], // Encabezado de la tabla
              ['Nombre del establecimiento', this.pst],
              ['¿Cuáles son los servicios que presta su organización?', 'Celda 2, Fila 2'],
              ['¿Dónde está ubicado el establecimiento?', this.ubicación],
              ['¿Cuáles son los principales componentes o los tópicos o diferenciadores que resalta en la misión de su establecimiento?', this.diferenciadores],
              ['Cuáles son los principales pilares o componentes del plan estratégico que desea promover y priorizar? (Ver plan estratégico)', this.pilaresEstrategicos],
              ['¿Cuál es el compromiso de la empresa con el sistema de gestión de sostenibilidad?', this.compromiso],
            ],
            headerStyle: {
              // fillColor: '#CCCCCC', // Color de fondo del encabezado
            }, bodyStyles: {
              fontSize: 10, // Tamaño de fuente para todas las celdas
              fillColor: '#F2F2F2', // Color de fondo para todas las celdas
              alignment: 'center', // Alineación centrada para todas las celdas
            },
          },
        },
        { text: '2. Redacte su política de sostenibilidad, puede apoyarse en el siguiente modelo o en los ejemplos anteriores.', margin: [10, 15, 0, 10] },
        // { text: 'POLÍTICA DE SOSTENIBILIDAD',alignment: 'center', margin: [10, 10, 0, 10] },
        // {
        //   table: {
        //     widths: ['*'], // Una sola columna
        //     body: [
        //       [
        //         {
        //           text: [
        //              this.razonSocial, 'tiene como pilar fundamental la mejora continua enmarcada por sus componentes estratégicos basados en (Aquí va respuesta de componentes estratégicos) y para dar cumplimiento, se compromete a cumplir la presente política del sistema de gestión de sostenibilidad; por medio de (Escriba la respuesta referente a compromiso) y así brindar los mejores servicios de (Escriba la respuesta referente a los servicios), a nuestros clientes y demás partes interesadas.',
        //             '\n\n', // Salto de línea
        //             'Para lograr lo anterior, nuestra empresa se apoya en *(redacte aquí los tópicos o los diferenciadores como empresa), el mejoramiento continuo y el cumplimiento de los requisitos legales.',
        //           ],
        //           alignment: 'justify',
        //           fontSize: 12,
        //           margin: [15, 0, 0, 0],
        //         },

        //       ],
        //     ],
        //   },
        // },
        //segundo cuadrado
        { text: '\n\n' }, // Salto de línea}
        {
          table: {
            widths: ['*'], // Una sola columna
            body: [
              [
                {
                  text: 'Política de Sostenibilidad',
                  alignment: 'center',
                  bold: true,
                  fontSize: 14,
                  margin: [0, 0, 0, 0],
                },
              ],
              [
                {
                  text: [
                    this.razonSocial, 'tiene como pilar fundamental la mejora continua enmarcada por sus componentes estratégicos basados en ', this.pilaresEstrategicos, ' y para dar cumplimiento, se compromete a cumplir la presente política del sistema de gestión de sostenibilidad; por medio de ', this.compromiso, ' y así brindar los mejores servicios de (Escriba la respuesta referente a los servicios), a nuestros clientes y demás partes interesadas.', //vacio 
                    '\n\n', // Salto de línea
                    'Para lograr lo anterior, nuestra empresa se apoya en *(', this.diferenciadores, '), el mejoramiento continuo y el cumplimiento de los requisitos legales.',
                  ],
                  alignment: 'justify',
                  fontSize: 12,
                  margin: [15, 0, 0, 0],
                },
              ],
            ],
          },
        },
        { text: '\n\n' }, // Salto de línea}
        { text: 'Ciudad, fecha', style: ['parrafo'] },
        { text: '\n\n' }, // Salto de línea}
        { text: 'Nombre y firma del representante legal', style: ['parrafo'] },
        { text: '\n\n' }, // Salto de línea}
        { text: '3. Socializar la política de desarrollo sostenible:', margin: [10, 0, 0, 10] },
        { text: '\n\n' }, // Salto de línea}
        { text: '(Tomado de la NTC 6503)', margin: [12, 0, 0, 10] },
        { text: 'La política de desarrollo sostenible debe: ', margin: [12, 0, 0, 10] },
        {
          table: {
            widths: ['*'], // Una sola columna
            body: [
              ['- Estar disponible y mantenerse como información documentada'],
              ['- Comunicarse, entenderse y aplicarse dentro de la organización'],
              ['- Estar disponible para las partes interesadas, según corresponda'],
            ],
          },
          layout: 'noBorders', // Elimina los bordes de la tabla
          margin: [12, 0, 0, 10]
        },
        { text: '\n\n' }, // Salto de línea}
        { text: '\n\n' }, // Salto de línea}
        {
          table: {
            widths: ['*', '*', '*', '*'], // Cuatro columnas de igual tamaño
            headerRows: 1, // Especificamos que la primera fila es el encabezado
            body: [
              [
                { text: '¿CÓMO SE COMUNICA?', style: 'encabezado' },
                { text: '¿QUIÉN COMUNICA?', style: 'encabezado' },
                { text: '¿PARA CUÁNDO?', style: 'encabezado' },
                { text: '¿DONDE ESTARÁ  DISPONIBLE?', style: 'encabezado' },
              ], // Fila de la cabecera
              ...this.estructura.adicionales.map(tab => {
                return [
                  { text: tab.preguntas[0].RESPUESTA, style: ['columna'] },
                  { text: tab.preguntas[1].RESPUESTA, style: ['columna'] },
                  { text: this.datePipe.transform(tab.preguntas[2].RESPUESTA, 'dd-MM-yyyy'), style: ['columna'] }, 
                  { text: tab.preguntas[3].RESPUESTA, style: ['columna'] },
                ];
              })
            ],
          },
          layout: {
            // fillColor: '#CCCCCC', // Color de fondo de la cabecera
          },
          bodyStyles: {
            fontSize: 9, // Tamaño de fuente para todas las celdas
            fillColor: '#F2F2F2', // Color de fondo para todas las celdas
            alignment: 'center', // Alineación centrada para todas las celdas
          },
        }

      ],
      styles: {
        subtitulo: {
          bold: true,
          margin: [0, 0, 0, 10]
        },
        titulo1: {
          bold: true,
          alignment: 'center',
          fontSize: 20,
          margin: [0, 0, 0, 30]
        },
        titulo2: {
          bold: true,
          alignment: 'center',
          fontSize: 14,
          margin: [0, 0, 0, 15]
        },
        parrafo: {
          alignment: 'justify',
          fontSize: 12,
          margin: [0, 0, 0, 15]
        },
        negritaOracion: {
          bold: true,
          fontSize: 13,
        },
        lista: {
          fontSize: 12,
          margin: [0, 0, 0, 15],
          listItem: {
            margin: [0, 5, 0, 5],
          },
        },
        encabezado: {
          bold: true,
          alignment: 'center',
          fontSize: 13,
        },
      }
    }
    pdfMake.createPdf(pdfDefinition).download('TALLER_POLÍTICA_DE_DESARROLLO_SOSTENIBLE.pdf');
  }
}
