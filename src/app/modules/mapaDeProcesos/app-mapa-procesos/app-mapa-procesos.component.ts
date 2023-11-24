import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-mapa-procesos',
  templateUrl: './app-mapa-procesos.component.html',
  styleUrls: ['./app-mapa-procesos.component.css']
})

export class AppMapaProcesosComponent {
  esNuevo:boolean=true;
  constructor(
    private Message: ModalService,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.getListResponsible();
    this.getDataProceso();
  }

  rnt = localStorage.getItem('rnt');
  idUsuarioPst = window.localStorage.getItem('Id');
  disabled: boolean = false; 
  arrayListResponsable: any[] = [];
  arrays : any = {
    procesosMisionales : [],
    procesosEstrategicos : [],
    procesosApoyo : []
  }

  getListResponsible() {
    this.api.getListResponsible().subscribe((data: any) => {
      this.arrayListResponsable = data;
    })
  }
  getDataProceso() {
    this.api.getDataProceso().subscribe((response: any) => {
      if (response.length > 0) {
    
        this.disabled = true; 
        // Misionales
        this.arrays.procesosMisionales = response.filter(item => item.TIPO_PROCESO === "Procesos Misionales");
        // Estrategicos
        this.arrays.procesosEstrategicos = response.filter(item => item.TIPO_PROCESO === "Procesos Estratégicos");
        // Apoyo soporte 
        this.arrays.procesosApoyo = response.filter(item => item.TIPO_PROCESO === "Procesos Soporte");
      
        this.arrays.procesosMisionales.forEach((objeto, index) => {
          objeto.index = index + 1;
        });
        this.arrays.procesosEstrategicos.forEach((objeto, index) => {
          objeto.index = index + 1;
        });
        this.arrays.procesosApoyo.forEach((objeto, index) => {
          objeto.index = index + 1;
        });
      }
      
    })
  }
  agregarAdicional(tipo_proceso: string) {
    this.esNuevo=false;

    let objetoNuevo  =
    {
      "ID_MAPA_PROCESO": 0,
      "FK_ID_USUARIO": Number(window.localStorage.getItem('Id')),
      "RNT": localStorage.getItem('rnt'),
      "DESCRIPCION_PROCESO": "",
      "FK_ID_RESPONSABLE": "",
      "TIPO_PROCESO": "",
      "index":0
    }
  
    let newIndex =0;
    if (tipo_proceso === 'misionales') {
      newIndex= this.arrays.procesosMisionales.length==0 ? 1: 
                this.arrays.procesosMisionales.reduce((max, objeto) => (objeto.index > max ? objeto.index : max), 0)+1;
      objetoNuevo.index=newIndex;
      objetoNuevo.TIPO_PROCESO="Procesos Misionales";
      this.arrays.procesosMisionales.push(objetoNuevo);
    }
    else if (tipo_proceso === 'estrategicos') {
      newIndex= this.arrays.procesosEstrategicos.length==0 ? 1: 
                this.arrays.procesosEstrategicos.reduce((max, objeto) => (objeto.index > max ? objeto.index : max), 0)+1;
      objetoNuevo.index=newIndex;
      objetoNuevo.TIPO_PROCESO="Procesos Estratégicos";
      this.arrays.procesosEstrategicos.push(objetoNuevo);
    }
    else if (tipo_proceso === 'soporte') {
      newIndex= this.arrays.procesosApoyo.length==0 ? 1:
                this.arrays.procesosApoyo.reduce((max, objeto) => (objeto.index > max ? objeto.index : max), 0)+1;

      objetoNuevo.index=newIndex;
      objetoNuevo.TIPO_PROCESO="Procesos Soporte";
      this.arrays.procesosApoyo.push(objetoNuevo);
    }
  }

  deleteServicios(tipo_proceso : string,id_mapa_proceso : number,indice: number) {
    this.esNuevo=false;
    if(id_mapa_proceso==0){
      switch (tipo_proceso) {
        case 'Procesos Misionales':
          this.arrays.procesosMisionales = this.arrays.procesosMisionales.filter((item:any) => item.index !== indice);
          break;
        case 'Procesos Estratégicos':
          this.arrays.procesosEstrategicos = this.arrays.procesosEstrategicos.filter((item:any) => item.index !== indice);
          break;
        case 'Procesos Soporte':
          this.arrays.procesosApoyo = this.arrays.procesosApoyo.filter((item:any) => item.index !== indice);
          break;
        default:
      }
      this.esNuevo=true;
    }
    else{
      this.api.deleteProceso(id_mapa_proceso).subscribe((data: any) => {

        this.getDataProceso();
        this.esNuevo=true;
      })
    }
    
  }
  saveForm() {
    this.esNuevo=false;
    const arrayUnido = [...this.arrays.procesosMisionales, 
                        ...this.arrays.procesosEstrategicos, 
                        ...this.arrays.procesosApoyo];

      if(!this.validararray()){
        const title = "Alerta"
      const message = "Verifique el orden de los procesos";
      this.Message.showModal(title, message);
        return;
      }
    
    this.api.postMapaProceso(arrayUnido).subscribe((data: any) => {
      const title = "Operación Exitosa.";
        const message = data.Message;
        this.Message.showModal(title, message);
      this.getDataProceso();
      this.esNuevo=true;
    })
  }

  botonCancelar: boolean = false;
  botonOcultar: boolean = true;
  cancelarEdit() {
    this.esNuevo=true;
    //this.botonEditar = false;
    this.botonCancelar = false;
    this.botonOcultar = true;
    // this.disablePDF = false;
    // this.botonDelete = true;
    this.getDataProceso();
  }

  activarCampos() {
    this.disabled = false
    this.botonCancelar = true;
    this.botonOcultar = false;
    // this.disablePDF = true;
    // this.botonDelete = true;
  }
  validararray():boolean{
 var validado=true;
    this.arrays.procesosMisionales.forEach(element => {
      if(element.ORDEN=="" ){
        
      validado= false;
     
      }
     
    });
    this.arrays.procesosEstrategicos.forEach(element => {
      if(element.ORDEN=="" ){
       
      validado= false;
      
      }
    });
    this.arrays.procesosApoyo.forEach(element => {
      if(element.ORDEN=="" ){
       
      validado= false;
      
      }
    });
    return validado;
  }
  cambioSelect(event:any,i){
    
    
    if(event.TIPO_PROCESO=="Procesos Misionales"){
      this.arrays.procesosMisionales.forEach(element => {
        if(element.ORDEN==event.ORDEN && (i+1)!=element.index ){
          this.arrays.procesosMisionales[i].ORDEN="";
          event.ORDEN="";
          
          const title = "Alerta"
        const message = "Ya existe orden registrado para el proceso "+element.DESCRIPCION_PROCESO;
        this.Message.showModal(title, message);
        return;
        }
       
      });
      return;
    }
    
    if(event.TIPO_PROCESO=="Procesos Estratégicos"){
      this.arrays.procesosEstrategicos.forEach(element => {
        if(element.ORDEN==event.ORDEN && (i+1)!=element.index){
          this.arrays.procesosEstrategicos[i].ORDEN="";
          event.ORDEN="";
         
          const title = "Alerta"
        const message = "Ya existe orden registrado para el proceso "+element.DESCRIPCION_PROCESO;
        this.Message.showModal(title, message);
        return;
        }
      });
      return;
    }
    if(event.TIPO_PROCESO=="Procesos Soporte" ){
      this.arrays.procesosApoyo.forEach(element => {
        if(element.ORDEN==event.ORDEN && (i+1)!=element.index){
          this.arrays.procesosApoyo[i].ORDEN="";
          event.ORDEN="";
          
          const title = "Alerta"
        const message = "Ya existe orden registrado para el proceso "+element.DESCRIPCION_PROCESO;
        this.Message.showModal(title, message);
        return;
        }
      });
      return;
    }
    
  }
}
