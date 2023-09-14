import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ApiService } from '../../../servicios/api/api.service';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { debug } from 'console';

@Component({
  selector: 'app-app-informe-de-auditoria',
  templateUrl: './app-informe-de-auditoria.component.html',
  styleUrls: ['./app-informe-de-auditoria.component.css']
})
export class AppInformeDeAuditoriaComponent {
  pages = 1;
  returnedArray: any = []
  totalPaginas: number = 0;
  totalRegistros: number = 0; 
  contentArray: any = [];
  dataInitial = []
  mostrarMenu: boolean = false;
  requisitos: any = [];
  formParent!: FormGroup;
  arrRequisito: any;
  dataInitialReq= []; //prueba
  dataInitialReqArray = []; //prueba
  selectedProceso:any ={};
  procesoFinal:any= [];
  idProceso:any;
  contentArrayReq: any = [];//prueba
  arrProceso: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder:FormBuilder,
    public ApiService: ApiService,
    private Message: ModalService,
  ) { 
    this.formParent = this.formBuilder.group({
      conclusiones:["",Validators.required],
      // procesoOrActividad: ["",Validators.required],
      formRequisitos: this.formBuilder.array([
      ])
    })
   }
  

  ngOnInit(): void {
   this.dataDinamica();
   this.getUser();
  }

  mostrarFormulario() {
    // Lógica para mostrar el formulario
    this.mostrarMenu = true;
  }
  
  ocultarFormulario() {
    // Lógica para ocultar el formulario
    this.mostrarMenu = false;
  }
  


  nuevoProceso:any;
  selectAudit(audit){
    this.ApiService.getAuditorias(audit.ID_AUDITORIA)
    .subscribe((data:any)=> {
      const filterAudit = data
      
      //filterAudit[0].requisitos;
      this.requisitos = data;
      this.selectedProceso = filterAudit[0]; 
      //pinta los datos dinamicos fel formulario
      this.selectedProceso = data; 
      this.selectedProceso.EQUIPO_AUDITOR = this.selectedProceso.EQUIPO_AUDITOR.replace(/,/g,", ");
      //pinta el proceso
      this.nuevoProceso = this.selectedProceso?.PROCESOS[0]?.PROCESO_DESCRIPCION;
      const tableAudit =  document.querySelector('#table_proceso') as HTMLInputElement;
      const tableListaDeVerificacion =  document.querySelector('#formAuditoria') as HTMLInputElement;
      tableAudit.style.display = "none";
      tableListaDeVerificacion.style.display="block";
      if(data){
        
        this.arrRequisito = data.PROCESOS.map((req,index) =>req.REQUISITOS)[0];
        this.arrRequisito= data.PROCESOS.map((req,index) =>req.REQUISITOS)[0].slice(0, 6);

        this.arrProceso = data.PROCESOS;
        this.idInformeAuditoria = this.arrProceso[0].ID_PROCESO_AUDITORIA;
        //paginado
        const totalPag = data.PROCESOS.map((req,index) =>req.REQUISITOS)[0].length;
        this.totalPaginas = Math.trunc(totalPag / 6) + 1;
        this.totalRegistros = data.PROCESOS.map((req,index) =>req.REQUISITOS)[0].length;
        this.contentArrayReq = data.PROCESOS.map((req,index) =>req.REQUISITOS)[0];
      }

      //this.arrProceso= data.procesos.map(proc) => proc
    })
  }
  dataDinamica(){
    //this.http.get("assets/informeFinal.json")
    const idPst = localStorage.getItem('Id')
    this.ApiService.getListarAuditorias(Number(idPst))
    .subscribe((data:any)=> {
      this.procesoFinal= data;
      this.dataInitial = data;
   

      //paginado
      this.procesoFinal= this.dataInitial.slice(0, 6);
      const totalPag = data.length;
      this.totalPaginas = Math.trunc(totalPag / 6) + 1;
      this.totalRegistros = data.length;
      this.contentArray = data;

    })
  
  }
  userInfor: any = {};
  getUser() {
    const idUsuario = window.localStorage.getItem('Id');
    this.ApiService.getUser(idUsuario).subscribe((data: any) => {
      this.userInfor = data;
    })
  }
  idInformeAuditoria:any;
  saveForm(){
  if (this.formParent) {
  const request ={
    //  hallazgo:this.selectedProceso.PROCESOS[0],
    //  proceso : this.selectedProceso.PROCESO,
    //  auditorLider : this.selectedProceso.AUDITOR_LIDER,
    //  equipo : this.selectedProceso.EQUIPO_AUDITOR,
    //  fecha : this.selectedProceso.FECHA_AUDITORIA,
    //  objetivo : this.selectedProceso.OBJETIVO,
    //  alcance :  this.selectedProceso.ALCANCE,
    //  criterio : this.selectedProceso.CRITERIO,
    //  reunionCierre : this.selectedProceso.FECHA_REUNION_CIERRE,
    ID_PROCESO_AUDITORIA: this.idInformeAuditoria,
    //  nuevoProceso:this.nuevoProceso,
    CONCLUSION_CONFORMIDAD : this.formParent.get("conclusiones")?.value,
 
  }

  // const serviceRequet = {
  //   "iD_PROCESO_AUDITORIA": this.idProceso,
  //   "fK_ID_AUDITORIA": this.idProceso,
  //   "fecha": this.selectedProceso.fechA_AUDITORIA,
  //   "hora": "string",
  //   "procesO_DESCRIPCION": "string",
  //   "lideR_PROCESO": "string",
  //   "cargO_LIDER": "string",
  //   "normaS_AUDITAR": "string",
  //   "auditor": "string",
  //   "auditados": "string",
  //   "documentoS_REFERENCIA": "string",
  //   "conclusioN_CONFORMIDAD": "string",
  //   "estado": true,
  //   "requisitos": this.arrRequisito,
  //   // "conformidades":conf
  // }


   //this.ApiService.updateAuditoria(serviceRequet).subscribe((data:any) =>{
    
  // const serviceRequet = {
  //   "iD_PROCESO_AUDITORIA": this.idProceso,
  //   "fK_ID_AUDITORIA": this.idProceso,
  //   "fecha": this.selectedProceso.fechA_AUDITORIA,
  //   "hora": "string",
  //   "procesO_DESCRIPCION": "string",
  //   "lideR_PROCESO": "string",
  //   "cargO_LIDER": "string",
  //   "normaS_AUDITAR": "string",
  //   "auditor": "string",
  //   "auditados": "string",
  //   "documentoS_REFERENCIA": "string",
  //   "conclusioN_CONFORMIDAD": "string",
  //   "estado": true,
  //   "requisitos": this.arrRequisito,
  //   //"conformidades":conf
  // }


   this.ApiService.updateInformeAuditoria(request).subscribe((data:any) =>{
     if (data.statusCode == 201) {
      const title = "Actualizacion exitosa.";
      const message = "El registro se ha realizado exitosamente";
      this.Message.showModal(title, message);
      this.formParent.reset();
      this.dataDinamica()
    }

    })
    this.ApiService.UpdateAuditoriaEstadoTerminado(this.idInformeAuditoria).subscribe();
  return this.generateInformeDeAuditoria(request);
   }}

   generateInformeDeAuditoria(request) {

    const newFormantRequisito = this.arrRequisito.map(req =>  {

     return{
      numeracion:req.NUMERACION,
      requisito:req.REQUISITO,
      observacion:req.OBSERVACION,
      hallazgo: req.HALLAZGO,
     }
    })
    
    const docDefinition:any = {
      pageMargins: [ 30, 30, 30, 30 ],
      content: [
        {
          headerRows: 2,
          table: {
            heights: [ 20, 20, 20, 20 ],
            widths:  [ '*', '*','*', 100 ],
            headerRows: 1,
            body: [
              [
                { image:this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text:this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin: [0, 15, 0, 15], rowSpan: 2 },
                { text: 'INFORME DE  AUDITORÍA', alignment: 'center', margin: [0, 15, 0, 15], rowSpan: 2 },
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
  
            widths: [150, '*' ,'*','*' ,'*', ],
            body: [
              [
                { text: 'Informe de Auditoría ', colSpan: 5, alignment: 'center', bold: true},
                {},
                {},
                {},
                {},
                
  
              ],
              [
                {text: 'Procesos / Actividad Auditadas ', style: ['tituloDinamico']},
                {text:this.nuevoProceso,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Auditor Líder ', style: ['tituloDinamico']},
                {text: this.selectedProceso.AUDITOR_LIDER,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Equipo Auditor', style: ['tituloDinamico']},
                {text:this.selectedProceso.EQUIPO_AUDITOR ,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Fecha de informe de auditoría ', style: ['tituloDinamico']},
                {text:this.selectedProceso.FECHA_AUDITORIA,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Objetivos de la auditoría ', style: ['tituloDinamico']},
                {text:this.selectedProceso.OBJETIVO,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Alcance de la auditoria ', style: ['tituloDinamico']},
                {text:this.selectedProceso.ALCANCE,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Criterios de la auditoría ', style: ['tituloDinamico']},
                {text:this.selectedProceso.CRITERIO,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
                
              ],
              
            ],
        },
        fontSize: 10,
      },
      '\n',
      {
        table: {

          widths: [453, 'auto' ,'auto', ],
          body: [
            [
              { text: 'Conformidad del sistema de gestión de sostenibilidad ', colSpan: 3, alignment: 'center', bold: true},
              {},
              {},
              
              

            ],
            [
              {text: 'Descripción ',alignment: 'center', bold: true, style: ['tituloDinamico']},
              {text:'NTC',alignment: 'center', bold: true,},
              {text:'Legales',alignment: 'center', bold: true,},
              
            ],
            
             [  

              {text: 'Total de NO CONFORMIDADES detectadas en esta auditoría ', style: ['tituloDinamico']},
              {text:this.selectedProceso.PROCESOS[0].CANT_NC,alignment: 'center', bold: true,},
              {text:'--',alignment: 'center', bold: true,},
              
             ],
             [  

              {text: 'Total de OBSERVACIONES detectadas en esta auditoría ', style: ['tituloDinamico']},
              {text:this.selectedProceso.PROCESOS[0].CANT_OBS,alignment: 'center', bold: true,},
              {text:'--',alignment: 'center', bold: true,},
              
             ],
             [  

              {text: 'Total de OPORTUNIDADES DE MEJORA detectadas en esta auditoría ', style: ['tituloDinamico']},
              {text:this.selectedProceso.PROCESOS[0].CANT_OM,alignment: 'center', bold: true,},
              {text:'--',alignment: 'center', bold: true,},
              
             ],
             [  

              {text: 'Total de FORTALEZAS detectadas en esta auditoría ', style: ['tituloDinamico']},
              {text:this.selectedProceso.PROCESOS[0].CANT_F,alignment: 'center', bold: true,},
              {text:'--',alignment: 'center', bold: true,},
              
             ],
             [  

              {text: 'Total de CONFORMIDADES detectadas en esta auditoría ', style: ['tituloDinamico']},
              {text:this.selectedProceso.PROCESOS[0].CANT_C,alignment: 'center', bold: true,},
              {text:'--',alignment: 'center', bold: true,},
             
             ],
             
          ],
      },
      fontSize: 10,
    },
        '\n',
        {
          table: {
  
            widths: ['auto','*'],
            body: [
              [
                { text: 'PROCESO / ACTIVIDAD ', bold: true},
                {text:this.nuevoProceso,colSpan: 1, }
            
              ],
              
      ]},
      fontSize: 10,
    },
    '\n',
    {
      table: {
        widths: ['auto', '*' ,'auto','auto','auto','auto','auto','*'],
        body: [
          [
            {text: 'N°', alignment: 'center', bold: true},
            {text: 'Requisito', alignment: 'center', bold: true},
            {text: 'NC', alignment: 'center', bold: true},
            {text: 'OBS', alignment: 'center', bold: true},
            {text: 'OM', alignment: 'center', bold: true},
            {text: 'F', alignment: 'center', bold: true},
            {text: 'C', alignment: 'center', bold: true},
            {text: 'Observaciones', alignment: 'center', bold: true},
            
          ],
             ...newFormantRequisito.map(requisitos=> [   
            { text: requisitos.numeracion, style: [ 'columna' ]},   
            { text: requisitos.requisito, style: [ 'columna' ]},
            { text: requisitos.hallazgo == 'NC'? 'X': '', style: [ 'columna' ]},
            { text: requisitos.hallazgo == 'OBS'? 'X': '', style: [ 'columna' ]},
            { text: requisitos.hallazgo == 'OM'? 'X': '', style: [ 'columna' ]},
            { text: requisitos.hallazgo == 'F'? 'X': '', style: [ 'columna' ]},
            { text: requisitos.hallazgo == 'C'? 'X': '', style: [ 'columna' ]},
            { text: requisitos.observacion, style: [ 'columna' ]},
            
          ])

          
        ],
    },

    fontSize: 10,
  },    
  '\n',   
        { 
        table: {
          widths: ['100%'],
          heights: [10,80],
          body: [
              [
                  { 
                      text: 'Conclusiones de auditoría',
                      fontSize: 10,
                      bold: true,
                      alignment: 'center',
                  }
              ],
              [
                  { 
                      text:request.CONCLUSION_CONFORMIDAD,
                      fontSize: 10,
                      bold: true
  
                  }
              ],
          ],
      }
    }
  
      ], 
      styles:{
        columna: {
          fontSize: 10,
          alignment: 'center',
          margin: [10, 10, 10, 10,10,10],
        },
        filaTex:{
          heights: [ 60,20,20 ],
        },
       
        header: {
          fontSize: 10,
          bold: true,
        },
        codigo:{
        margin:[5,10,]
        },
        codigoLeft:{
        marginLeft:35
        },
        codigoTop:{
          margin: [30, 30, 30, 30],
          alignment: 'left'
        }
      }
    
    
    }
    pdfMake.createPdf(docDefinition).download('Informe_de_auditoria.pdf');
  }

  //pagination
  pageChanged(event: any): void {
  this.pages = event.page;
  const startItem = (event.page - 1) * event.itemsPerPage
  const endItem = event.page * event.itemsPerPage;
  this.procesoFinal = this.dataInitial.slice(startItem, endItem);
}

//pagination requisito
pagesRequired: number = 1;
pageChangedReq(event: any): void {
  this.pagesRequired = event.page;
 
  const startItem = (event.page - 1) * event.itemsPerPage
  const endItem = event.page * event.itemsPerPage;
  
  this.arrRequisito = this.contentArrayReq.slice(startItem, endItem)

}
getRolValue(): number {
  const rol = localStorage.getItem('rol');
  if (rol && !isNaN(Number(rol))) {
    return Number(rol);
  }
  return 0;
}
}

