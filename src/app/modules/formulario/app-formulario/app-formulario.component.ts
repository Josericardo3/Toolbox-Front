import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms';
import { debug } from 'console';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ModalPadreService } from 'src/app/servicios/api/modal.padre.services';
import { FormService } from 'src/app/servicios/form/form.service';

@Component({
  selector: 'app-app-formulario',
  templateUrl: './app-formulario.component.html',
  styleUrls: ['./app-formulario.component.css']
})
export class AppFormularioComponent implements OnInit{
  @Output() guardarFormulario: EventEmitter<number> = new EventEmitter<number>();
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedMatrizId: number;
  @Input() data: any;
  //PARA QUE SE MUESTREN LOS BOTONES DE EDITAR Y MODIFICAR
  @Input() showBotones: boolean = false;
  datos: any = [];
  public form: FormGroup;
  selectedTabIndex: number = -1;
  isDisabled: boolean = true;

  
  

  //CHECKBOX

  showCheckbox: boolean = false;

  isCheckboxOn: boolean = false;

  estadoFormulario: any;

  //array

  arrayIdMatriz: any = [];
  arrayTemporal:any=[];
  

  //MUESTRA EL BOTON GUARDAR DESPUES DE DARLE EDITAR
  showGuardar: boolean = false;
  disableModificar: boolean = false;

  saveForm: FormGroup;
  constructor(
    private ApiService: ApiService,
    private formBuilder: FormBuilder,
    private Message: ModalService,
    private formService: FormService,
    private modalPadre: ModalPadreService,

  ) {}

  ngOnInit() {
    this.estadoFormulario = this.formService.obtenerEstadoFormulario(this.selectedMatrizId);  
    // //REMOVER ARRAY TEMPORAL
    localStorage.removeItem('MiArrayTemporal');
 
    this.form = this.formBuilder.group({
      estadoCumplimiento:[this.estadoFormulario?.ESTADO_CUMPLIMIENTO ||''],
      responsable:[this.estadoFormulario?.RESPONSABLE || ''],
      evidencia:[this.estadoFormulario?.EVIDENCIA || ''],
      observaciones:[this.estadoFormulario?.OBSERVACIONES || ''],
      acciones:[this.estadoFormulario?.ACCIONES || ''],
      responsableCumplimiento:[this.estadoFormulario?.RESPONSABLE_CUMPLIMIENTO || ''],
      fecha:[this.estadoFormulario?.FECHA || ''],
      estado:[this.estadoFormulario?.ESTADO || ''],
    });  
    
    this.setSelectedValues();
    
    this.setFormDisabledState();
    this.restaurarForm();
    this.isDisabled = true;
  }
  //VALORES POR DEFECTO EN LOS CAMPOS DEL FORMULARIO(ULTIMA MODIFICACION DE DATOS EN LA BD)
  restaurarForm(){
    this.form = this.formBuilder.group({
      estadoCumplimiento: [{ value: this.data?.ESTADO_CUMPLIMIENTO || this.estadoFormulario?.ESTADO_CUMPLIMIENTO || '', disabled: true }],
      responsable: [{ value: this.data?.RESPONSABLE_CUMPLIMIENTO || this.estadoFormulario?.RESPONSABLE || '', disabled: true}],
      evidencia: [{ value: this.data?.DATA_CUMPLIMIENTO || this.estadoFormulario?.EVIDENCIA || '', disabled: true }],
      observaciones: [{ value: this.data?.DATA_CUMPLIMIENTO || this.estadoFormulario?.OBSERVACIONES || '', disabled: true }],
      acciones: [{ value: this.data?.PLAN_ACCIONES_A_REALIZAR || this.estadoFormulario?.ACCIONES || '', disabled: true }],
      responsableCumplimiento: [{ value: this.data?.PLAN_RESPONSABLE_CUMPLIMIENTO || this.estadoFormulario?.RESPONSABLE_CUMPLIMIENTO || '', disabled: true }],
      fecha: [{ value: this.data?.PLAN_FECHA_EJECUCION || this.estadoFormulario?.FECHA || '', disabled: true }],
      estado: [{ value: this.data?.PLAN_ESTADO || this.estadoFormulario?.ESTADO || '', disabled: true }],
    });
  }

  


  onSubmit(idMatriz: number,event:any) {  
    var array:any=[];
    var datosLocalStorage=localStorage.getItem('MiArrayTemporal');
    if(datosLocalStorage){
        this.arrayIdMatriz.push(idMatriz);
  
        array=datosLocalStorage.split(',');
  
  
        array.push(idMatriz);
        localStorage.setItem('MiArrayTemporal', array);
        console.log('arayyy2', array);
    }
    else{
      this.arrayIdMatriz.push(idMatriz);
      localStorage.setItem('MiArrayTemporal', this.arrayIdMatriz);
      array.push(idMatriz);
      console.log('arayyy1', array);
    }

 
  //   // Guarda el estado del formulario en el servicio
  //       var arrayIdMatrices: number[] = []; // Declaración local del array
  //       arrayIdMatrices = this.arrayIdMatriz;
  // // Agrega el valor de idMatriz al array local
  //   arrayIdMatrices.push(idMatriz);
  //   console.log("indicador", arrayIdMatrices);
    //console.log("total",this.arrayIdMatriz);
    // this.llenar(idMatriz);
    // event.preventDefault();
    // var idMatrizNuevo=idMatriz;
  localStorage.removeItem('miArray');
    this.formService.guardarEstadoFormulario(idMatriz, this.form.value);
    this.setSelectedValues();
    this.isDisabled = true;
    const estadoCumplimiento = this.form.get('estadoCumplimiento')?.value.toString();
    const responsableCumplimiento = this.form.get('responsable')?.value.toString();
    const evidencia = this.form.get('evidencia')?.value.toString();
    const observaciones = this.form.get('observaciones')?.value.toString();
    const acciones = this.form.get('acciones')?.value.toString();
    const responsablePlanCumplimiento = this.form.get('responsableCumplimiento')?.value.toString();
    const fechaEjecucion = this.form.get('fecha')?.value.toString();
    const estado = this.form.get('estado')?.value.toString();
    const checkbox = this.isCheckboxOn;
  //RESUMEN 
    
    console.log(
      estadoCumplimiento,
      responsableCumplimiento,
      evidencia,
      observaciones,
      acciones,
      responsablePlanCumplimiento,
      fechaEjecucion,
      estado,
      this.selectedMatrizId,
      checkbox
    );

    const data = {
      FK_ID_USUARIO: window.localStorage.getItem('Id'),
      FK_ID_MATRIZ_LEGAL: this.selectedMatrizId,
      ESTADO_CUMPLIMIENTO: estadoCumplimiento,
      RESPONSABLE_CUMPLIMIENTO: responsableCumplimiento,
      DATA_CUMPLIMIENTO: estadoCumplimiento === 'Si' ? evidencia : observaciones,
      PLAN_INTERVENCION: [
        {
          PLAN_ACCIONES_A_REALIZAR: acciones,
          PLAN_RESPONSABLE_CUMPLIMIENTO: responsablePlanCumplimiento,
          PLAN_FECHA_EJECUCION: fechaEjecucion,
          PLAN_ESTADO: estado,
        }
      ]
    };   
    console.log("gagaaaaa",data);

    // const textAreaModal = document.getElementById("textAreaModal") as HTMLTextAreaElement
    // this.texto = textAreaModal.value;
    // console.log("asd", this.texto);
    if(checkbox){
      const data2 ={
        
        ID_USUARIO: window.localStorage.getItem('Id'),
        DESCRIPCION: acciones,
        NTC: "",
        REQUISITOS: "",
        TIPO: "Matriz Legal",
        ESTADO: estado,
        FECHA_INICIO: fechaEjecucion,
        FECHA_FIN: "",
      }
      console.log(data2)
      this.ApiService.postMejoraContinua(data2).subscribe((savedData2: any) => {
        console.log('Se guardó correctamente: 2', savedData2);
        // Update the form values with the latest data
        // this.data = savedData;
        
        
        //console.log("indicador", this.arrayIdMatriz);
      });
    }
    this.showGuardar=!this.showGuardar
    this.disableModificar=!this.disableModificar



    return this.ApiService.saveLey(data)
    .subscribe((savedData: any) => {
      console.log('Se guardó correctamente:', savedData);
      // Update the form values with the latest data
      // this.data = savedData;
      
      
      //console.log("indicador", this.arrayIdMatriz);
    });
    
  }

  llenar(idMatriz:any){
    this.arrayIdMatriz.push(idMatriz);
  }

  setSelectedValues() {
    const estadoCumplimiento = this.form.get('estadoCumplimiento').value;
    const responsable = this.form.get('responsable').value;
    const responsableCumplimiento = this.form.get('responsableCumplimiento').value;
    const estado = this.form.get('estado').value;
  
    // Establecer los valores seleccionados en los campos select
    this.form.get('estadoCumplimiento').setValue(estadoCumplimiento);
    this.form.get('responsable').setValue(responsable);
    this.form.get('responsableCumplimiento').setValue(responsableCumplimiento);
    this.form.get('estado').setValue(estado);
  }

  setFormDisabledState() {
    if (this.isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  activarCampos(activar: boolean) {
    this.form.enable();
    this.isDisabled = !activar;
    this.showCheckbox = activar;
    this.showGuardar = activar;
    this.disableModificar = activar;
    
  }

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }
  //funcion modal que muestra un textarea para resumen de cambios, dentro del formulario
  showModal: boolean = false;
  texto: any;
  saveModal(){
    const textAreaModal = document.getElementById("textAreaModal") as HTMLTextAreaElement
    this.texto = textAreaModal.value;
    console.log("asd", this.texto);
    const title = "Guardado exitoso";
    const message = "Se a guardado correctamente"
    this.Message.showModal(title,message);
  }

  toggleCheckbox() {
    this.isCheckboxOn = !this.isCheckboxOn;
    console.log("CHECKBOX",this.isCheckboxOn);
    
  }


  terminarModificarCampos2(){
    this.modalPadre.abrirModal();
    

  }
  
  
}
