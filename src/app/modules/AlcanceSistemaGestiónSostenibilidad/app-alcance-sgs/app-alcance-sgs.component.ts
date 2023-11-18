import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { NOMEM } from 'dns';
import { head } from 'lodash';

class Pregunta {
  PREGUNTA: string;
  RESPUESTA?: string;
  ORDEN: number;
  OTRO_VALOR?: string;
  FK_USUARIO: number;
}
@Component({
  selector: 'app-app-alcance-sgs',
  templateUrl: './app-alcance-sgs.component.html',
  styleUrls: ['./app-alcance-sgs.component.css']
})

export class AppAlcanceSGSComponent implements OnInit {
  constructor(
    private Message: ModalService,
    private api: ApiService,
  ) {
    this.estructura = {
      servicios: {} as Pregunta,
      justificacion: {} as Pregunta,
      sostenibilidad: {} as Pregunta,
      //checked1: {} as Pregunta,
      //checked2: {} as Pregunta,
      // compromisoEmpresa: {} as Pregunta,
      // adicionales: [] as Adicional[]
    };
  }
  accionActivo = "";
  userInfor: any = {};
  //botonCancelar = false;
  botonDelete: boolean = true;
  botonEditar: boolean = true;
  idFormulario: number = 4;
  ubicación: string = '';
  estructura: any;
  idFKUsuario = localStorage.getItem('Id');
  caracterizacion: string = '';
  selectedCheckboxes: any = [];

  //
  NormasArray: any = [];

  ngOnInit() {
    this.getUser();
    this.getDataFor();
  }

  separateCheckboxValues(input: any) {
    return input.split(',');
  }

  getDataFor() {
    this.arrayAdicionalesServicio = [];
    this.api.getDataForm(this.idFormulario)
      .subscribe((response: any) => {

        let data = response.RESPUESTAS;
        this.arrayAdicionalesServicio = response.RESPUESTA_GRILLA.map((item: any) => {
          item.FK_USUARIO = Number(this.idFKUsuario);
          return item;
        });
        this.caracterizacion = response.VALOR;
        this.ubicación = response.DEPARTAMENTO + ', ' + response.MUNICIPIO
        if (data.length > 0) { //ya hubo registro previo "ESTO ES EDICION"
          this.accionActivo = "editar";
          this.botonDelete = true;
          this.disablePDF = false;
          const servicios = "¿Cuáles son los principales servicios de su organización?";
          const requisitosNoAplica = "¿Requisitos de la norma que no aplican?";
          const justificacionNoAplica = "Justifique por qué no aplican."

          this.estructura.servicios = data.find(item => item.PREGUNTA === servicios);
          this.estructura.justificacion = data.find(item => item.PREGUNTA === justificacionNoAplica);
          this.estructura.sostenibilidad = data.find(item => item.PREGUNTA === requisitosNoAplica);

          let temporal = data.find(item => item.PREGUNTA === requisitosNoAplica);
          const temporalValue = this.separateCheckboxValues(temporal.RESPUESTA);
          for (let i = 0; i < this.NormasArray.length; i++) {
            if (temporalValue[i] == undefined)
              this.selectedCheckboxes[i] = i + ';f';
            else
              this.selectedCheckboxes.push(temporalValue[i]);
          }
        }
        else {//no existe registro previo  "NUEVO"
          this.accionActivo = "guardar";
          this.botonDelete = false;
          this.disablePDF = true;
          this.estructura.servicios = {
            "ID_RESPUESTA_FORMULARIOS": 0,
            "FK_MAE_FORMULARIOS": this.idFormulario,
            "PREGUNTA": "¿Cuáles son los principales servicios de su organización?",
            "ORDEN": 0,
            "RESPUESTA": "",
            "OTRO_VALOR": "",
            "FK_USUARIO": Number(this.idFKUsuario)
          }
          this.estructura.sostenibilidad = {
            "ID_RESPUESTA_FORMULARIOS": 0,
            "FK_MAE_FORMULARIOS": this.idFormulario,
            "PREGUNTA": "¿Requisitos de la norma que no aplican?",
            "ORDEN": 0,
            "RESPUESTA": "",
            "OTRO_VALOR": "",
            "FK_USUARIO": Number(this.idFKUsuario)
          }
          this.estructura.justificacion = {
            "ID_RESPUESTA_FORMULARIOS": 0,
            "FK_MAE_FORMULARIOS": this.idFormulario,
            "PREGUNTA": "Justifique por qué no aplican.",
            "ORDEN": 0,
            "RESPUESTA": "",
            "OTRO_VALOR": "",
            "FK_USUARIO": Number(this.idFKUsuario)
          }
          for (let i = 0; i < this.NormasArray.length; i++) {
            this.selectedCheckboxes[i] = i + ';f';
          }
        }
      })
    this.api.getDatosNormas(localStorage.getItem('idNormaSelected'))
      .subscribe((response: any) => {
        this.NormasArray = response;
      })
  }

  botonCancelar: boolean = false;
  botonOcultar: boolean = true;
  activarCampos() {
    this.accionActivo = "guardar";
    this.botonCancelar = true;
    this.botonOcultar = false;
    this.disablePDF = true;
    this.botonDelete = true;
  }

  llenadoIncorrecto() {
    let incorrecto = false;

    this.estructura.servicios
    this.estructura.justificacion;
    this.estructura.sostenibilidad

    if (this.estructura.servicios.RESPUESTA.trim() == "") {
      incorrecto = true;
    }
    if (this.estructura.justificacion.RESPUESTA.trim() == "") {
      incorrecto = true;
    }
    //for (let i = 0; i < this.NormasArray.length; i++) {
    //  if (this.selectedCheckboxes[i].trim() == i + ";false") {
    //    incorrecto = true;
    //  }
    //}

    this.arrayAdicionalesServicio.forEach(adicional => {
      if (adicional.RESPUESTA.trim() == "") {
        incorrecto = true;
      }
    });
    return incorrecto;
  }
  saveForm() {
    let preguntasRequest = [];
    let respCheckbox = '';
    if (this.estructura.servicios?.FK_USUARIO == 0 || undefined) this.estructura.servicios.FK_USUARIO = Number(this.idFKUsuario);
    preguntasRequest[0] = this.estructura.servicios;
    if (this.estructura.sostenibilidad?.FK_USUARIO == 0 || undefined) this.estructura.sostenibilidad.FK_USUARIO = Number(this.idFKUsuario);
    for (let i = 0; i < this.NormasArray.length; i++) {
      if(i != this.NormasArray.length-1)
        respCheckbox = respCheckbox + this.selectedCheckboxes[i] + ',';
      else
        respCheckbox = respCheckbox + this.selectedCheckboxes[i];
    }
    this.estructura.sostenibilidad.RESPUESTA = respCheckbox;
    preguntasRequest[1] = this.estructura.sostenibilidad;
    if (this.estructura.justificacion?.FK_USUARIO == 0 || undefined) this.estructura.justificacion.FK_USUARIO = Number(this.idFKUsuario);
    preguntasRequest[2] = this.estructura.justificacion;

    this.api.saveForms(preguntasRequest.concat(this.arrayAdicionalesServicio))
      .subscribe((data: any) => {
        const title = "Operación Exitosa.";
        const message = data.Message;
        this.Message.showModal(title, message);
        this.getDataFor();
        this.botonOcultar = true;
        this.botonCancelar = false;

      })
  }

  checkboxChange(event: any, option: number) {
    // Actualizamos el valor del checkbox con la opción y el estado
    const checkboxState = event.target.checked;
    if (checkboxState == true)
      this.selectedCheckboxes[option] = option + ';t';
    else
      this.selectedCheckboxes[option] = option + ';f';
  }

  numOfInputs: number = 0;
  arrayAdicionalesServicio: any[] = [];
  RespuestaRequisitos: any[] = [];

  agregarAdicional() {
    this.numOfInputs++;
    this.arrayAdicionalesServicio.push(
      {
        "ID_RESPUESTA_FORMULARIOS": 0,
        "FK_MAE_FORMULARIOS": this.idFormulario,
        "PREGUNTA": "¿Cuáles son los principales servicios de su organización?",
        "ORDEN": 1,
        "RESPUESTA": "",
        "FK_USUARIO": Number(this.idFKUsuario)
      }
    ); // Agregar un elemento vacío para el nuevo input
  }

  getUser() {
    const idUsuario = window.localStorage.getItem('Id');
    this.api.getUser(idUsuario).subscribe((data: any) => {
      this.userInfor = data;
    })
  }
  disablePDF: boolean = false;

  obtenerNormaNoAplica(respuesta) {
    const pairs = respuesta.split(",");

    const trueNumbers = pairs
      .map(pair => pair.split(";"))
      .filter(pair => pair[1] === "t")
      .map(pair => pair[0]);

    const normaspdf = [];
    for (let i = 0; i < trueNumbers.length; i++) {
      normaspdf.push(this.NormasArray[trueNumbers[i]].TITULO)
    }
    console.log("normas", normaspdf);
    return normaspdf;
  }

  obtenerNumeralesEnArreglo(arreglo: string[]): string {
    const numeralesEncontrados: string[] = [];
    let response = '';
    for (const cadena of arreglo) {
      // Utilizamos una expresión regular para buscar los numerales en varios formatos
      const regex = /(\d+(\.\d+)?\b)|([A-Z]\.(\d+(\.\d+)?\b)?)/g;
      const numeralesEncontradosEnCadena = cadena.match(regex);

      if (numeralesEncontradosEnCadena) {
        numeralesEncontrados.push(...numeralesEncontradosEnCadena);
      }
    }
    for (let i = 0; i < numeralesEncontrados.length; i++) {
      if (i != numeralesEncontrados.length-1)
        response = response + numeralesEncontrados[i] + '\n';
      else
        response = response + numeralesEncontrados[i];
    }
    return response;
  }

  generatePDF() {

    var headerElement = {};
  
    if (this.userInfor.LOGO == null) {
      headerElement = { text: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 };
    } else {
      headerElement = { image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 };
    }
    const respuesta = this.estructura.sostenibilidad.RESPUESTA;
    this.RespuestaRequisitos = this.obtenerNormaNoAplica(respuesta);
    console.log(respuesta);
    const pdfDefinition: any = {
      pageOrientation: 'portrait', // 'portrait' indica orientación vertical (predeterminado)
      pageMargins: [30, 30, 30, 30],
      content: [
        {
          headerRows: 2,
          table: {
            heights: [20, 20, 20, 20],
            widths: ['*', '*', '*', 100],
            headerRows: 1,
            body: [
              [
                headerElement,
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin: [0, 15, 0, 15], rowSpan: 2 },
                { text: 'ALCANCE DEL SGS', alignment: 'center', bold: true, margin: [0, 15, 0, 15], rowSpan: 2 },
                { text: 'CÓDIGO: GS-D', alignment: 'center', bold: true, margin: [0, 2, 0, 2], puntosstyle: ['codigoLeft'] }
              ],
              [
                {},
                {},
                '',
                // { text: '  VERSIÓN: 01', alignment: 'center', style: ['codigoLeft'] },
                {
                  text: 'VERSIÓN: 01', alignment: 'center', bold: true, margin: [20, 2, 0, 2], puntosstyle: ['codigoLeft'] // Ajusta el margen izquierdo a 20 
                }
              ],

            ],

          },
          fontSize: 10,
        },
        { text: '\n\n' }, // Salto de línea}
        { text: 'A continuación responda las siguientes preguntas de una forma corta y clara (instrucción)', style: ['parrafo'] },
        {
          table: {
            widths: ['*', '*', '*', '*'], // Ancho de cada columna
            body: [
              // Fila 1 (Encabezados)
              [
                { text: '¿Cuáles son los principales servicios de la organización?', style: 'encabezado' },
                { text: 'Relacione los datos de ubicación (ciudad, dirección exacta) del establecimiento y de las sucursales si las tiene', style: 'encabezado' },
                { text: 'Defina las características especiales donde esta ubicado el PST (Zona rural o reserva natural o centro histórico u otro o no aplica)', style: 'encabezado' },
                { text: '¿Qué requisitos de la norma no aplicarían y por qué?', style: 'encabezado' },
              ],
              // Fila 2 (Contenido)
              // ...this.arrayAdicionalesServicio.map(tab => {
              //   return [
              //     { text: tab.RESPUESTA, style: ['columna'] },
              //   ];
              // })

              //  [ this.arrayAdicionalesServicio.length > 0? this.estructura.servicios.RESPUESTA +  , 'Celda 2, Fila 2', 'Celda 3, Fila 2', 'Celda 4, Fila 2'],
              [
                { text: this.arrayAdicionalesServicio.length > 0 ? this.estructura.servicios.RESPUESTA + ' ' + this.arrayAdicionalesServicio.map(tab => tab.RESPUESTA).join(' ') : this.estructura.servicios.RESPUESTA, style: ['columna'] },
                { text: this.ubicación, style: ['columna'] },
                { text: this.caracterizacion, style: ['columna'] },
                { text: this.obtenerNumeralesEnArreglo(this.RespuestaRequisitos) + ' \nJustificación: ' + this.estructura.justificacion.RESPUESTA, style: ['columna'] }
              ]
            ],
          },
        },
        { text: '\n\n' }, // Salto de línea}
        // tabla 
        // {
        //   table: {
        //     widths: ['*'], // Una sola columna
        //     body: [
        //       [
        //         {
        //           text: 'ALCANCE DEL SGS',
        //           alignment: 'center',
        //           bold: true,
        //           fontSize: 14,
        //           margin: [0, 0, 0, 0],
        //         },
        //       ],
        //       [
        //         {
        //           text: [
        //             'El Sistema de gestión de la sostenibilidad de (Nombre de la empresa) tendrá alcance a la prestación de servicios de (servicio 1, servicio 2, servicio 3, servicio 4). Este alcance se ha definido teniendo en cuenta nuestro análisis de contexto e identificación de necesidades y expectativas de nuestras partes interesadas, el cual incluye los siguientes limites:', //vacio 
        //             '\n\n', // Salto de línea
        //             '-Nos encontramos ubicados en: dirección, Ciudad. En zona rural y en zona natural. (Datos de ubicación y respuesta de características del EAH) y (opcional sucursales)',
        //             '\n\n', // Salto de línea
        //             '-Se excluyen los siguientes numerales de la NTC'
        //             '4.1 Requisitos legales. Porque justificación'
        //           ],
        //           alignment: 'justify',
        //           fontSize: 12,
        //           margin: [0, 0, 0, 0],
        //         },
        //       ],
        //     ],
        //   },
        // },
        {
          table: {
            widths: ['*'], // Una sola columna
            body: [
              [
                {
                  text: 'ALCANCE DEL SGS',
                  alignment: 'center',
                  bold: true,
                  fontSize: 14,
                  margin: [0, 0, 0, 0],
                },
              ],
              [
                {
                  stack: [
                    'El Sistema de gestión de la sostenibilidad de ' + this.userInfor.NOMBRE_PST +
                    ' tendrá alcance a la prestación de servicios de ' +
                    (this.arrayAdicionalesServicio.length > 0 ?
                      this.estructura.servicios.RESPUESTA + ' ' + this.arrayAdicionalesServicio.map(tab => tab.RESPUESTA).join(' ')
                      : this.estructura.servicios.RESPUESTA) +
                    '. Este alcance se ha definido teniendo en cuenta nuestro análisis de contexto e identificación de necesidades y expectativas de nuestras partes interesadas, el cual incluye los siguientes límites:', //vacio 
                    '\n\n', // Salto de línea
                    '-Nos encontramos ubicados en: dirección, ' + this.ubicación + '. En zona rural y en zona natural.',
                    '-Se excluyen los siguientes numerales de la NTC',
                    this.obtenerNumeralesEnArreglo(this.RespuestaRequisitos) + ' \nRequisitos legales. Porque ' + this.estructura.justificacion.RESPUESTA
                  ],
                  alignment: 'justify',
                  fontSize: 12,
                  margin: [0, 0, 0, 0],
                },
              ],
            ],
          },
        }
      ],
      styles: {
        parrafo: {
          alignment: 'justify',
          fontSize: 10,
          margin: [0, 0, 0, 15]
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

  cancelarEdit() {
    this.botonEditar = false;
    this.botonCancelar = false;
    this.botonOcultar = true;
    this.disablePDF = false;
    this.botonDelete = true;
    this.getDataFor();
  }

  deleteServicios(index: number) {

    if (this.arrayAdicionalesServicio[index].ID_RESPUESTA_FORMULARIOS == 0) {
      this.arrayAdicionalesServicio = this.arrayAdicionalesServicio.filter((item, indice) => indice !== index);
    } else {
      this.api.deleteForm(this.arrayAdicionalesServicio[index].ID_RESPUESTA_FORMULARIOS)
        .subscribe((response: any) => {
          if (response.StatusCode == 200) {
            const title = "Operación Exitosa.";
            const message = 'Se eliminó correctamente';
            this.Message.showModal(title, message);
            this.getDataFor(); 
            this.botonOcultar = true;
            this.botonCancelar = false;
          }
        })
    }
  }

}
