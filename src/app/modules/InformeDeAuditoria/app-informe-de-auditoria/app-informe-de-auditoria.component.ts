import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ApiService } from '../../../servicios/api/api.service';

@Component({
  selector: 'app-app-informe-de-auditoria',
  templateUrl: './app-informe-de-auditoria.component.html',
  styleUrls: ['./app-informe-de-auditoria.component.css']
})
export class AppInformeDeAuditoriaComponent {
  //valorSeleccionado: string;
  noConformidades: string;
  observaciones: string;
  oportunidades: string;
  fortalezas: string;
  conformidades:string;
  totalConformidades: any = [];
  requisitos: any = [];
  formParent!: FormGroup;
  selectedProceso:any ={};
  procesoFinal:any= [];
  idProceso:any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder:FormBuilder,
    public ApiService: ApiService,
  ) { 
    this.formParent = this.formBuilder.group({
      conclusiones:["",Validators.required],
      totalConformidades:[""],
      formRequisitos: this.formBuilder.array([
      ])
    })
   }
  
  
  capturarValor(event) {
    if(event.target.name === "no_conformidades"){
      this.noConformidades=event.target.value;
    }
    if(event.target.name === "observaciones"){
      this.observaciones=event.target.value;
    }
    if(event.target.name === "oportunidades"){
      this.oportunidades=event.target.value;
    }
    if(event.target.name === "fortalezas"){
      this.fortalezas=event.target.value;
    }
    if(event.target.name === "conformidades"){
      this.conformidades=event.target.value;
    }
 
    this.totalConformidades = [ this.noConformidades,
      this.observaciones,
      this.oportunidades,
      this.fortalezas,
      this.conformidades]

    this.totalConformidades = [ this.noConformidades,
      this.observaciones,
      this.oportunidades,
      this.fortalezas,
      this.conformidades]

    // console.log(event.target.value,"evento")
    // console.log(this.noConformidades,"evento")
    // console.log(this.oportunidades,"evento")
    // console.log(this.fortalezas,"evento")
    // console.log(this.conformidades,"evento")
    // console.log(this.observaciones,"evento")
    // console.log(this.noConformidades,"evento")
    // console.log(this.oportunidades,"evento")
    // console.log(this.fortalezas,"evento")
    // console.log(this.conformidades,"evento")
    // console.log(this.observaciones,"evento")
  }

  ngOnInit(): void {
   this.dataDinamica()
   //this.seleccionarAuditoria()
   
  }

  

  
  openComponent(evt:any){
    console.log(evt.target?.id,"el evento")
    this.router.navigate(['/nuevoPlanDeAuditoria'], { queryParams: { item: evt.target?.id } });
  }

  openComponentLista(evt:any){
    this.router.navigate(['/listaDeVerificacion'], { queryParams: { item: evt.target?.i
     } 
    }
    );
  }
  openComponentInforme(evt:any){
    this.router.navigate(['/informeAuditoria'], { queryParams: { item: evt.target?.i
     } 
    }
    );
  }


arrRequisito:any = []; 
selectAudit(audit){
  //debugger;
  //const idPst = localStorage.getItem('Id')
    //this.http.get("assets/informeFinal.json")
    this.ApiService.getAuditorias(audit.iD_AUDITORIA)
    .subscribe((data:any)=> {
      console.log(data,"ahora")
      const filterAudit = data
      //console.log(filterAudit,"filter")
      //filterAudit[0].requisitos;
      this.requisitos = data;
      //console.log(this.requisitos,"requisito")
      this.selectedProceso = filterAudit[0]; 
      //pinta los datos dinamicos fel formulario
      this.selectedProceso = data; 
      const tableAudit =  document.querySelector('#table_proceso') as HTMLInputElement;
      const tableListaDeVerificacion =  document.querySelector('#formAuditoria') as HTMLInputElement;
      tableAudit.style.display = "none";
      tableListaDeVerificacion.style.display="block";
      
      for (let i = 0; i < this.requisitos.procesos.length; i++) {
        let requ = this.requisitos.procesos[i].requisitos;
      for (let j = 0; j < requ.length; j++) {
          let requerido = this.requisitos.procesos[j].requisitos;
          this.arrRequisito = requerido;
      
          //capturando  id requisito
          for (let m = 0; m < requerido.length; m++) {
            let fkIdRequerido = requerido[m].fK_ID_PROCESO;
           
         console.log(fkIdRequerido,"id requerido")
          }

         

      
        }
       }

    // console.log(this.selectedProceso,"select actual")
    // console.log(this.requisitos,"datar")
    // console.log(this.arrRequisito,"podria ser")

      //return this.procesoFinal;
    })
  }

  dataDinamica(){
    //this.http.get("assets/informeFinal.json")
    const idPst = localStorage.getItem('Id')
    this.ApiService.getListarAuditorias(Number(idPst))
    .subscribe((data:any)=> {
      console.log(data,"ahora")
      this.procesoFinal= data;

    console.log(this.procesoFinal,"data")

    })
  
  }

  saveForm(){
    console.log(this.formParent.get("conclusiones")?.value,"aqui")
    console.log(this.noConformidades,'CONFIRMO');
    console.log(this.selectedProceso,"requisitos ahora")
    console.log(this.selectedProceso,"requisitos ahora")
  if (this.formParent) {
  const request ={
     proceso : this.selectedProceso.proceso, 
     auditorLider : this.selectedProceso.auditoR_LIDER,
     equipo : this.selectedProceso.equipO_AUDITOR,
     fecha : this.selectedProceso.fechA_AUDITORIA,
     objetivo : this.selectedProceso.objetivo,
     alcance :  this.selectedProceso.alcance,
     criterio : this.selectedProceso.criterio,
     reunionCierre : this.selectedProceso.fechA_REUNION_CIERRE,
     fK_ID_PROCESO: this.idProceso,
     conclusiones : this.formParent.get("conclusiones")?.value,
     conformidades: this.totalConformidades


  }
  console.log(request);
  const conf = this.totalConformidades.map((e,index)=>{
    return {
      "iD_CONFORMIDAD_AUDITORIA": 0,
      "fK_ID_PROCESO": 0,
      "descripcion": "string",
      "ntc": e==='Si',
      "legales": e==='Si',
      "estado": true
    }
  })
  const serviceRequet = {
    "iD_PROCESO_AUDITORIA": this.idProceso,
    "fK_ID_AUDITORIA": this.idProceso,
    "fecha": this.selectedProceso.fechA_AUDITORIA,
    "hora": "string",
    "procesO_DESCRIPCION": "string",
    "lideR_PROCESO": "string",
    "cargO_LIDER": "string",
    "normaS_AUDITAR": "string",
    "auditor": "string",
    "auditados": "string",
    "documentoS_REFERENCIA": "string",
    "conclusioN_CONFORMIDAD": "string",
    "estado": true,
    "requisitos": this.arrRequisito,
    "conformidades":conf
  }


   this.ApiService.updateAuditoria(serviceRequet).subscribe((data:any) =>{
     console.log(request,"requestFinal")
  const conf = this.totalConformidades.map((e,index)=>{
    return {
      "iD_CONFORMIDAD_AUDITORIA": 0,
      "fK_ID_PROCESO": 0,
      "descripcion": "string",
      "ntc": e==='Si',
      "legales": e==='Si',
      "estado": true
    }
  })
  const serviceRequet = {
    "iD_PROCESO_AUDITORIA": this.idProceso,
    "fK_ID_AUDITORIA": this.idProceso,
    "fecha": this.selectedProceso.fechA_AUDITORIA,
    "hora": "string",
    "procesO_DESCRIPCION": "string",
    "lideR_PROCESO": "string",
    "cargO_LIDER": "string",
    "normaS_AUDITAR": "string",
    "auditor": "string",
    "auditados": "string",
    "documentoS_REFERENCIA": "string",
    "conclusioN_CONFORMIDAD": "string",
    "estado": true,
    "requisitos": this.arrRequisito,
    "conformidades":conf
  }


   this.ApiService.updateAuditoria(serviceRequet).subscribe((data:any) =>{
     console.log(request,"requestFinal")
    })
  return this.generateInformeDeAuditoria(request);
   })}}

  

  generateInformeDeAuditoria(request) {
    console.log(request,'resuqest',this.arrRequisito,"requisito querido")
    const newFormantRequisito = this.arrRequisito.map(req =>  {
      console.log(req,"req")
     return{
      observacion:req.observacion,
      hallazgo: req.hallazgo,
      requisito:req.requisito
     }
    })
    console.log(request,'resuqest',this.arrRequisito,"requisito querido")
   
    const docDefinition:any = {
      // pageSize: {
      //   width: 794,
      //   height: 1123
      // },
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
                { text: 'LOGO DE LA ORGANIZACIÓN',alignment: 'center', rowSpan: 3, style: [ 'codigoTop' ]}, 
                { text: 'NOMBRE DE LA ORGANIZACIÓN',alignment: 'center', style: [ 'codigoTop' ],rowSpan: 3 }, 
                { text: 'INFORME DE AUDITORIA',alignment: 'center',rowSpan: 3,style: [ 'codigoTop' ]}, 
                { text: 'CÓDIGO',rowSpan: 2 ,alignment: 'center', marginTop:20, marginLeft:-30}
            ],
            ["", "", "", ""],
            ["", "", "", { text: 'VERSIÓN',alignment: 'center', style: [ 'codigoLeft' ]}]
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
                {text:request.proceso,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Auditor Líder ', style: ['tituloDinamico']},
                {text: request.auditorLider,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Equipo Auditor', style: ['tituloDinamico']},
                {text:request.equipo ,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Fecha de informe de auditoría ', style: ['tituloDinamico']},
                {text:request.fecha,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Objetivos de la auditoría ', style: ['tituloDinamico']},
                {text:request.objetivo,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Alcance de la auditoria ', style: ['tituloDinamico']},
                {text:request.alcance,colSpan:4,},
                {text:''},
                {text:''},
                {text:''},
              ],
              [
                {text: 'Criterios de la auditoría ', style: ['tituloDinamico']},
                {text:request.criterio,colSpan:4,},
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

          widths: [400, '*' ,'auto','*' ,'auto', ],
          body: [
            [
              { text: 'Conformidad del sistema de gestión de sostenibilidad ', colSpan: 5, alignment: 'center', bold: true},
              {},
              {},
              {},
              {},
              

            ],
            [
              {text: 'Descripción ',alignment: 'center', bold: true, style: ['tituloDinamico']},
              {text:'NTC',colSpan:2,alignment: 'center', bold: true,},
              {text:''},
              {text:'Legales',colSpan:2,alignment: 'center', bold: true,},
              {text:''},
            ],
            [
              {text: 'Total de NO CONFORMIDADES detectadas en esta auditoría ', style: ['tituloDinamico']},
              {text:request.conformidades[0]!= 'Si'? request.conformidades[0]:'No',colSpan:2,},
              {text:''},
              {text:request.conformidades[0]=== 'Si'? request.conformidades[0]:'No',colSpan:2,},
              {text:''},
            ],
            [
              {text: 'Total de OBSERVACIONES detectadas en esta auditoría ', style: ['tituloDinamico']},
              {text:request.conformidades[1]!= 'Si'? request.conformidades[0]:'No',colSpan:2,},
              {text:''},
              {text:request.conformidades[1]=== 'Si'? request.conformidades[0]:'No',colSpan:2,},
              {text:''},
            ],
            [
              {text: 'Total de OPORTUNIDADES DE MEJORA detectadas en esta auditoría ', style: ['tituloDinamico']},
              {text:request.conformidades[2]!= 'Si'? request.conformidades[0]:'No',colSpan:2,},
              {text:''},
              {text:request.conformidades[2]!= 'Si'? request.conformidades[0]:'No',colSpan:2,},
              {text:''},
            ],
            [
              {text: 'Total de FORTALEZAS detectadas en esta auditoría ', style: ['tituloDinamico']},
              {text:request.conformidades[3]!= 'Si'? request.conformidades[0]:'No',colSpan:2,},
              {text:''},
              {text:request.conformidades[3]!= 'Si'? request.conformidades[0]:'No',colSpan:2,},
              {text:''},
            ],
            [
              {text: 'Total de CONFORMIDADES detectadas en esta auditoría ', style: ['tituloDinamico']},
              {text:request.conformidades[4]!= 'Si'? request.conformidades[0]:'No',colSpan:2,},
              {text:''},
              {text:request.conformidades[4]!= 'Si'? request.conformidades[0]:'No',colSpan:2,},
              {text:''},
              
            ],
            
          ],
      },
      fontSize: 10,
    },
        '\n',
        {
          table: {
  
            widths: ['*', '*' ,'auto','*' ,'auto', ],
            body: [
              [
                { text: 'PROCESO / ACTIVIDAD ', colSpan: 5, bold: true},
                {},
                {},
                {},
                {},
                
  
              ],
      ]},
      fontSize: 10,
    },
    '\n',
    {
      table: {
        widths: ['*', '*' ,'*'],
        body: [
          [
          
            {text: 'Requisito', alignment: 'center', bold: true},
            {text: 'Hallazgo', alignment: 'center', bold: true},
            {text: 'Observaciones', alignment: 'center', bold: true},
            
          ],
             ...newFormantRequisito.map(requisitos=> [      
            { text: requisitos.requisito, style: [ 'columna' ]},
            { text: requisitos.hallazgo, style: [ 'columna' ]},
            { text: requisitos.observacion, style: [ 'columna' ]},
            
          ]
          ),
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
                      text:request.conclusiones,
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
          // margin: [10, 10, 10, 10,10,10],
          // margin: [10, 10, 10, 10,10,10],
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
          marginTop:30
        }
      }
    
    
    }
    pdfMake.createPdf(docDefinition).download('Informe_de_auditoria.pdf');
  }
  

}

