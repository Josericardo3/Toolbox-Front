import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forEach } from 'lodash';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';
import { AppListaDeVerificacionComponent } from '../../ListaDeVerificacion/app-lista-de-verificacion/app-lista-de-verificacion.component';


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
  quienComunica: any = [];
  preguntasRespuestasArray: any[] = []
  minDate: string;
  today: Date;

  constructor(
    private Message: ModalService,
    private api: ApiService,
    private datePipe: DatePipe,
    private ApiService: ApiService
  ) {
    this.estructura = {
      establecimiento: {} as Pregunta,
      sostenibilidad: {} as Pregunta,
      compromisoEmpresa: {} as Pregunta,
      adicionales: [] as Adicional[]
    };
  }

  ngOnInit() {
    this.fnListResponsible();
    this.usuario();
    this.getDataFor();

    this.today = new Date();
    const year = this.today.getFullYear();
    const month = this.today.getMonth() + 1; // Los meses comienzan en 0
    const day = this.today.getDate();

    this.minDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  datosUsuario: any = [];
  datos: any = [];
  pst!: string;
  categoria!: string;
  logo: any;
  valoresForm: any = [];
  razonSocial: any;

  usuario() {
    this.api.getUsuario()
      .subscribe((data: any) => {
        this.datosUsuario = data;
        this.pst = data.NOMBRE_PST;
        this.categoria = data.CATEGORIA_RNT;
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
  cuando: any;
  dondeEstaraDisponible: any;
  disablePDF: boolean = false;
  ubicación: string = '';
  idFormulario: number = 3;
  dataGrilla: any;

  getDataFor() {
    this.api.getDataForm(this.idFormulario)
      .subscribe((response: any) => {
        let data = response.RESPUESTAS;
        this.ubicación = response.DEPARTAMENTO + ', ' + response.MUNICIPIO;
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
                  //e.RESPUESTA = e.RESPUESTA.trim() == "" ? "" : new Date(e.RESPUESTA);
                  e.RESPUESTA = e.RESPUESTA;
                  //console.log(e.RESPUESTA);
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
            tab.preguntas = tab.preguntas.map((valor: any) => {
              valor.OTRO_VALOR = ""
              if (valor.RESPUESTA !== 'Página web' && valor.RESPUESTA !== 'Redes sociales') valor.OTRO_VALOR = valor.RESPUESTA;
              return valor;
            })
            
            this.dataGrilla = response.RESPUESTA_GRILLA;
            this.printCampos(this.dataGrilla);
            //console.log(this.dataGrilla);
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

  value1: string;
  value2: string;
  value3: string;
  value4: string;

  printCampos(data: any) {
    let ordenPregunta1 = "¿Cómo se comunica la política?";
    let ordenPregunta2 = "¿Quién comunica?";
    let ordenPregunta3 = "¿Cuándo?";
    let ordenPregunta4 = "¿Dónde estará disponible?";
    let ind = 1;
    
    data.forEach(item => {
      if (item.ORDEN > ind) ind = item.ORDEN;
    })

    let temporal1 = data.find(item => (item.PREGUNTA === ordenPregunta1 && item.ORDEN == ind));
    let temporal2 = data.find(item => (item.PREGUNTA === ordenPregunta2 && item.ORDEN == ind));
    let temporal3 = data.find(item => (item.PREGUNTA === ordenPregunta3 && item.ORDEN == ind));
    let temporal4 = data.find(item => (item.PREGUNTA === ordenPregunta4 && item.ORDEN == ind));
    this.value1 = temporal1.RESPUESTA;
    this.value2 = temporal2.RESPUESTA;
    this.value3 = temporal3.RESPUESTA;
    this.value4 = temporal4.RESPUESTA;

    //console.log(ind);
    //console.log(this.value3.slice(0,10));
    this.fnReordenarFecha("2023-10-25");
  }
  fnReordenarFecha (fec: string):string {
    const partesFecha: string[] = fec.split('-');
    const fechaFormateada: string = partesFecha[2] + '-' + partesFecha[1] + '-' + partesFecha[0];
    
    console.log(fechaFormateada);
    return fechaFormateada;
  }
  fnListResponsible() {
    const idPerfil = this.getRolValue();
    if (idPerfil == 3) {
      this.ApiService.getPSTSelect().subscribe((data) => {
        this.quienComunica = data;

      })
    } else {
      this.ApiService.getListResponsible().subscribe((data) => {
        this.quienComunica = data;

      })
    }
  }

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
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
      .subscribe((data) => {
        if (data.StatusCode === 200) {
          //console.log(preguntasRequest);
          this.printCampos(this.dataGrilla);
          const request1 = {
            FK_ID_USUARIO_PST: parseInt(localStorage.getItem("Id")),
            FK_ID_RESPONSABLE: parseInt(localStorage.getItem("Id")),
            TIPO_ACTIVIDAD: "Taller de Política de Desarrollo Sostenibles",
            DESCRIPCION: this.value1 + ' : ' + this.value4,
            FECHA_INICIO: this.fnReordenarFecha(this.value3.slice(0, 10)),
            FECHA_FIN: this.fnReordenarFecha(this.value3.slice(0, 10)),
            ESTADO_PLANIFICACION: "Programado"
          }
          this.ApiService.postNewRecord(request1).subscribe((data) => {
            //const title2 = "Registro exitoso";
            //const message2 = "El registro se ha realizado exitosamente";
            //this.Message.showModal(title2, message2);
            //messageshow = messageshow + ' y Planificacion';
          })
          console.log('si entraaa');
          this.disablePDF = false;
          this.botonCancelar = false;
          this.botonOcultar = true;
          this.estructura = {
            establecimiento: {} as Pregunta,
            sostenibilidad: {} as Pregunta,
            compromisoEmpresa: {} as Pregunta,
            adicionales: [] as Adicional[]
          };
          this.getDataFor();
          const title = "Registro exitoso";
          const messageshow = "El registro se ha realizado exitosamente";
          this.Message.showModal(title, messageshow);
        }
        console.log('si entraaa');
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
    let incorrecto = false;
    if (this.estructura.establecimiento.RESPUESTA?.trim() == "" ||
      this.estructura.sostenibilidad.RESPUESTA?.trim() == "" ||
      this.estructura.compromisoEmpresa.RESPUESTA?.trim() == "") {
      incorrecto = true;
    }
    else incorrecto = false;

    //this.estructura.adicionales.forEach(tab => {

    //  tab.preguntas.forEach(item => {
    //    if (item.PREGUNTA == "¿Cuándo?") {
          //console.log(typeof item.RESPUESTA)
          //if (typeof item.RESPUESTA == "string") {
          //  if (item.RESPUESTA.trim() == "") incorrecto = true;
          //}
          //else if (item.RESPUESTA === undefined) incorrecto = true;
    //    }
    //    else if (item.PREGUNTA == "¿Dónde estará disponible?" 
    //            &&item.RESPUESTA!= "Página web" 
    //            && item.RESPUESTA!= "Redes sociales" 
    //            &&  item.OTRO_VALOR.trim() == "") {
    //      incorrecto = true;
    //    }
    //    else if (item.RESPUESTA.trim() == "" ) {
    //      incorrecto = true;
    //    }
    //  });

    //});

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
    console.log(this.accionActivo);
    //this.accionActivo = "guardar";
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

  getdateact() {
    var fec = new Date();
    var day = fec.getDate();
    var month = fec.getMonth() + 1;
    var year = fec.getFullYear();

    return day + "/" + month + "/" + year;
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
              { text: this.pst, alignment: 'center', margin: [0, 21, 0, 21], rowSpan: 2 },
              { text: 'TALLER POLÍTICA DE DESARROLLO SOSTENIBLE', alignment: 'center', rowSpan: 2, margin: [0, 9, 0, 9] },
             // { text: 'CÓDIGO:', alignment: 'center' }
              { text: 'VERSIÓN: 01', alignment: 'center',margin: [0, 21, 0, 21], rowSpan: 2 },
            ],
            [
              {},
              {},
              '',
              {},
             // { text: 'VERSIÓN: 01', alignment: 'center', margin: [0, 12, 0, 12] },
            ]
          ]
        },
        margin: [45, 8, 45, 8],
        fontSize: 11,
      },

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
            { text: this.razonSocial + ', ', style: ['parrafo'] },
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
            {
              text: this.razonSocial+', ', style: ['parrafo'] },
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
              ['¿Cuáles son los servicios que presta su organización?', this.categoria],
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
        { text: this.ubicación + ' - ' + this.getdateact(), style: ['parrafo'] },
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
    pdfMake.createPdf(pdfDefinition).open();
  }
}
