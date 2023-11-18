import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ColorLista } from 'src/app/servicios/api/models/color';

@Component({
  selector: 'app-app-lista-de-verificacion',
  templateUrl: './app-lista-de-verificacion.component.html',
  styleUrls: ['./app-lista-de-verificacion.component.css'],
})


export class AppListaDeVerificacionComponent {
  mostrarMenu: boolean = false;
  pages = 1;
  returnedArray: any = []
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  contentArray: any = [];
  dataInitial = [];
  listaAuditoria: any[] = [];
  formParent!: FormGroup;
  selectedAuditoria: any = {};
  idProceso: any;
  idRequisito: any;
  preguntasArr: any;
  normaSelected: any;
  valorIngresado: string;
  requisitos: any[];
  dropdownList = [];
  selectedItems = [];
  leaders: any = [];
  selectedLeader: '' | any;
  selectedLeaderCargo: string = '';
  idAuditoria: any;
  requisitoIndex: any;
  dropdownSettings: IDropdownSettings;
  colorWallpaper:ColorLista;
  colorTitle:ColorLista
  
  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public ApiService: ApiService,
    private Message: ModalService,
  ) { }

  ngOnInit(): void {
    this.ApiService.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;

    this.formParent = this.formBuilder.group({
      documentos: ["", Validators.required],
      team: ["", Validators.required],
      personasAuditadas: ["", Validators.required],
      requisito: [''],
      evidencia: [''],
      formPreguntas: this.formBuilder.array([]),
      hallazgo: [''],
      observacion: [''],
      preguntas: ['']
    })
    this.searchLeader();
    this.consultarAuditoria();
    if (window.location.search.includes('form=show')) {
      document.getElementById('formListaDeVerficacion').style.display = 'block'
    }
    this.getUser();
  }
  //modal
  indiceAEliminarAuditoria: any;
  newArray: any = [];
  delete: boolean = false;
  showTable: boolean = false;
  valueRequired: any = [];
  caracteristicaIndice: number = -1;
  audit = Number(window.localStorage.getItem('ID_AUDITORIA'));

  fnPlanificacionEliminar(indice: any) {
    this.indiceAEliminarAuditoria = this.valueRequired[indice];
  }

  userInfor: any = {};
  getUser() {
    const idUsuario = window.localStorage.getItem('Id');
    this.ApiService.getUser(idUsuario).subscribe((data: any) => {
      this.userInfor = data;
    })
  }

  idDeleteRequisito: number;
  recibirValor(valor: number) {

    this.newArray = [];
    if (valor === -1) {
      this.delete = true;
      if (this.indiceAEliminarAuditoria.ID_REQUISITO == 0 || this.indiceAEliminarAuditoria.ID_REQUISITO == null) {
        this.newArray = this.valueRequired.filter((element: any) => {
          return element !== this.indiceAEliminarAuditoria;
        });
        this.valueRequired = this.newArray;
        const title = "Eliminación exitosa.";
        const message = "El registro se ha eliminado exitosamente";
        this.Message.showModal(title, message);
        this.arrayRequired = this.valueRequired;
        //Paginado//
        const totalPag = this.arrayRequired.length;
        this.contentArrayRequired = this.arrayRequired;
        this.valueRequired = this.arrayRequired.slice(0, 6);
        this.totalPaginasRequired = Math.trunc(totalPag / 6) + 1;
        this.totalRegistrosRequired = this.valueRequired.length;
        this.datatotalRequired = this.arrayRequired.length;
      } else {
        this.ApiService.deleteRequisitoAuditoria(this.indiceAEliminarAuditoria.ID_REQUISITO).subscribe((data: any) => {
          this.newArray = this.valueRequired.filter((element: any) => {
            return element !== this.indiceAEliminarAuditoria;
          });
          this.valueRequired = this.newArray;
          const title = "Eliminación exitosa.";
          const message = "El registro se ha eliminado exitosamente";
          this.Message.showModal(title, message);

          this.arrayRequired = this.valueRequired;
          //Paginado//
          const totalPag = this.arrayRequired.length;
          this.contentArrayRequired = this.arrayRequired;
          this.valueRequired = this.arrayRequired.slice(0, 6);
          this.totalPaginasRequired = Math.trunc(totalPag / 6) + 1;
          this.totalRegistrosRequired = this.valueRequired.length;
          this.datatotalRequired = this.arrayRequired.length;
        })
      }
    }
  }

  recibirValorModal(valor: any) {
    this.showTable = true; // Mostrar tabla
    this.valueRequired.push(valor);


    for (let i = 0; i < this.valueRequired.length; i++) {
      if (this.valueRequired[i].HALLAZGO === "OBS") {
        this.valueRequired[i].HALLAZGO = 'Observación';
      }
      if (this.valueRequired[i].HALLAZGO === "NC") {
        this.valueRequired[i].HALLAZGO = 'No Conformidad';
      }
      if (this.valueRequired[i].HALLAZGO === "OM") {
        this.valueRequired[i].HALLAZGO = 'Oportunidad de mejora';
      }
      if (this.valueRequired[i].HALLAZGO === "F") {
        this.valueRequired[i].HALLAZGO = 'Fortaleza';
      }
      if (this.valueRequired[i].HALLAZGO === "C") {
        this.valueRequired[i].HALLAZGO = 'Conforme';
      }
    }

    this.arrayRequired = this.valueRequired;
    //Paginado//

    const totalPag = this.arrayRequired.length;
    this.contentArrayRequired = this.arrayRequired;
    this.valueRequired = this.arrayRequired.slice(0, 6);
    this.totalPaginasRequired = Math.trunc(totalPag / 6) + 1;
    this.totalRegistrosRequired = this.valueRequired.length;
    this.datatotalRequired = this.arrayRequired.length;

  }

  indiceFormPreguntas!: number;
  formIndexSelect(evt: any) {
    this.indiceFormPreguntas = evt.target.selectedIndex;
    this.editarCaracteristica.formPreguntasSelect = this.valueRequired[this.caracteristicaIndice].formPreguntas[this.indiceFormPreguntas];
  }

  editarCaracteristica: any = {};
  fnPlanningEdit(indice: number) {
    this.caracteristicaIndice = indice;
    this.editarCaracteristica = {};
    if (this.valueRequired[indice].HALLAZGO === 'Observación') {
      this.valueRequired[indice].HALLAZGO = "OBS";
    }
    if (this.valueRequired[indice].HALLAZGO === 'No Conformidad') {
      this.valueRequired[indice].HALLAZGO = "NC";
    }
    if (this.valueRequired[indice].HALLAZGO === 'Oportunidad de mejora') {
      this.valueRequired[indice].HALLAZGO = "OM";
    }
    if (this.valueRequired[indice].HALLAZGO === 'Fortaleza') {
      this.valueRequired[indice].HALLAZGO = "F";
    }
    if (this.valueRequired[indice].HALLAZGO === 'Conforme') {
      this.valueRequired[indice].HALLAZGO = "C";
    }
    Object.assign(this.editarCaracteristica, this.valueRequired[indice]);
    this.editarCaracteristica.formPreguntas = this.valueRequired[indice].formPreguntas;
  }

  fnRequirementUpdate(indice: number) {
    this.caracteristicaIndice = -1;
    this.editarCaracteristica.formPreguntas[this.indiceFormPreguntas] = this.editarCaracteristica.formPreguntasSelect;
    console.log(this.editarCaracteristica.formPreguntasSelect);
    Object.assign(this.valueRequired[indice], this.editarCaracteristica);

    if (this.valueRequired[indice].HALLAZGO === "OBS") {
      this.valueRequired[indice].HALLAZGO = 'Observación';
    }
    if (this.valueRequired[indice].HALLAZGO === "NC") {
      this.valueRequired[indice].HALLAZGO = 'No Conformidad';
    }
    if (this.valueRequired[indice].HALLAZGO === "OM") {
      this.valueRequired[indice].HALLAZGO = 'Oportunidad de mejora';
    }
    if (this.valueRequired[indice].HALLAZGO === "F") {
      this.valueRequired[indice].HALLAZGO = 'Fortaleza';
    }
    if (this.valueRequired[indice].HALLAZGO === "C") {
      this.valueRequired[indice].HALLAZGO = 'Conforme';
    }
    this.ApiService.putRequisitosNormas(this.editarCaracteristica).subscribe((data: any) => {
    })

    const title = "Actualizacion exitosa.";
    const message = "El registro se ha realizado exitosamente";
    this.Message.showModal(title, message);

  }

  fnRequirementEditarCancelar() {
    this.caracteristicaIndice = -1;
  }

  //redirige
  redirigirAVista() {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "auditoria"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe();  
    this.router.navigate(['/auditoria']);
  }
  indiceAuditoria :any;
  consultarAuditoria() {
    const idPst = localStorage.getItem('Id')
    this.ApiService.getListarAuditorias(Number(idPst))
      .subscribe((data: any) => {
        this.listaAuditoria = data;
        this.dataInitial = data;

        //paginado
        this.listaAuditoria = this.dataInitial.slice(0, 6);
        const totalPag = data.length;
        this.totalPaginas = Math.trunc(totalPag / 6) + 1;
        this.totalRegistros = data.length;
        this.contentArray = data;

        for (let i = 0; i < this.listaAuditoria.length; i++) {
          this.idAuditoria = this.listaAuditoria[i].ID_AUDITORIA;
        }
        this.normaSelected = localStorage.getItem('normaSelected');
        return this.listaAuditoria;
      })
  }

  idAudit:number;
  capturarId(id:any){
    this.idAudit = id.ID_AUDITORIA;
  }

  openComponentLista(evt: any) {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "listaDeVerificacion"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe();  
    this.router.navigate(['/listaDeVerificacion'], {
      queryParams: {
        item: evt.target?.i
      }
    }
    );
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

  searchLeader() {
    // this.http.get('assets/cargo.json')
    this.ApiService.getAuditorListService()
      .subscribe((data: any) => {
        this.leaders = data;
        return this.leaders;
      }
      )
  }

  //funcion para guardar el cargo y el nombre del lider
  selectLeader(leader: any) {
    // //valor del cargo
    this.selectedLeader = leader.target.value;
    const filterLider = this.leaders.filter(e => e?.NOMBRE === leader.target.value);
    this.selectedLeaderCargo = filterLider[0]?.CARGO;
  }

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }

  getActualDate() {
    let date = new Date();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    let formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  saveFormVerificacion() {
    for (let i = 0; i < this.valueRequired.length; i++) {
      this.valueRequired[i].fK_ID_PROCESO = this.idProceso;
      this.valueRequired[i].PREGUNTA = this.valueRequired[i].formPreguntas.toString();

      if (this.valueRequired[i].ID_REQUISITO == 0 || this.valueRequired[i].ID_REQUISITO == null) {
        this.valueRequired[i].ID_REQUISITO = 0;
      } else { this.valueRequired[i].ID_REQUISITO; }

      if (this.valueRequired[i].HALLAZGO === 'Observación') {
        this.valueRequired[i].HALLAZGO = "OBS";
      }
      if (this.valueRequired[i].HALLAZGO === 'No Conformidad') {
        this.valueRequired[i].HALLAZGO = "NC";
      }
      if (this.valueRequired[i].HALLAZGO === 'Oportunidad de mejora') {
        this.valueRequired[i].HALLAZGO = "OM";
      }
      if (this.valueRequired[i].HALLAZGO === 'Fortaleza') {
        this.valueRequired[i].HALLAZGO = "F";
      }
      if (this.valueRequired[i].HALLAZGO === 'Conforme') {
        this.valueRequired[i].HALLAZGO = "C";
      }

    }

    const request = {
      REQUISITOS: this.valueRequired,
      iD_PROCESO_AUDITORIA: this.idProceso,
      CARGO_LIDER: this.selectedLeaderCargo ? this.selectedLeaderCargo : this.showLeaderCargo,
      LIDER_PROCESO: this.formParent.get('team').value ? this.formParent.get('team').value : this.showProcessLeader,
      DOCUMENTOS_REFERENCIA: this.formParent.get('documentos').value ? this.formParent.get('documentos').value : this.showDocuments,
      OTROS_AUDITADOS: this.formParent.get('personasAuditadas').value ? this.formParent.get('personasAuditadas').value : this.showAudited,
    }

    this.ApiService.updateAuditoria(request).subscribe((data: any) => {
      if (data.statusCode == 201) {
        const title = "Actualizacion exitosa.";
        const message = "El registro se ha realizado exitosamente";
        this.Message.showModal(title, message);
        this.consultarAuditoria()
      }
    })
    return this.generateListaDeAuditoria(request);
  }

  generateListaDeAuditoria(request) {
    var headerElement = {};
  
    if (this.userInfor.LOGO == null) {
      headerElement = { text: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 };
    } else {
      headerElement = { image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 };
    }
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
                headerElement,
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
        {
          table: {
            widths: ['*', '*', '*', '*',],
            body: [
              [
                { text: 'Fecha de auditoría', style: ['tituloDinamico'] },
                { text: this.selectedAuditoria?.FECHA_AUDITORIA, colSpan: 1, },
                { text: 'Norma(s) a auditar' },
                { text: localStorage.getItem('normaSelected')},
              ],
              [
                { text: 'Nombre auditor', style: ['tituloDinamico'] },
                { text: this.selectedAuditoria.AUDITOR_LIDER, colSpan: 1, },
                { text: 'Proceso(s) / Actividad / Requisito a auditar ' },
                { text: this.nuevoProceso },
              ],
              [
                { text: 'Nombre líder(es) de proceso(s) a auditar ', style: ['tituloDinamico'] },
                { text: request.LIDER_PROCESO ? request.LIDER_PROCESO : this.showProcessLeader, colSpan: 1, },
                { text: 'Cargo(s)' },
                { text: request.CARGO_LIDER ? request.CARGO_LIDER : this.showLeaderCargo },
              ],
              [
                { text: 'Nombre(s) de otra(s) persona(s) auditada(s) ', style: ['tituloDinamico'] },
                { text: request.OTROS_AUDITADOS ? request.OTROS_AUDITADOS : this.showAudited, colSpan: 3, },
                { text: '' },
                { text: '' },
              ],
              [
                { text: 'Objetivos de auditoría ', style: ['tituloDinamico'] },
                { text: this.selectedAuditoria.OBJETIVO, colSpan: 3, },
                { text: '' },
                { text: '' },
              ],
              [
                { text: 'Alcance de auditoría', style: ['tituloDinamico'] },
                { text: this.selectedAuditoria.ALCANCE, colSpan: 3, },
                { text: '' },
                { text: '' },
              ],
              [
                { text: 'Documentos de referencia ', style: ['tituloDinamico'] },
                { text: request.DOCUMENTOS_REFERENCIA ? request.DOCUMENTOS_REFERENCIA : this.showDocuments },
                { text: 'Criterios de auditoría', style: ['tituloDinamico'] },
                { text: this.selectedAuditoria.CRITERIO },
              ],
            ],
          },
          fontSize: 10,
        },
        '\nNC=No conformidad  OBS = Observación   OM = Oportunidad de mejora  F = Fortaleza C = Conforme ',
        '\n',
        {
          table: {
            headerRows: 1,
            body: [
              [
                { text: 'Requisito', style: ['columna'], border: [true, true, true, false] },
                { text: 'Pregunta(s)', style: ['columna'], border: [true, true, true, false] },
                { text: 'Posible evidencia', style: ['columna'], border: [true, true, true, false] },
                { text: 'Hallazgo(s)', style: ['columna'], colSpan: 5 },
                {},
                {},
                {},
                {},
                { text: 'Observaciones o comentarios o notas de auditor', style: ['columna'], border: [true, true, true, false] },
              ],
              [
                { text: '', border: [true, false, true, true] },
                { text: '', border: [true, false, true, true] },
                { text: '', border: [true, false, true, true] },
                'NC',
                'OBS',
                'OM',
                'F',
                'C',
                { text: '', border: [true, false, true, true] },
              ],
              ...this.valueRequired.map(requisito => 
                
                [
                  { text: requisito.REQUISITO, style: ['columna'] },
                 // { text: request.REQUISITOS[this.indexDetalle].REQUISITO.TITULO, style: ['columna'] },
                  { text: requisito.formPreguntas.flatMap(e => e).toString(), style: ['columna'] },
                  { text: requisito.EVIDENCIA, style: ['columna'] },
                  { text: requisito?.HALLAZGO == 'NC' ? 'X' : '', style: ['columna'] },
                  { text: requisito?.HALLAZGO == 'OBS' ? 'X' : '', style: ['columna'] },
                  { text: requisito?.HALLAZGO == 'OM' ? 'X' : '', style: ['columna'] },
                  { text: requisito?.HALLAZGO == 'F' ? 'X' : '', style: ['columna'] },
                  { text: requisito?.HALLAZGO == 'C' ? 'X' : '', style: ['columna'] },
                  { text: requisito?.OBSERVACION, style: ['columna'] },
                ])
            ]
          },
        },
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

        codigo: {
          marginRigth: -20,
          marginTop: 20,
          alignment: 'center',
        },

        codigoLeft: {
          marginLeft: 35
        },

        codigoTop: {
          marginTop: 30
        }
      }
    }

    return pdfMake.createPdf(docDefinition).open();

  }

  showLeader: boolean = false;
  showProcessLeader: string = '';
  showLeaderCargo: string = '';
  showAudited: string = '';
  showDocuments: string = '';
  arrayRequired: any = [];
  nuevoProceso: any;
  nuevoNorma:any;

  //Detalle
   indexDetalle: number;
   recibirValorDetalle(valor) {
    // indice del proceso seleccionado enviado del modal del detalle 
    this.indexDetalle = valor.index; 
    this.ApiService.getAuditorias(valor.ID_AUDITORIA)
      .subscribe((data: any) => {
        localStorage.setItem('ID_AUDITORIA',valor.ID_AUDITORIA);
        const tableAudit = document.querySelector('#table_audit') as HTMLInputElement;
        const tableListaDeVerificacion = document.querySelector('#formListaDeVerficacion') as HTMLInputElement;
        tableAudit.style.display = "none";
        tableListaDeVerificacion.style.display = "block";
        this.selectedAuditoria = data; 
        this.nuevoProceso = this.selectedAuditoria?.PROCESOS[0].PROCESO_DESCRIPCION;
        this.nuevoNorma = this.selectedAuditoria?.PROCESOS[0].NORMAS_DESCRIPCION;

        //obteniendo id proceso
          this.idProceso = this.selectedAuditoria.PROCESOS[this.indexDetalle].ID_PROCESO_AUDITORIA;
          //Seleccionar un líder
          if (this.selectedAuditoria.PROCESOS[this.indexDetalle].LIDER_PROCESO != "" && this.selectedAuditoria.PROCESOS[this.indexDetalle]?.LIDER_PROCESO != null) {
            this.showLeader = true;
            this.showProcessLeader = this.selectedAuditoria.PROCESOS[this.indexDetalle].LIDER_PROCESO;
            this.formParent.get('team').disable();
            this.showLeaderCargo = this.selectedAuditoria.PROCESOS[this.indexDetalle].CARGO_LIDER;

          }
          //Nombre(s) de otra(s) persona(s) auditada(s)
          if (this.selectedAuditoria.PROCESOS[this.indexDetalle].OTROS_AUDITADOS != "" && this.selectedAuditoria.PROCESOS[this.indexDetalle].OTROS_AUDITADOS != null) {
            this.showLeader = true;
            this.showAudited = this.selectedAuditoria.PROCESOS[this.indexDetalle].OTROS_AUDITADOS;
            this.formParent.get('personasAuditadas').disable();
          }

          //Documentos de referencia
          if (this.selectedAuditoria.PROCESOS[this.indexDetalle].DOCUMENTOS_REFERENCIA != "" && this.selectedAuditoria.PROCESOS[this.indexDetalle]?.DOCUMENTOS_REFERENCIA != null) {
            this.showLeader = true;
            this.showDocuments = this.selectedAuditoria.PROCESOS[this.indexDetalle].DOCUMENTOS_REFERENCIA;
            this.formParent.get('documentos').disable();
          }
          if (this.selectedAuditoria.PROCESOS[this.indexDetalle].REQUISITOS.length > 0) {
            this.showTable = true;
            for (let j = 0; j < this.selectedAuditoria.PROCESOS[this.indexDetalle].REQUISITOS.length; j++) {
              this.valueRequired = this.selectedAuditoria.PROCESOS[this.indexDetalle].REQUISITOS;
              this.valueRequired[j].formPreguntas = this.valueRequired[j].PREGUNTA.split(',');
              if (this.valueRequired[j].HALLAZGO === "OBS") {
                this.valueRequired[j].HALLAZGO = 'Observación';
              }
              if (this.valueRequired[j].HALLAZGO === "NC") {
                this.valueRequired[j].HALLAZGO = 'No Conformidad';
              }
              if (this.valueRequired[j].HALLAZGO === "OM") {
                this.valueRequired[j].HALLAZGO = 'Oportunidad de mejora';
              }
              if (this.valueRequired[j].HALLAZGO === "F") {
                this.valueRequired[j].HALLAZGO = 'Fortaleza';
              }
              if (this.valueRequired[j].HALLAZGO === "C") {
                this.valueRequired[j].HALLAZGO = 'Conforme';
              }
            }
          }
 
        this.arrayRequired = this.valueRequired;
        //Paginado//
        const totalPag = this.arrayRequired.length;
        this.contentArrayRequired = this.arrayRequired;
        this.valueRequired = this.arrayRequired.slice(0, 6);
        this.totalPaginasRequired = Math.trunc(totalPag / 6) + 1;
        this.totalRegistrosRequired = this.valueRequired.length;
        this.datatotalRequired = this.arrayRequired.length;
      })

  }
  contentArrayRequired: any = [];
  currentPage: number = 1
  pagesRequired: number = 1;
  totalPaginasRequired: any;
  totalRegistrosRequired: any;
  datatotalRequired: any;

  pageChangedRequired(event: any): void {
    this.pagesRequired = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;

    this.valueRequired = this.arrayRequired.slice(startItem, endItem)
  }

  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;
    this.listaAuditoria = this.dataInitial.slice(startItem, endItem)
  }

  
}