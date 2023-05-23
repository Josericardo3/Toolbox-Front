import { Component, ViewEncapsulation } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiService } from '../../../servicios/api/api.service'
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'moment-timezone';
import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
registerLocaleData(localeEsPE, 'es-PE');

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-app-auditoria-interna',
  templateUrl: './app-auditoria-interna.component.html',
  styleUrls: ['./app-auditoria-interna.component.css'],
  encapsulation: ViewEncapsulation.None // Add this line
})
export class AppAuditoriaInternaComponent {
  showTable: boolean = false; // Variable para controlar la visibilidad de la tabla
  toggleValue: boolean = false;//prueba toggle
  listAuditor: any = [];
  equipoAuditor: any = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  formParent!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    public ApiService: ApiService,
    private Message: ModalService,

  ) { }

  ngOnInit(): void {

    //this.router.navigate(['/listaDeVerificacion']);
    //console.log(this.toggleValue,"toglee")
    // if(window.location.search.includes('form=show')){
    //   document.getElementById('formAuditoria').style.display = 'block'
    // }else{
    //   document.getElementById('formAuditoria').style.display = 'none' 
    // }
    // if(window.location.search.includes('form=show')){
    //   document.getElementById('formAuditoria').style.display = 'block'
    // }else{
    //   document.getElementById('formAuditoria').style.display = 'none' 
    // }

    this.formParent = this.formBuilder.group({
      liderAuthor: ["", Validators.required],
      auditorTeam: ["", Validators.required],
      objAuditoria: ["", Validators.required],
      alcanceAuditoria: ["", Validators.required],
      criterioAuditoria: ["", Validators.required],
      dateInit: ["", Validators.required],
      mytime: [""],
      dateEnd: [""],
      hourEnd: [""],
      planAuditoria: [""],
      planAuditoriaDate: [""],
      // processOrActivity:["",Validators.required],
      //normOrRequest:["",Validators.required],
      auditor: [""],
      nameAuditor: [""],
      observacion:[""],
      fechaActual: [""],
      obsText: [""],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
      planTime: [""],
      //prueba
      //    toggleValue:[false],
       proceso: [""],
      //actividad: [""],
      //pruena norma
      // toggleValueNorma:[false],
      //norma: ["",Validators.required],
      //requisito: [""],

    });
    this.getAuditorList();
    this.fnListResponsible();
  }

  /* nicio */
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  /* Fin */

  onTogglee() {
    // Suscribirse a los cambios del toggleValue
    this.formParent.get('toggleValue').valueChanges.subscribe((value) => {
      console.log(value, "value actual")
      if (value) {
        // Habilitar la validación en el campo 'actividad'
        this.formParent.get('actividad').setValidators(Validators.required);
      } else {
        // Deshabilitar la validación en el campo 'actividad'

        this.formParent.get('actividad').clearValidators();
      }

      // Actualizar la validación en el campo 'actividad'
      this.formParent.get('actividad').updateValueAndValidity();
    });

  }

  onTogleNorma() {
    this.formParent.get('toggleValue').valueChanges.subscribe((value) => {
      console.log(value, "value actual")
      if (value) {
        // Habilitar la validación en el campo 'actividad'
        this.formParent.get('requisito').setValidators(Validators.required);
      } else {
        // Deshabilitar la validación en el campo 'actividad'

        this.formParent.get('requisito').clearValidators();
      }

      // Actualizar la validación en el campo 'actividad'
      this.formParent.get('requisito').updateValueAndValidity();
    });

  }


  getAuditorList() {
    this.ApiService.getAuditorListService()
      .subscribe((data: any) => {

        this.listAuditor = data;

        this.equipoAuditor = data;


        this.dropdownList = [
          { "item_id": 0, "item_text": "Melissa Gutmont" },
          { "item_id": 1, "item_text": "Carlancas Venec" },
          { "item_id": 2, "item_text": "Oscar Sandoval" }
        ];

        this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Seleccionar todos',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          allowSearchFilter: true
        };
        return this.listAuditor;
      })
  }

  getActualDate() {
    let date = new Date();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    let formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  openComponent(evt: any) {

    this.router.navigate(['/nuevoPlanDeAuditoria'], { queryParams: { item: evt.target?.id } });
  }
  openComponentLista(evt: any) {

    return this.router.navigate(['/listaDeVerificacion'], { queryParams: { item: evt.target?.id } });
  }

  openComponentInforme(evt: any) {
    this.router.navigate(['/informeAuditoria'], {
      queryParams: {
        item: evt.target?.i
      }
    }
    );
  }
  checkboxes: any;
  expanded = false;
  showCheckboxes() {
    let checkboxes = document.getElementById("checkboxes");
    if (!this.expanded) {
      this.checkboxes.style.display = "block";
      this.expanded = true;
    } else {
      this.checkboxes.style.display = "none";
      this.expanded = false;
    }
  }

  formantDate(dateArg) {
    let gmtDate = dateArg;
    let formattedDate = moment.utc(gmtDate);
    let finalDate = formattedDate.tz("America/Lima");
    return moment(finalDate).format('DD/MM/YYYY')
  }

  formantHour(dateHour) {
    console.log(dateHour, 'date');
    const timeZone = 'America/Lima'; // configurar la zona horaria aquí
    const formattedHour = moment.utc(dateHour).tz(timeZone);
    const finalHour = moment(formattedHour).format('hh:mm:ss A');
    return finalHour;
  }
  myTime: string;
  startTime: string;
  endTime: string;
  saveForm() {
   // const toggleValue = this.formParent.get("toggleValue")?.value;
    //const procesoValue = this.formParent.get("proceso")?.value;

    //let actividadValue: string | null = null;
    // if (toggleValue) {
    //   actividadValue = this.formParent.get("actividad")?.value;
    // }

    // const toggleValueNorma = this.formParent.get("toggleValueNorma")?.value;
    // const ValueRequ = this.formParent.get("norma")?.value;

   // let actividadValueNorReq: string | null = null;
    // if (toggleValue) {
    //   actividadValueNorReq = this.formParent.get("requisito")?.value;
    // }

    const idPst = localStorage.getItem('Id')
    const request = {

      iD_AUDITORIA: 0,
      fK_ID_PST: Number(idPst),
      codigo: "string",
      auditoR_LIDER: this.formParent.get("liderAuthor")?.value,
      equipO_AUDITOR: this.formParent.get("auditorTeam")?.value.flatMap(e => e.item_text).toString(),
      objetivo: this.formParent.get("objAuditoria")?.value,
      alcance: this.formParent.get("alcanceAuditoria")?.value,
      criterio: this.formParent.get("criterioAuditoria")?.value,
      fechA_REUNION_APERTURA: this.formantDate(new Date(this.formParent.get("dateInit")?.value)),
      horA_REUNION_APERTURA: this.formParent.get("startTime")?.value,
      fechA_REUNION_CIERRE: this.formantDate(new Date(this.formParent.get("dateEnd")?.value)),
      horA_REUNION_CIERRE: this.formParent.get("endTime")?.value,
      fechA_AUDITORIA: this.getActualDate(),
      observaciones: this.formParent.get("observacion")?.value,
      //proceso: "string",
      conformidades: [

      ],
      procesos: [
        {

          iD_PROCESO_AUDITORIA: 0,
          fK_ID_AUDITORIA: 0,
          procesos: this.valueAuditoria
          // fecha: this.formantDate(new Date(this.formParent.get("planAuditoria")?.value)),
          // hora: this.formParent.get("planTime")?.value,

         // procesO_DESCRIPCION: toggleValue ? actividadValue : procesoValue,
          //procesO_DESCRIPCION:this.formParent.get("actividad")?.value,
          //procesO_DESCRIPCION: this.formParent.get("processOrActivity")?.value ?'proceso':'auditoria',
      //     lideR_PROCESO: this.formParent.get("nameAuditor")?.value,
      //     cargO_LIDER: "string",
      //     //normaS_AUDITAR: this.formParent.get("normOrRequest")?.value ?'norma':'requisitos auditar',
      //  //   normaS_AUDITAR: toggleValueNorma ? actividadValueNorReq : ValueRequ,
      //     auditor: this.formParent.get("auditor")?.value,
      //     auditados: this.formParent.get("nameAuditor")?.value,
      //     documentoS_REFERENCIA: "string",
      //     estado: true
        }
      ],
      "requisitos": [

      ]
    }

    this.ApiService.insertAuditoria(request)
      .subscribe((data: any) =>
        console.log(data, "data new"))
    //   const request = {
    //     fechaActual:this.getActualDate(),
    //     liderAuditor : this.formParent.get("liderAuthor")?.value,
    //     teamAuditor:this.formParent.get("auditorTeam")?.value,   
    //     objetivo:this.formParent.get("objAuditoria")?.value,
    //     alcance:this.formParent.get("alcanceAuditoria")?.value,
    //     criterio:this.formParent.get("criterioAuditoria")?.value,
    //     fechaInicio:this.formantDate(new Date(this.formParent.get("dateInit")?.value)),
    //     horaInicio:this.formParent.get("hourInit")?.value,
    //     fechaFinal:this.formantDate(new Date(this.formParent.get("dateEnd")?.value)),
    //     horaFinal:this.formParent.get("hourEnd")?.value,
    //     planAuditoria: this.formParent.get("planAuditoria")?.value,
    //     fechaPlanAuditoria:this.formantDate(new Date(this.formParent.get("planAuditoria")?.value)),
    //     horaPlanAuditoria:this.formParent.get("planAuditoriaDate")?.value,
    //     procesoOauditoria: this.formParent.get("processOrActivity")?.value ?'proceso':'auditoria',
    //     norma: this.formParent.get("normOrRequest")?.value ?'norma':'requisitos auditar',
    //     auditor: this.formParent.get("auditor")?.value,
    //     nameAuditor: this.formParent.get("nameAuditor")?.value,
    //     observacion: this.formParent.get("observacion")?.value,
    //   }
    this.clearForm();
    //return this.generatePlanDeAuditoria(request);
    // }

  }

  clearForm() {
    this.formParent.reset();
  }

  generatePlanDeAuditoria(request) {
    console.log(request, 'resuqestahora')
    const docDefinition: any = {
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
                { text: 'LOGO DE LA ORGANIZACIÓN', alignment: 'center', rowSpan: 3, style: ['codigoTop'] },
                { text: 'NOMBRE DE LA ORGANIZACIÓN', alignment: 'center', style: ['codigoTop'], rowSpan: 3 },
                { text: 'PLAN DE AUDITORÍA', alignment: 'center', rowSpan: 3, style: ['codigoTop'] },
                { text: 'CÓDIGO', rowSpan: 2, alignment: 'center', marginTop: 20, marginLeft: -30 }
              ],
              ["", "", "", ""],
              ["", "", "", { text: 'VERSIÓN', alignment: 'center', style: ['codigoLeft'] }]
            ]
          },
          fontSize: 10,
        },
        '\n',
        '\n',
        {
          table: {

            widths: [150, '*', '*', '*', '*',],
            body: [
              [
                { text: 'Fecha de elaboración', style: ['tituloDinamico'] },
                { text: this.getActualDate(), colSpan: 4, },
                '',
                { text: '' },
                { text: '' },

              ],
              [
                { text: 'Auditor líder', style: ['tituloDinamico'] },
                { text: request.auditoR_LIDER, colSpan: 4, },
                { text: '' },
                { text: '' },
                { text: '' },
              ],
              [
                { text: 'Equipo auditor', style: ['tituloDinamico'] },
                { text: request.equipO_AUDITOR, colSpan: 4, },
                { text: '' },
                { text: '' },
                { text: '' },
              ],
              [
                { text: 'Objetivo de la auditoría', style: ['tituloDinamico'] },
                { text: request.objetivo, colSpan: 4, },
                { text: '' },
                { text: '' },
                { text: '' },
              ],
              [
                { text: 'Alcance de la auditoría', style: ['tituloDinamico'] },
                { text: request.alcance, colSpan: 4, },
                { text: '' },
                { text: '' },
                { text: '' },
              ],
              [
                { text: 'Criterios de la auditoría', style: ['tituloDinamico'] },
                { text: request.criterio, colSpan: 4, },
                { text: '' },
                { text: '' },
                { text: '' },
              ],
              [
                { text: 'Reunión de apertura', style: ['tituloDinamico'] },
                'Día:',
                { text: request.fechA_REUNION_APERTURA, style: ['tituloDinamico'] },
                'Hora:',
                { text: request.horA_REUNION_APERTURA, style: ['tituloDinamico'] },
              ],
              [
                { text: 'Reunión de cierre', style: ['tituloDinamico'] },
                'Día:',
                { text: request.fechA_REUNION_CIERRE, style: ['tituloDinamico'] },
                'Hora:',
                { text: request.horA_REUNION_CIERRE, style: ['tituloDinamico'] },

              ],

            ],
          },
          fontSize: 10,
        },
        '\n',
        '\n',
        {
          table: {
            widths: ['auto', 'auto', '*', '*', 'auto', '*'],
            body: [
              [
                { text: 'PLANIFICACIÓN DE LA AUDITORIA INTERNA', colSpan: 6, fontSize: 10, alignment: 'center', bold: true },
                {},
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Fecha', style: ['columna'] },
                { text: 'Hora', style: ['columna'] },
                { text: 'Proceso/Actividad', style: ['columna'] },
                { text: 'Norma y/o requisitos a auditar', style: ['columna'] },
                { text: 'Auditor', style: ['columna'] },
                { text: 'Nombre y cargo del auditado(s)', style: ['columna'] }
              ],
              ...this.valueAuditoria.map(requisito => [      
                { text: requisito.requisito, style: [ 'columna' ]},
                { text: requisito.formPreguntas.flatMap(e=>e.pregunta).toString(), style: [ 'columna' ]},
                { text: requisito.evidencia, style: [ 'columna' ]},
                { text: requisito.hallazgo, style: [ 'columna' ]},
                { text: requisito.observacion, style: [ 'columna' ]}
              ])
              // [
              //   { text: request.procesos[0].fecha, style: [''] },
              //   { text: request.procesos[0].hora, style: [''] },
              //   { text: request.procesos[0].procesO_DESCRIPCION, style: [''] },
              //   { text: request.procesos[0].normaS_AUDITAR, style: [''] },
              //   { text: request.procesos[0].auditor, style: [''] },
              //   { text: request.procesos[0].auditados, style: [''] },
              // ],
            ]
          },

        },
        '\n',
        '\n',
        {
          table: {
            widths: ['100%'],
            heights: [10, 40],
            body: [
              [
                {
                  text: 'Observaciones de auditoría',
                  fontSize: 10,
                  bold: true,
                  alignment: 'center',
                }
              ],
              [
                {
                  text: request.observaciones,
                  fontSize: 10,
                  bold: true

                }
              ],
            ],
          }
        }

      ],
      styles: {
        columna: {
          fontSize: 10,
          alignment: 'center',
          margin: [10, 10, 10, 10, 10, 10],
        },
        filaTex: {
          heights: [60, 20, 20],
        },

        header: {
          fontSize: 10,
          bold: true,
        },
        codigoLeft: {
          marginLeft: 35
        },
        codigoTop: {
          marginTop: 30
        }
      }


    }
    pdfMake.createPdf(docDefinition).download('Plan_de_auditoria.pdf');
  }

  // valores de la tabla del formulario de planificación auditoria
  valueAuditoria: any = [];
  caracteristicaIndice: number = -1;

  // recibirValorModal(valor: any) {
  //   this.showTable = true; //mostrar tabla 
  //   const tempValor = this.valueAuditoria.push(valor);
  //   console.log(this.valueAuditoria,"valores")
  //   if(this.valueAuditoria.proceso != "") this.procesoNone =true;
  //   if(this.valueAuditoria.actividad != "") this.actividadNone =true;
  // }
 
  
  recibirValorModal(valor: any) {
    this.showTable = true; // mostrar tabla
    this.valueAuditoria.push(valor);

  }


  arrayListResponsible: any = [];
  fnListResponsible() {
    this.ApiService.getListResponsible().subscribe((data) => {
      this.arrayListResponsible = data;
      this.listAuditor = this.arrayListResponsible.filter((e: any) =>
        e.cargo === "Líder de Proceso"
      )

    })
  }
  editarCaracteristica: any = {};
  activiti: boolean = true;
  process: boolean = true;
  fnPlanningEdit(indice: number) {
    this.activiti = true;
    this.process = true; 
debugger
    this.caracteristicaIndice = indice;
    this.editarCaracteristica = {};
    if (this.valueAuditoria[indice].actividad === undefined){
      this.activiti = false;
      this.process = true; 
    } 
    else if(this.valueAuditoria[indice].actividad != '') {
      this.activiti = true;
      this.process = false; 
    }
    else if(this.valueAuditoria[indice].proceso === undefined){
      this.activiti = false;
      this.process = true; 
    }

    Object.assign(this.editarCaracteristica, this.valueAuditoria[indice]);
    console.log(this.editarCaracteristica, 'Editar');

  }
  fnSchedulingUpdate(indice: number) {
    this.caracteristicaIndice = -1;
    const title = "Actualizacion exitosa.";
    const message = "El registro se ha realizado exitosamente";
    this.Message.showModal(title, message);
  }
  fnPlanifiacacionEditarCancelar() {
    this.caracteristicaIndice = -1;

  }
  indiceAEliminarAuditoria: any;
  fnPlanificacionEliminar(indice: any) {
    this.indiceAEliminarAuditoria = this.valueAuditoria[indice];

  }
  newArray: any = [];
  recibirValor(valor: number) {
    if (valor == - 1) {
      this.newArray = this.valueAuditoria.filter((element: any) => {
        return element !== this.indiceAEliminarAuditoria;
      })
    }
    this.valueAuditoria = this.newArray;
  }
}
