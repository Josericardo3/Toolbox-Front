import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
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
  normas: any[] = [];
  formParent!: FormGroup;
  dropdownSettings: IDropdownSettings;
  dropdownList = [];
  selectedItems = [];

  @Output() valorEnviadoModal = new EventEmitter<object>();


  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public ApiService: ApiService,
    private Message: ModalService,
  ) { }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

   cancelEvent(event:any){
    event.preventDefault();
  }

    /* nicio */
    onItemSelect(item: any) {
      // console.log(item);
    }
    onSelectAll(items: any) {
      // console.log(items);
    }

  ngOnInit(): void {
    this.formParent = this.formBuilder.group({
      fecha: ["", Validators.required],
      auditor: ["", Validators.required],
      auditados: ["", Validators.required],
      observacion: [""],
      requisito: ["", Validators.required],
      hora: ["", Validators.required],
      //tabs 1
      proceso: ["", Validators.required],
      actividad: ["", Validators.required],
      //tabs 2
      norma: ["", Validators.required],
    });
    this.fnListResponsible();
    this.getNormas(); 
  }
  listAuditor: any = [];
  equipoAuditor: any = [];
  arrayListResponsible: any = [];
  
  fnListResponsible() {
    this.ApiService.getListResponsible().subscribe((data) => {
      this.arrayListResponsible = data;
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
      this.onNormaSelect();
      this.tipoNorma='requisito';
    }
  }
  auditeeCharge:any = ''; 
 
  onNormaSelect() {
    let constante = this.formParent.get('norma').value;
    let normaNombre = constante.NORMA
    localStorage.setItem("NormaRequisito", normaNombre);
    const idNorma = constante ? constante.ID_NORMA : null;
    this.getRequerimientosNormas(idNorma);
  }
  
  saveForm() {
    this.valueFormParent = this.formParent.value
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

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }

  public ocultarGrabar(): boolean {
    const rolValue = this.getRolValue();
    return rolValue === 4 || rolValue === 5;
  }

  getNormas() {
    this.ApiService.getNormaList().subscribe((data: any) => {
      this.normas = data;
    });
  }

  getRequerimientosNormas(id: any) {
    this.ApiService.getRequerimientosNormas(id).subscribe((data: any) => {
      this.dropdownList = data.map((requisito: any) => requisito.TITULO);
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  
  
  onDateChange(event: any) {
    const dateInitValue = this.formParent.get('fecha').value;    
    if (dateInitValue) {
      const inicioValue = new Date(dateInitValue);
      const now = new Date();  
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
       if(inicioValue< today){
        const title = "Registro no exitoso";
        const message = "Por favor la fecha no puede ser menor a la fecha actual";
        this.Message.showModal(title, message);
        this.formParent.get('fecha').setValue('');
        return;
      }
    }
  }
  
  
  
  

  
  
}
