import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';
import * as pdfMake from 'pdfmake/build/pdfmake';

function eliminarTrueFalse(cadena: string): string {
  return cadena.replace(/;true|;false/g, '').trim();
}

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
      checked1: {} as Pregunta,
      checked2: {} as Pregunta,
      // compromisoEmpresa: {} as Pregunta,
      // adicionales: [] as Adicional[]
    };
  }
  accionActivo = "";
  userInfor: any = {};
  //botonCancelar = false;
  botonEditar: boolean = true;
  idFormulario: number = 4;
  ubicación: string = '';
  estructura: any;
  idFKUsuario = localStorage.getItem('Id');
  selectedCheckboxes: any = {
    checkbox1: false,
    checkbox2: false,
  };

  ngOnInit() {
    this.getUser();
    this.getDataFor();
  }

   separateCheckboxValues(input: any){
    return input.split(',');
  }

  getDataFor() {
    this.arrayAdicionalesServicio=[];
    this.api.getDataForm(this.idFormulario)
      .subscribe((response: any) => {
        
        let data = response.RESPUESTAS;
        this.arrayAdicionalesServicio=response.RESPUESTA_GRILLA.map((item:any)=>{
          item.FK_USUARIO=Number(this.idFKUsuario);
          return item;
        });

        this.ubicación = response.DEPARTAMENTO + ', ' + response.MUNICIPIO
        if (data.length > 0) { //ya hubo registro previo "ESTO ES EDICION"
          this.accionActivo = "editar";
          this.disablePDF = false;
          const servicios = "¿Cuáles son los principales servicios de su organización?";
          const requisitosNoAplica = "¿Requisitos de la norma que no aplican?";
          const justificacionNoAplica = "Justifique por qué no aplican."
          
          this.estructura.servicios = data.find(item => item.PREGUNTA === servicios);
          this.estructura.justificacion = data.find(item => item.PREGUNTA === justificacionNoAplica);
          this.estructura.sostenibilidad =  data.find(item => item.PREGUNTA === requisitosNoAplica);

          let temporal = data.find(item => item.PREGUNTA === requisitosNoAplica);
           const temporalValue = this.separateCheckboxValues(temporal.RESPUESTA);
           this.selectedCheckboxes.checkbox1 =  temporalValue[0]; 
           this.selectedCheckboxes.checkbox2 =  temporalValue[1];

        }
        else {//no existe registro previo  "NUEVO"
          this.accionActivo = "guardar";
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
          this.selectedCheckboxes.checkbox1 =  "4.1;false"; 
          this.selectedCheckboxes.checkbox2 =  "4.2;false";
        }
      })
  }

  botonCancelar: boolean = false;
  botonOcultar: boolean = true;
  activarCampos(){
    this.accionActivo = "guardar";
    this.botonCancelar = true;
    this.botonOcultar = false;
    this.disablePDF = true;

  }

  llenadoIncorrecto(){
    let incorrecto=false;

    this.estructura.servicios
    this.estructura.justificacion;
    this.estructura.sostenibilidad

    if(this.estructura.servicios.RESPUESTA.trim()==""){
      incorrecto=true;
    }
    if(this.estructura.justificacion.RESPUESTA.trim()==""){
      incorrecto=true;
    }
    if(this.selectedCheckboxes.checkbox1.trim()=="4.1;false" && this.selectedCheckboxes.checkbox2 =="4.2;false"){
      incorrecto=true;
    }

    this.arrayAdicionalesServicio.forEach(adicional => {
      if(adicional.RESPUESTA.trim()==""){
        incorrecto=true;
      }
    });
    return incorrecto;
  }
  saveForm() {
    let preguntasRequest = [];
    if(this.estructura.servicios?.FK_USUARIO == 0  || undefined )this.estructura.servicios.FK_USUARIO = Number(this.idFKUsuario);
    preguntasRequest[0] = this.estructura.servicios;
  
    if(this.estructura.sostenibilidad?.FK_USUARIO == 0 || undefined )this.estructura.sostenibilidad.FK_USUARIO = Number(this.idFKUsuario);
    this.estructura.sostenibilidad.RESPUESTA = this.selectedCheckboxes.checkbox1 + ',' +  this.selectedCheckboxes.checkbox2, 
    preguntasRequest[1] = this.estructura.sostenibilidad;

    if(this.estructura.justificacion?.FK_USUARIO == 0 || undefined ) this.estructura.justificacion.FK_USUARIO = Number(this.idFKUsuario);
    preguntasRequest[2] = this.estructura.justificacion;

    this.api.saveForms(preguntasRequest.concat(this.arrayAdicionalesServicio))
      .subscribe((data: any) => {
        const title = "Operacion Exitosa.";
        const message = data.Message;
        this.Message.showModal(title, message);
    })
  }

checkboxChange(event: any, option: string) {
  // Actualizamos el valor del checkbox con la opción y el estado
  const checkboxState = event.target.checked;

  if(option == '4.1') this.selectedCheckboxes.checkbox1 = option +';'+ checkboxState.toString();
  else this.selectedCheckboxes.checkbox2 = option +';'+ checkboxState.toString();
}

  numOfInputs: number = 0;
  arrayAdicionalesServicio: any[] = [];
  
    agregarAdicional(){
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
  generatePDF() {

    const sostenibilidadrespuesta: string = eliminarTrueFalse(this.estructura.sostenibilidad.RESPUESTA);

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
                { image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
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
              { text: this.arrayAdicionalesServicio.length > 0 ? this.estructura.servicios.RESPUESTA + ', '+ this.arrayAdicionalesServicio.map(tab => tab.RESPUESTA).join(', ') : this.estructura.servicios.RESPUESTA, style: ['columna'] },
              { text: this.ubicación, style: ['columna'] },
              { text: 'Urbano', style: ['columna'] },
              { text: sostenibilidadrespuesta + '. Justificación: ' + this.estructura.justificacion.RESPUESTA, style: ['columna'] }
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
                    'El Sistema de gestión de la sostenibilidad de '+ this.userInfor.NOMBRE_PST + 
                    ' tendrá alcance a la prestación de servicios de '+ 
                    (this.arrayAdicionalesServicio.length > 0 ?
                      this.estructura.servicios.RESPUESTA + ' ' + this.arrayAdicionalesServicio.map(tab => tab.RESPUESTA).join(' ')
                      : this.estructura.servicios.RESPUESTA) +
                    '. Este alcance se ha definido teniendo en cuenta nuestro análisis de contexto e identificación de necesidades y expectativas de nuestras partes interesadas, el cual incluye los siguientes límites:', //vacio 
                    '\n\n', // Salto de línea
                    '-Nos encontramos ubicados en: dirección, ' + this.ubicación +'. En zona urbana.',
                    '-Se excluyen los siguientes numerales de la NTC',
                    '4.1 Requisitos legales. Porque ' + this.estructura.justificacion.RESPUESTA
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
    pdfMake.createPdf(pdfDefinition).download('ALCANCE_DEL_SGS');
  }

  cancelarEdit() {
    this.botonEditar = false;
    this.botonCancelar = false;
    this.botonOcultar = true;
    this.disablePDF = false;
    this.getDataFor();
  }

}
