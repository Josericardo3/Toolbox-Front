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
  valueFormParent: any = {};
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

  ngOnInit(): void {
    this.formParent = this.formBuilder.group({
      planAuditoria: ["", Validators.required],
      auditor: ["", Validators.required],
      nameAuditor: ["", Validators.required],
      observacion: ["", Validators.required],
      planTime: ["", Validators.required],
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
      this.listAuditor = this.arrayListResponsible.filter((e: any) =>
        e.cargo === "Líder de Proceso"
      )

    })
  }

  tabOption(value: string) {
    if (value === 'proceso') {
      this.formParent.get('proceso').enable();
      this.formParent.get('actividad').disable();
    } else if (value === 'actividad') {
      this.formParent.get('actividad').enable();
      this.formParent.get('proceso').disable();
    } else if (value === 'norma') {
      this.formParent.get('norma').enable();
      this.formParent.get('requisito').disable();
    } else if (value === 'requisito') {
      this.formParent.get('requisito').enable();
      this.formParent.get('norma').disable();
    }
  }

  saveForm() {
    this.valueFormParent = this.formParent.value
    //para enviar valor al padre 
    this.valorEnviadoModal.emit(this.formParent.value);
    //para cerrar el modal 
    const openModalButton = document.getElementById("closeModal");
    openModalButton.click();
    this.formParent.reset();
  }
  
  // getAuditorList() {
  //   this.ApiService.getAuditorListService()
  //     .subscribe((data: any) => {
  //       console.log(data, "databuscada")
  //       this.listAuditor = data;
  //       this.equipoAuditor = data;

  //       return this.listAuditor;
  //     })
  // }

 

  // onTogglee() {
  //   // Suscribirse a los cambios del toggleValue
  //   this.formParent.get('toggleValue').valueChanges.subscribe((value) => {
  //     console.log(value, "value actual")
  //     if (value) {
  //       // Habilitar la validación en el campo 'actividad'
  //       this.formParent.get('actividad').setValidators(Validators.required);
  //     } else {
  //       // Deshabilitar la validación en el campo 'actividad'

  //       this.formParent.get('actividad').clearValidators();
  //     }

  //     // Actualizar la validación en el campo 'actividad'
  //     this.formParent.get('actividad').updateValueAndValidity();
  //   });

  // }
  // onTogleNorma() {
  //   this.formParent.get('toggleValue').valueChanges.subscribe((value) => {
  //     console.log(value, "value actual")
  //     if (value) {
  //       // Habilitar la validación en el campo 'actividad'
  //       this.formParent.get('requisito').setValidators(Validators.required);
  //     } else {
  //       // Deshabilitar la validación en el campo 'actividad'

  //       this.formParent.get('requisito').clearValidators();
  //     }

  //     // Actualizar la validación en el campo 'actividad'
  //     this.formParent.get('requisito').updateValueAndValidity();
  //   });

  // }
  
}
