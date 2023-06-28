import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-auditoria-planificacion',
  templateUrl: './app-auditoria-planificacion.component.html',
  styleUrls: ['./app-auditoria-planificacion.component.css']
})
export class AppAuditoriaPlanificacionComponent {
  modalRef: BsModalRef;
  activeTab: string = 'proceso';
  valueFormParent: any = [];
  formParent!: FormGroup;
  @Output() valorEnviadoModal = new EventEmitter<object>();


  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public ApiService: ApiService,
  ) { }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

   cancelEvent(event:any){
    event.preventDefault();
  }


  ngOnInit(): void {
    this.formParent = this.formBuilder.group({
      fecha: ["", Validators.required],
      auditor: ["", Validators.required],
      auditados: ["", Validators.required],
      observacion: [""],
      hora: ["", Validators.required],
      //tabs 1
      proceso: ["", Validators.required],
      actividad: ["", Validators.required],
      //tabs 2
      norma: ["", Validators.required],
      requisito: ["", Validators.required],
    });
    this.fnListResponsible();
  }
  listAuditor: any = [];
  equipoAuditor: any = [];
  arrayListResponsible: any = [];
  
  fnListResponsible() {
    this.ApiService.getListResponsible().subscribe((data) => {
      this.arrayListResponsible = data;
      console.log(this.arrayListResponsible,"este es el responsable")
      console.log(this.listAuditor,"lider")
      this.listAuditor = this.arrayListResponsible.filter((e: any) =>
        e.CARGO === "Líder de Proceso"
      )

    })
  }
  tipoProceso: string ='';
  tipoNorma: string = '';
  tabOption(value: string) {
    if (value === 'proceso') {
      this.formParent.get('proceso').enable();
      this.formParent.get('actividad').disable();
      this.tipoProceso = 'Proceso';
    } else if (value === 'actividad') {
      this.formParent.get('actividad').enable();
      this.formParent.get('proceso').disable();
      this.tipoProceso = 'Actividad';
    } else if (value === 'norma') {
      this.formParent.get('norma').enable();
      this.formParent.get('requisito').disable();
      this.tipoNorma='Norma';
    } else if (value === 'requisito') {
      this.formParent.get('requisito').enable();
      this.formParent.get('norma').disable();
      this.tipoNorma='requisito';
    }
  }
  auditeeCharge:any = ''; 
 
  saveForm() {
  
    this.valueFormParent.push(this.formParent.value)
   
      for (let i = 0; i < this.valueFormParent.length; i++) {
      if(this.valueFormParent[i].proceso!='' && this.valueFormParent[i].proceso != undefined ){
          this.valueFormParent[i].TIPO_PROCESO = this.tipoProceso;
            this.valueFormParent[i].PROCESO_DESCRIPCION =this.valueFormParent[i].proceso;
        }
        else{
          this.valueFormParent[i].PROCESO_DESCRIPCION = this.valueFormParent[i].actividad;
        }
        if(this.valueFormParent[i].norma!='' && this.valueFormParent[i].norma != undefined ){
          this.valueFormParent[i].TIPO_NORMA = this.tipoNorma;
          this.valueFormParent[i].NORMAS_DESCRIPCION = this.valueFormParent[i].norma;
         
        } else{
          this.valueFormParent[i].NORMAS_DESCRIPCION = this.valueFormParent[i].requisito;
        }
        if(this.valueFormParent[i].observacion){
          this.valueFormParent[i].OBSERVACION_PROCESO = this.valueFormParent[i].observacion;
        } else {
           this.valueFormParent[i].OBSERVACION_PROCESO = ''
        }
       
      }
 
    //para enviar valor al padre 
    this.valorEnviadoModal.emit(this.valueFormParent);
    //para cerrar el modal 
    const openModalButton = document.getElementById("closeModal");
    openModalButton.click();
    this.formParent.reset();
  }
  
}
