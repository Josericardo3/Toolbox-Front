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
import { IDropdownSettings} from 'ng-multiselect-dropdown';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-lista-de-verificacion',
  templateUrl: './app-lista-de-verificacion.component.html',
  styleUrls: ['./app-lista-de-verificacion.component.css']
})


export class AppListaDeVerificacionComponent {

  formParent!: FormGroup;
  listaAuditoria:any[];
  selectedAuditoria:any={};
  idProceso:any;
  idRequisito:any;
  preguntasArr: any;
  normaSelected:any;
  valorIngresado:string;
  requisitos:any[];
  dropdownList = [];
  selectedItems = [];



  dropdownSettings:IDropdownSettings;
  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder:FormBuilder,
    public ApiService: ApiService,
    
    // private formBuilder:FormBuilder,
  ) {
    this.formParent = this.formBuilder.group({
      documentos:["",Validators.required],
      team:["",Validators.required],
      personasAuditadas:["",Validators.required],
      formRequisitos: this.formBuilder.array([
      ])
    })

   }

  idAuditoria: any;
  ngOnInit(): void {
    this.searchLeader();
    this.consultarAuditoria();
    if(window.location.search.includes('form=show')){
      document.getElementById('formListaDeVerficacion').style.display = 'block'
    }
    
  }

  consultarAuditoria(){
    const idPst = localStorage.getItem('Id')
    this.ApiService.getListarAuditorias(Number(idPst))
    .subscribe((data:any)=> {
      console.log(data,"data")
      this.listaAuditoria = data;
      for (let i = 0; i < this.listaAuditoria.length; i++) {
        this.idAuditoria =  this.listaAuditoria[i].iD_AUDITORIA;
        console.log(this.idAuditoria,"este es el id ")
        }
      this.normaSelected = localStorage.getItem('normaSelected');
      return this.listaAuditoria;
    })
  
  }

  openComponentLista(evt:any){
    this.router.navigate(['/listaDeVerificacion'], { queryParams: { item: evt.target?.i
     } 
    }
    );
  }

  openComponent(evt:any){
    console.log(evt.target?.id,"el evento")
    this.router.navigate(['/nuevoPlanDeAuditoria'], { queryParams: { item: evt.target?.id } });
  }
 
  openComponentInforme(evt:any){
    this.router.navigate(['/informeAuditoria'], { queryParams: { item: evt.target?.i
     } 
    }
    );
  }

  
  leaders:any=[];
  selectedLeader: '' | any;
  selectedLeaderCargo: string = '';
searchLeader(){
  // this.http.get('assets/cargo.json')
  this.ApiService.getAuditorListService()
  .subscribe((data:any)=> { 
    console.log(data,"lista")
    this.leaders =data;
    console.log(this.leaders,"this.leaders")
    return this.leaders;
  }
  )
}
 //funcion para guardar el cargo y el nombre del lider
selectLeader(leader:any){
  //console.log(leader,"LIDER AQUI")
  // //valor del cargo
  this.selectedLeader = leader.target.value;
  //const cargo= document.querySelector('#cargo')
  //cargo.innerHTML=this.selectedLeaderCargo;
  //console.log(this.leaders,"leaders")
  const filterLider = this.leaders.filter(e=>e?.nombre ===  leader.target.value);
  //valor del leader
  //this.selectedLeader = filterLider[0].cargo;
  this.selectedLeaderCargo = filterLider[0].cargo;
  console.log(this.selectedLeaderCargo,"cargo este es")
  console.log(filterLider[0] ,this.selectedLeader,"data querida")

}

getHallazgo(evt:any){
  console.log(evt.target.value,'jsadkjasd')
}


  getActualDate(){
    let date = new Date();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    let formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
  }

  saveFormVerificacion(){
    if (this.formParent) {
     // const norma = localStorage.getItem('norma')
      const objeto = [{"id":1,"idCategoriarnt":1,"norma":"NTC 6507 Guías de turismo. Prestación del servicio de guionaje turístico."}];
      const normaS_AUDITAR = objeto[0].norma.split(" ")[1];
      //const idPst = localStorage.getItem('Id')
      //console.log(this,"this")
      const request = {
        // fK_ID_PST:idPst,
        // codigo: this.selectedAuditoria.codigo,
        // auditoR_LIDER : this.selectedAuditoria.auditoR_LIDER,
        // equipO_AUDITOR:'',
        // objetivo:this.selectedAuditoria.objetivo,
        // alcance:this.selectedAuditoria.alcance,
        // criterio:this.selectedAuditoria.criterio,
        // fecha:'',
        // hora:'',
        // observaciones:'',
        // proceso:this.selectedAuditoria.proceso,
        // nombreLiderAuditar:this.selectedLeader, 

        //propiedades dinamicas
        fechA_AUDITORIA:this.selectedAuditoria?.fechA_AUDITORIA,
        auditoR_LIDER:this.selectedAuditoria?.auditoR_LIDER,
        objetivo:this.selectedAuditoria.objetivo,
        alcance:this.selectedAuditoria.alcance,
        proceso:this.selectedAuditoria.proceso,
        criterio:this.selectedAuditoria.criterio,
        //fini
        //propiedades capturadas
        iD_PROCESO_AUDITORIA: this.idProceso,
        auditor:this.formParent.get('team').value,
        lideR_PROCESO:this.formParent.get('personasAuditadas').value,
        documentoS_REFERENCIA:this.formParent.get('documentos').value,
        normaS_AUDITAR,
        cargO_LIDER:this.selectedLeaderCargo,
        requisitos: this.formParent.get('formRequisitos').value,
      
      }
     
      console.log(this.formParent.get('formRequisitos').value,"requisitos");
      //console.log(request,'form parent',this.selectedLeader);
      this.ApiService.updateAuditoria(request).subscribe((data:any) =>{
      console.log(request,"requestFinal")
      })
      return this.generateListaDeAuditoria(request);
    // } else {
    //   console.log("formListaAuditoria is undefined or null");
    }
   
  }
  


generateListaDeAuditoria(request) {
  //console.log(request,'request')
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
                { text: 'LISTA DE VERIFICACIÓN',alignment: 'center',rowSpan: 3,style: [ 'codigoTop' ]}, 
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

          widths: ['*', '*' ,'*','*' , ],
          body: [
            [
              {text: 'Fecha de auditoría', style: ['tituloDinamico']},
              {text:request.fechA_AUDITORIA,colSpan:1,},
              {text:'Norma(s) a auditar'},
              {text:request.normaS_AUDITAR},

            ],
            [
              {text: 'Nombre auditor', style: ['tituloDinamico']},
              {text:this.selectedAuditoria.auditoR_LIDER,colSpan:1,},
              {text:'Proceso(s) / Actividad / Requisito a auditar '},
              {text:this.selectedAuditoria.proceso},
            
            ],
            [
              {text: 'Nombre líder(es) de proceso(s) a auditar ', style: ['tituloDinamico']},
              {text:request.auditoR_LIDER,colSpan:1,},
              {text:'Cargo(s)'},
              {text:request.cargO_LIDER},
           
            ],
            [
              {text: 'Nombre(s) de otra(s) persona(s) auditada(s) ', style: ['tituloDinamico']},
              {text:request.lideR_PROCESO,colSpan:3,},
              {text:''},
              {text:''},
             
            ],
            [
              {text: 'Objetivos de auditoría ', style: ['tituloDinamico']},
              {text:this.selectedAuditoria.alcance,colSpan:3,},
              {text:''},
              {text:''},
             
            ],
            [
              {text: 'Alcance de auditoría', style: ['tituloDinamico']},
              {text:this.selectedAuditoria.criterio,colSpan:3,},
              {text:''},
              {text:''},
           
            ],
            [
              {text: 'Documentos de referencia ', style: ['tituloDinamico']},
              {text:request.documentoS_REFERENCIA},
              {text: 'Criterios de auditoría' , style: ['tituloDinamico']},
              {text:request.criterio},
              
            ],
            
            
          ],
      },
      fontSize: 10,
    },
   
    '\nNC=No conformidad 	OBS = Observación  	OM = Oportunidad de mejora	F = Fortaleza C = Conforme ',
    '\n',
     {
        table: {
          headerRows: 1,
          widths: [ 'auto', 'auto', '*', '*','auto' ],
          body:[
            [
              { text: 'Requisito',  style: [ 'columna' ]},
              { text: 'Pregunta(s)', style: [ 'columna' ]},
              { text: 'Posible evidencia', style: [ 'columna' ]},
              { text: 'Hallazgo(s)',rowSpan:1, style: [ 'columna' ]},
              { text: 'Observaciones o comentarios o notas de auditor ', style: [ 'columna' ]},
            ],
            ...request.requisitos.map(requisito => [      
              { text: requisito.requisito, style: [ 'columna' ]},
              { text: requisito.formPreguntas.flatMap(e=>e.pregunta).toString(), style: [ 'columna' ]},
              { text: requisito.evidencia, style: [ 'columna' ]},
              { text: requisito.hallazgo, style: [ 'columna' ]},
              { text: requisito.observacion, style: [ 'columna' ]}
            ])
          ]
        },
        
      },

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
      marginRigth:-20,
      marginTop:20,
      alignment: 'center',
      },
      codigoLeft:{
      marginLeft:35
      },
      codigoTop:{
        marginTop:30
      }
    }
  }
 return pdfMake.createPdf(docDefinition).download('Lista _verificacion_de_auditoria.pdf');
}

addRequest(evt: any) {
  evt.preventDefault();
  const requisitoFormGroup = this.formBuilder.group({
    iD_REQUISITO:0,
    // iD_PROCESO_AUDITORIA:this.idProceso,
    fK_ID_PROCESO:this.idProceso,
    // iD_AUDITORIA:this.selectedAuditoria.iD_AUDITORIA,
    requisito: ['', Validators.required],
    evidencia: ['', Validators.required],
    formPreguntas: this.formBuilder.array([]),
    hallazgo: ['', Validators.required],
    observacion: ['', Validators.required],
   
    
  });
  
 
  (this.formParent.get('formRequisitos') as FormArray).push(requisitoFormGroup);
  return this.requisitos = this.formParent.get('formRequisitos').value;

}

seleccionarAuditoria(audit){
  // console.log(this.formParent.get('formRequisitos').value,"este es el segundo")
  // console.log(this.formParent.invalid,"invalido");
  // console.log(audit,"ahoraMismo5")
  this.ApiService.getAuditorias(audit.iD_AUDITORIA)
  .subscribe((data:any)=> {
    //console.log(data,"ahoraMismo")

  const tableAudit =  document.querySelector('#table_audit') as HTMLInputElement;
  const tableListaDeVerificacion =  document.querySelector('#formListaDeVerficacion') as HTMLInputElement;
  tableAudit.style.display = "none";
  tableListaDeVerificacion.style.display="block";
  //console.log(audit,"nueva estructura")
  
   this.selectedAuditoria = data;
   //console.log(this.selectedAuditoria,"error")
   //console.log(audit.procesos,"ahoraMismo2")
 //obteniendo id proceso
  for (let i = 0; i < this.selectedAuditoria.procesos.length; i++) {
    this.idProceso = this.selectedAuditoria.procesos[i].iD_PROCESO_AUDITORIA;
    //console.log(this.idProceso,"procesoId")
  }

})

}

requisitoIndex:any;
agregarPregunta(evt:any,requisitoIndex: number,requisito:any) {
  evt.preventDefault();
  const requisitoFormGroup = this.formParent.get('formRequisitos').get(`${requisitoIndex}`) as FormGroup;
  const preguntasArr = requisitoFormGroup.get('formPreguntas') as FormArray;
  preguntasArr.push(this.formBuilder.group({
    pregunta: ['', Validators.required],
  }));
  this.requisitoIndex = requisitoIndex;
  this.preguntasArr = requisitoFormGroup.get('formPreguntas').value as FormArray;
  return this.preguntasArr;
}
}


