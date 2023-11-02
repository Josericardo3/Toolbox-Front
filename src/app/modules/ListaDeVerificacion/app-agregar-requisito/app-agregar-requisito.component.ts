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
  CODIGO: string;
  EQUIPO_AUDITOR: string = '';
  ALCANCE: string;
  HORA_REUNION_APERTURA: string;
  FECHA_REUNION_CIERRE: string  = '';
  HORA_REUNION_CIERRE: string;
  FECHA_REUNION_APERTURA: string  = '';
  PROCESOS: any[];
  requisitos: any[] = [];



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

    this.getRequisitos();

  }
  getRequisitos() {
    const norma = localStorage.getItem('idNormaSelected');
    this.ApiService.getRequerimientosNormas(norma).subscribe((data: any) => {
      this.requisitos = data;
    });
  }

  addRequest(evt: any) {
    evt.preventDefault();

  }
  saveForm() {
    let audit = Number(window.localStorage.getItem('ID_AUDITORIA'));
    const valor = this.formParent.get('HALLAZGO').value;
    const DESCRIPCION = this.formParent.get('OBSERVACION').value;
    const REQUISITOS = this.formParent.get('REQUISITO').value;
    const formPreguntasArray = this.formParent.get('formPreguntas') as FormArray;
    formPreguntasArray.clear()
    const closeModalButton = document.getElementById("closeModal");
    closeModalButton.click();
    this.arrayTemp=[];
    if(valor == "C" || valor == "NC"){
    
    this.ApiService.getAuditorias(audit).subscribe((data: any) => {
      this.EQUIPO_AUDITOR = data.AUDITOR_LIDER;
      this.ALCANCE = data.ALCANCE;
      this.HORA_REUNION_APERTURA = data.HORA_REUNION_APERTURA;
      this.FECHA_REUNION_CIERRE = data.FECHA_REUNION_CIERRE;
      this.HORA_REUNION_CIERRE = data.HORA_REUNION_CIERRE;
      this.FECHA_REUNION_APERTURA = data.FECHA_REUNION_APERTURA;
    },
    error => {
      console.error(error);
    });

    const ID_USUARIO = window.localStorage.getItem('Id');
    const RESPONSABLE = this.EQUIPO_AUDITOR;
    const TIPO = valor;
    const ESTADO = 'EN PROCESO';
    const FECHA_INICIO = this.FECHA_REUNION_APERTURA;
    const FECHA_FIN = this.FECHA_REUNION_CIERRE;
    const NTC = window.localStorage.getItem('normaSelected');
    const request = {
      ID_USUARIO: ID_USUARIO,
      RESPONSABLE: RESPONSABLE,
      DESCRIPCION: DESCRIPCION,
      REQUISITOS: REQUISITOS,
      TIPO: TIPO,
      ESTADO: ESTADO,
      FECHA_INICIO : FECHA_INICIO,
      FECHA_FIN : FECHA_FIN,
      NTC : NTC,
    };
      this.ApiService.postMejoraContinua(request)
      .subscribe(
        response => {

        },
        error => {
        }
      );
    }

    this.valorEnviadoModal.emit(this.formParent.value);
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

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }


  
}
