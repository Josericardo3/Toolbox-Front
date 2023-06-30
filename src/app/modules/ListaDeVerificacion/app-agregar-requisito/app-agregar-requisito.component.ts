import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-agregar-requisito',
  templateUrl: './app-agregar-requisito.component.html',
  styleUrls: ['./app-agregar-requisito.component.css']
})
export class AppAgregarRequisitoComponent {
  modalRef: BsModalRef;
  formParent!: FormGroup;
  @Output() valorEnviadoModal = new EventEmitter<object>();

  openModal(template: any) {
    this.modalRef = this.modalService.show(template);
  }
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public ApiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.formParent = this.formBuilder.group({
      ID_REQUISITO: 0,
      REQUISITO: ['', Validators.required],
      EVIDENCIA: ['', Validators.required],
      formPreguntas: this.formBuilder.array([]),
      HALLAZGO: ['', Validators.required],
      OBSERVACION: [''],
      PREGUNTA: ['']

    });
  }

  addRequest(evt: any) {
    evt.preventDefault();

  }
  saveForm() {
    this.valorEnviadoModal.emit(this.formParent.value);
    this.formParent.reset();
    const formPreguntasArray = this.formParent.get('formPreguntas') as FormArray;
    formPreguntasArray.clear()
    const closeModalButton = document.getElementById("closeModal");
    closeModalButton.click();
    this.arrayTemp=[];

  }
  preguntasArr: any;
  preguntas: string[] = [];
  mostrarInputPregunta: boolean = false;
  arrayTemp: any =[];

  mostrarInput() {
    this.mostrarInputPregunta = !this.mostrarInputPregunta
  }
  guardarPregunta() {
    const preguntaValor = this.formParent.get('PREGUNTA')?.value;
    if (preguntaValor != '' && preguntaValor != null) {
      const formPreguntasArray = this.formParent.get('formPreguntas') as FormArray;
      formPreguntasArray.push(this.formBuilder.control(this.formParent.get('PREGUNTA')?.value));
      this.mostrarInputPregunta = false;
    }

    this.arrayTemp = this.formParent.value;
    this.arrayTemp = this.arrayTemp.formPreguntas;
    const pregunta = this.formParent.get('PREGUNTA');
    pregunta.patchValue('');
  }
  cancelEvent(event:any){
    event.preventDefault();
  }


}
