import { Component, ViewEncapsulation, Renderer2, HostListener } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiService } from '../../../servicios/api/api.service'
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'moment-timezone';
import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ColorLista } from 'src/app/servicios/api/models/color';
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
  showDisableBtn: boolean = true;
  toggleValue: boolean = false;//prueba toggle
  listAuditor: any = [];
  listNormaTitulo: any = [];
  equipoAuditor: any = [];
  dropdownList = [];
  dropdownListNorma = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  formParent!: FormGroup;
  colorWallpaper:ColorLista;
  colorTitle:ColorLista;
  isCollapsed = true;
  mostrarNotificacion : boolean = false;
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    public ApiService: ApiService,
    private Message: ModalService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.ApiService.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;

    this.formParent = this.formBuilder.group({
      liderAuthor: ["", Validators.required],
      auditorTeam: ["", Validators.required],
      objAuditoria: ["", Validators.required],
      alcanceAuditoria: ["", Validators.required],
      criterioAuditoria: ["", Validators.required],
      dateInit: ["", Validators.required],
      actividadTable: ["", Validators.required],
      dateEnd: [""],
      fecha: [""],
      planAuditoriaDate: [""],
      auditor: [""],
      auditados: [""],
      observacion: [""],
      fechaActual: [""],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
      hora: [""],
      proceso: [""],
      actividad: [""],
    });
    this.getAuditorList();
    this.fnListResponsible();
    this.getUser();


    
  }
  //Para el responsive
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 970) {
      // Cambiar el valor de isCollapsed a false cuando el ancho de pantalla es menor o igual a 970px
      this.isCollapsed = true;
    } else {
      // Cambiar el valor de isCollapsed a true cuando el ancho de pantalla es mayor a 970px
      this.isCollapsed = false;
    }
  }




  getActualDate() {
    let date = new Date();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    let formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  onDateChange(event: any) {
    const dateInitValue = this.formParent.get('dateInit').value;
    const dateEndValue = this.formParent.get('dateEnd').value;
    const currentDate = new Date();
    
    if (dateEndValue && dateInitValue) {

      const inicioValue = new Date(dateInitValue);
      const finValue = new Date(dateEndValue);
      const now = new Date();  
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      debugger;
      if (finValue < inicioValue) {
        const title = "Registro no exitoso";
        const message = "Por favor verifique la fecha";
        this.Message.showModal(title, message);
        return;
      }
       else if(inicioValue< today || finValue < today){
        const title = "Registro no exitoso";
        const message = "Por favor la fecha no puede ser menor a la fecha actual";
        this.Message.showModal(title, message);
        this.formParent.get('dateInit').setValue('');
        this.formParent.get('dateEnd').setValue('');
        return;
      }
    }
  }
  
  

  


  Validacion(Msj){
    const title = "Datos Inválidos.";
    const message = Msj;
    this.Message.showModal(title, message);
    this.formParent.get('dateInit').setValue('');
    this.formParent.get('dateEnd').setValue('');
  }

  /* nicio */
  onItemSelect(item: any) {
    // console.log(item);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  /* Fin */
  listAuditorData: any = [];
  getAuditorList() {
    this.ApiService.getAuditorListService().subscribe((data: any) => {

      this.listAuditor = data;

      this.equipoAuditor = data;
      this.dropdownList = this.listAuditor.map((auditor: any) => ({
        item_id: auditor.ID_USUARIO,
        item_text: auditor.NOMBRE
      }));
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Seleccionar todos',
        unSelectAllText: 'Deseleccionar todo',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
    });
  }



 

  openComponent(evt: any) {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "nuevoPlanDeAuditoria"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe();
    this.router.navigate(['/nuevoPlanDeAuditoria'], { queryParams: { item: evt.target?.id } });
  }
  openComponentLista(evt: any) {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "listaDeVerificacion"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe();
    return this.router.navigate(['/listaDeVerificacion'], { queryParams: { item: evt.target?.id } });
  }

  openComponentInforme(evt: any) {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "informeAuditoria"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe();
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
    const timeZone = 'America/Lima'; // configurar la zona horaria aquí
    const formattedHour = moment.utc(dateHour).tz(timeZone);
    const finalHour = moment(formattedHour).format('hh:mm:ss A');
    return finalHour;
  }

  
  myTime: string;
  startTime: string;
  endTime: string;
  saveForm() {

    for (let i = 0; i < this.valueAuditoria.length; i++) {
      if (this.valueAuditoria[i].fecha) {
        this.valueAuditoria[i].fecha = this.formantDate(new Date(this.valueAuditoria[i].fecha))
      }
    }
    const idPst = localStorage.getItem('Id')

    const request = {
      iD_AUDITORIA: 0,
      fK_ID_PST: Number(idPst),
      auditoR_LIDER: this.formParent.get("liderAuthor")?.value,
      equipO_AUDITOR: this.formParent.get("auditorTeam")?.value?.flatMap(e => e.item_text).toString(),
      objetivo: this.formParent.get("objAuditoria")?.value,
      alcance: this.formParent.get("alcanceAuditoria")?.value,
      criterio: this.formParent.get("criterioAuditoria")?.value,
      fechA_REUNION_APERTURA: this.formantDate(new Date(this.formParent.get("dateInit")?.value)),
      horA_REUNION_APERTURA: this.formParent.get("startTime")?.value,
      fechA_REUNION_CIERRE: this.formantDate(new Date(this.formParent.get("dateEnd")?.value)),
      horA_REUNION_CIERRE: this.formParent.get("endTime")?.value,
      fechA_AUDITORIA: this.getActualDate(),
      observaciones: this.formParent.get("observacion")?.value,
      conformidades: [],
      procesos: this.valueAuditoria
    }
      ;      

    this.ApiService.insertAuditoria(request)
      .subscribe((data: any) => {
      })
    return this.generatePlanDeAuditoria(request);
  }
  userInfor: any = {};
  getUser() {
    const idUsuario = window.localStorage.getItem('Id');
    this.ApiService.getUser(idUsuario).subscribe((data: any) => {
      this.userInfor = data;
    })
  }
  clearForm() {
    this.formParent.reset();
  }

  generatePlanDeAuditoria(request) {
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
                { image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin: [0, 15, 0, 15], rowSpan: 2 },
                { text: 'LISTA DE VERIFICACIÓN AUDITORÍA', alignment: 'center', margin: [0, 15, 0, 15], rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin: [0, 2, 0, 2] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', style: ['codigoLeft'] },
              ]
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
              ...this.valueAuditoria.map(requisito =>
                [

                  { text: requisito.fecha, style: ['columna'] },
                  { text: requisito.hora, style: ['columna'] },
                  { text: requisito.proceso? requisito.proceso : requisito.actividad, style: ['columna'] },
                  { text: requisito.norma? requisito.norma: requisito.requisito, style: ['columna'] },
                  { text: requisito.auditor, style: ['columna'] },
                  { text: requisito.auditados, style: ['columna'] }
                ]
              )

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
    pdfMake.createPdf(docDefinition).open();
  }

  // valores de la tabla del formulario de planificación auditoria
  valueAuditoria: any = [];
  caracteristicaIndice: number = -1;
  arrayAuditoria: any = [];
  contentArrayAuditoria: any = [];
  currentPage: number = 1
  pagesAuditoria: number = 1;
  totalPaginasAuditoria: any;
  totalRegistrosAuditoria: any;
  datatotalAuditoria: any;

  recibirValorModal(valor: any) {

    this.valueAuditoria.push(valor)
    if (this.valueAuditoria.length > 0) {
      this.formParent?.get('actividadTable').disable();
    }
    else {
      this.formParent?.get('actividadTable').enable();
    }


    this.showTable = true; // mostrar tabla

    this.arrayAuditoria = this.valueAuditoria;

    //Paginado//
    const totalPag = this.arrayAuditoria.length;
    this.contentArrayAuditoria = this.arrayAuditoria;
    this.valueAuditoria = this.arrayAuditoria.slice(0, 6);
    this.totalPaginasAuditoria = Math.trunc(totalPag / 6) + 1;
    this.totalRegistrosAuditoria = this.valueAuditoria.length;
    this.datatotalAuditoria = this.arrayAuditoria.length;

  }
  pageChangedAuditoria(event: any): void {
    this.pagesAuditoria = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;

    this.valueAuditoria = this.arrayAuditoria.slice(startItem, endItem)

  }

  arrayListResponsible: any = [];
  fnListResponsible() {

    this.ApiService.getListResponsible().subscribe((data) => {

      this.arrayListResponsible = data;
      const tempoListAuditor = this.arrayListResponsible.filter((e: any) =>
        e.CARGO === "Líder de Proceso"
      )

      if (tempoListAuditor.length > 0) this.listAuditor = tempoListAuditor

    })
  }

  editarCaracteristica: any = {};
  activiti: boolean = true;
  process: boolean = true;
  fnPlanningEdit(indice: number) {

    this.activiti = true;
    this.process = true;
    this.caracteristicaIndice = indice;
    this.editarCaracteristica = {};
    if (this.valueAuditoria[indice].actividad === undefined) {
      this.activiti = false;
      this.process = true;
    }
    else if (this.valueAuditoria[indice].actividad != '') {
      this.activiti = true;
      this.process = false;
    }
    else if (this.valueAuditoria[indice].proceso === undefined) {
      this.activiti = false;
      this.process = true;
    }
    Object.assign(this.editarCaracteristica, this.valueAuditoria[indice]);
    this.editarCaracteristica.auditados
  }
  fnSchedulingUpdate(indice: number) {
    this.caracteristicaIndice = -1;
    Object.assign(this.valueAuditoria[indice], this.editarCaracteristica);
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
    if (this.valueAuditoria.length > 0) {
      this.formParent.get('actividadTable').disable();
    }
    else {
      this.formParent.get('actividadTable').enable();
    }
    this.arrayAuditoria = this.valueAuditoria;
    //Paginado//
    const totalPag = this.arrayAuditoria.length;
    this.contentArrayAuditoria = this.arrayAuditoria;
    this.valueAuditoria = this.arrayAuditoria.slice(0, 6);
    this.totalPaginasAuditoria = Math.trunc(totalPag / 6) + 1;
    this.totalRegistrosAuditoria = this.valueAuditoria.length;
    this.datatotalAuditoria = this.arrayAuditoria.length;
  }
  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }


}
