import { Component, ViewEncapsulation } from '@angular/core';
import { IDropdownSettings} from 'ng-multiselect-dropdown';
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
 
  listAuditor: any = [];
  equipoAuditor: any =[];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings;
  formParent!: FormGroup;
 
  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder:FormBuilder,
    public ApiService: ApiService,
  ) { }

  ngOnInit(): void {
    
    if(window.location.search.includes('form=show')){
      document.getElementById('formAuditoria').style.display = 'block'
    }else{
      document.getElementById('formAuditoria').style.display = 'none' 
    }
    this.formParent = this.formBuilder.group({
      liderAuthor:[""],
      auditorTeam:[""],
      objAuditoria:[""],
      alcanceAuditoria:[""],
      criterioAuditoria:[""],
      dateInit:[""],
      mytime:[""],
      dateEnd:[""],
      hourEnd:[""],
      planAuditoria:[""],
      planAuditoriaDate:[""],
      processOrActivity:[""],
      normOrRequest:[""],
      auditor:[""],
      nameAuditor:[""],
      observacion:[""],
      fechaActual:[""],
      obsText:[""],
      startTime: [""],
      endTime: [""],
      planTime:[""]
  });
 
  this.getAuditorList();
  }

/* nicio */
onItemSelect(item: any) {
  console.log(item);
}
onSelectAll(items: any) {
  console.log(items);
}
/* Fin */


getAuditorList(){
  this.ApiService.getAuditorListService()
  .subscribe((data:any)=> {
    console.log(data,"databuscada")
    this.listAuditor = data;
    this.equipoAuditor = data;

  this.dropdownList =  [
    {  "item_id": 0, "item_text": "Melissa Gutmont" },
    {  "item_id": 1, "item_text": "Carlancas Venec" },
    {  "item_id": 2, "item_text": "Oscar Sandoval" }
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

getActualDate(){
  let date = new Date();
  let day = date.getDate().toString().padStart(2, '0');
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let year = date.getFullYear();
  let formattedDate = `${day}/${month}/${year}`;
return formattedDate;
}

openComponent(evt:any){
  console.log(evt.target?.id,"el evento")
  this.router.navigate(['/nuevoPlanDeAuditoria'], { queryParams: { item: evt.target?.id } });
}
openComponentLista(evt:any){
  console.log('redirección')
 return this.router.navigate(['/listaDeVerificacion'], { queryParams: { item: evt.target?.id } });
}

openComponentInforme(evt:any){
  this.router.navigate(['/informeAuditoria'], { queryParams: { item: evt.target?.i
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



formantDate(dateArg){
  console.log(dateArg,'date');
  let gmtDate =dateArg;
  let formattedDate = moment.utc(gmtDate);
  let finalDate = formattedDate.tz("America/Lima");
  return moment(finalDate).format('DD/MM/YYYY')
}

formantHour(dateHour){
  console.log(dateHour,'date');
  const timeZone = 'America/Lima'; // configurar la zona horaria aquí
  const formattedHour = moment.utc(dateHour).tz(timeZone);
  const finalHour = moment(formattedHour).format('hh:mm:ss A'); // Agregar el formato de 12 horas
  return finalHour;
}
myTime: string;
startTime: string;
endTime: string;
saveForm(){
  const formatoHora = moment(this.formParent.get("startTime")?.value).format('hh:mm:ss');
  const formatoHoraCierre = moment(this.formParent.get("endTime")?.value).format('hh:mm:ss');
  const idPst = localStorage.getItem('Id')
  const request ={
    
      iD_AUDITORIA: 0,
      fK_ID_PST: Number(idPst),
      codigo: "string",
      auditoR_LIDER: this.formParent.get("liderAuthor")?.value,
      equipO_AUDITOR:this.formParent.get("auditorTeam")?.value.flatMap(e=>e.item_text).toString(),  
      objetivo: this.formParent.get("objAuditoria")?.value,
      alcance: this.formParent.get("alcanceAuditoria")?.value,
      criterio: this.formParent.get("criterioAuditoria")?.value,
      fechA_REUNION_APERTURA:this.formantDate(new Date(this.formParent.get("dateInit")?.value)),
      horA_REUNION_APERTURA: formatoHora,
      fechA_REUNION_CIERRE:this.formantDate(new Date(this.formParent.get("dateEnd")?.value)),
      horA_REUNION_CIERRE: formatoHoraCierre,
      fechA_AUDITORIA:this.getActualDate(),
      observaciones:this.formParent.get("observacion")?.value,
      proceso: "string",
      conformidades: [
 
      ],
      procesos: [
        {
          iD_PROCESO_AUDITORIA: 0,
          fK_ID_AUDITORIA: 0,
          fecha:this.formantDate(new Date(this.formParent.get("planAuditoria")?.value)),
          hora: this.formantDate(new Date(this.formParent.get("planTime")?.value)),
          procesO_DESCRIPCION: this.formParent.get("processOrActivity")?.value ?'proceso':'auditoria',
          lideR_PROCESO: this.formParent.get("nameAuditor")?.value,
          cargO_LIDER: "string",
          normaS_AUDITAR: this.formParent.get("normOrRequest")?.value ?'norma':'requisitos auditar',
          auditor: this.formParent.get("auditor")?.value,
          auditados: this.formParent.get("nameAuditor")?.value,
          documentoS_REFERENCIA: "string",
          estado: true
        }
      ],
      "requisitos": [
      
      ]
    }
  
  this.ApiService.insertAuditoria(request)
  .subscribe((data :any) => 
  console.log(data,"data new"))
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

 return this.generatePlanDeAuditoria(request);
// }

}


generatePlanDeAuditoria(request) {
  console.log(request,'resuqestahora')
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
              { text: 'LOGO DE LA ORGANIZACIÓN',alignment: 'center', rowSpan: 3, style: [ 'codigoTop' ]}, 
              { text: 'NOMBRE DE LA ORGANIZACIÓN',alignment: 'center', style: [ 'codigoTop' ],rowSpan: 3 }, 
              { text: 'PLAN DE AUDITORÍA',alignment: 'center',rowSpan: 3,style: [ 'codigoTop' ]}, 
              { text: 'CÓDIGO',rowSpan: 2 ,alignment: 'center', marginTop:20, marginLeft:-30}
            ],
            ["", "", "", ""],
            ["", "", "", { text: 'VERSIÓN', alignment: 'center',style: [ 'codigoLeft' ]}]
          ]
        },
        fontSize: 10,
      },
      '\n', 
      '\n',  
      {
        table: {

          widths: [150, '*' ,'*','*' ,'*', ],
          body: [
            [
              {text: 'Fecha de elaboración', style: ['tituloDinamico']},
              {text:this.getActualDate(),colSpan:4,},
              '',
              {text:''},
              {text:''},

            ],
            [
              {text: 'Auditor líder', style: ['tituloDinamico']},
              {text:request.auditoR_LIDER,colSpan:4,},
              {text:''},
              {text:''},
              {text:''},
            ],
            [
              {text: 'Equipo auditor', style: ['tituloDinamico']},
              {text:request.equipO_AUDITOR,colSpan:4,},
              {text:''},
              {text:''},
              {text:''},
            ],
            [
              {text: 'Objetivo de la auditoría', style: ['tituloDinamico']},
              {text:request.objetivo,colSpan:4,},
              {text:''},
              {text:''},
              {text:''},
            ],
            [
              {text: 'Alcance de la auditoría', style: ['tituloDinamico']},
              {text:request.alcance,colSpan:4,},
              {text:''},
              {text:''},
              {text:''},
            ],
            [
              {text: 'Criterios de la auditoría', style: ['tituloDinamico']},
              {text:request.criterio,colSpan:4,},
              {text:''},
              {text:''},
              {text:''},
            ],
            [
              {text: 'Reunión de apertura', style: ['tituloDinamico']},
              'Día:',
              {text: request.fechA_REUNION_APERTURA, style: ['tituloDinamico']},
              'Hora:',
              {text: request.horA_REUNION_APERTURA, style: ['tituloDinamico']},
            ],
            [
              {text: 'Reunión de cierre', style: ['tituloDinamico']},
              'Día:',
              {text: request.fechA_REUNION_CIERRE, style: ['tituloDinamico']},
              'Hora:',
              {text: request.horA_REUNION_CIERRE, style: ['tituloDinamico']},
              
            ],
            
          ],
      },
      fontSize: 10,
    },
    '\n',
    '\n', 
      {
        table: {
          widths: [ 'auto', 'auto', '*', '*','auto','*' ],
          body: [
            [
              { text: 'Planificación de la auditoría interna', colSpan: 6,fontSize: 10, alignment: 'center', bold: true},
              {},
              {},
              {},
              {},
              {}
            ],
            [
              { text: 'Fecha',  style: [ 'columna' ]},
              { text: 'Hora', style: [ 'columna' ]},
              { text: 'Proceso/Actividad', style: [ 'columna' ]},
              { text: 'Norma y/o requisitos a auditar', style: [ 'columna' ]},
              { text: 'Auditor', style: [ 'columna' ]},
              { text: 'Nombre y cargo del auditado(s)', style: [ 'columna' ]}
            ],
            [
              {text: request.procesos[0].fecha, style: ['']},
              {text: request.procesos[0].hora, style: ['']},
              {text: request.procesos[0].procesO_DESCRIPCION, style: ['']},
              {text: request.procesos[0].normaS_AUDITAR, style: ['']},
              {text: request.procesos[0].auditor, style: ['']},
              {text: request.procesos[0].auditados, style: ['']},
            ],
          ]
        },
        
      },
      '\n',
      '\n', 
    { 
      table: {
        widths: ['100%'],
        heights: [10,40],
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
                    text:this.formParent.get('observacion').value,
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
      codigoLeft:{
      marginLeft:35
      },
      codigoTop:{
        marginTop:30
      }
    }
  
  
  }
  pdfMake.createPdf(docDefinition).download('Plan_de_auditoria.pdf');
}


}

