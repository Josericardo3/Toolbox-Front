import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';
import { Auditoria } from 'src/app/servicios/api/models/color';

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
  audit = Number(window.localStorage.getItem('ID_AUDITORIA'));

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
    
    const valor = this.formParent.get('HALLAZGO').value;
    const DESCRIPCION = this.formParent.get('OBSERVACION').value;
    const REQUISITOS = this.formParent.get('REQUISITO').value;
    const formPreguntasArray = this.formParent.get('formPreguntas') as FormArray;
    const closeModalButton = document.getElementById("closeModal");
    closeModalButton.click();
    this.arrayTemp=[];
    if(valor == "C" || valor == "NC"){
    
      const auditoriaSubscription = this.ApiService.getAuditoria(this.audit).subscribe(
        (data: Auditoria) => {
          console.log(data);
          this.EQUIPO_AUDITOR = data.EQUIPO_AUDITOR;
          this.FECHA_REUNION_CIERRE = data.FECHA_REUNION_CIERRE;
          this.FECHA_REUNION_APERTURA = data.FECHA_REUNION_APERTURA;
      
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
            TIPO: TIPO,
            ESTADO: ESTADO,
            FECHA_INICIO: FECHA_INICIO,
            FECHA_FIN: FECHA_FIN,
            NTC: NTC,
            DESCRIPCION : DESCRIPCION,
            REQUISITOS : REQUISITOS
          };
      
          this.ApiService.postMejoraContinua(request).subscribe(
            response => {
            },
            error => {
              console.error(error);
            }
          );
        },
        error => {
          console.error(error);
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
