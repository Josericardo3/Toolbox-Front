import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms';
import { debug } from 'console';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ModalPadreService } from 'src/app/servicios/api/modal.padre.services';
import { FormService } from 'src/app/servicios/form/form.service';
import { EMatrizRequisitosLegalesComponent } from '../../e-matriz-requisitos-legales/e-matriz-requisitos-legales.component';

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
  @Input() showBotonEliminar: boolean = false;
  datos: any = [];
  public form: FormGroup;
  selectedTabIndex: number = -1;
  isDisabled: boolean = true;
  minDate: string;

  //BOTON ELIMINAR
  matrizAEliminar: number;
  
  

  //CHECKBOX

  showCheckbox: boolean = false;

  isCheckboxOn: boolean = false;

  estadoFormulario: any;

  //ARRAY DE RESPONSABLES


  arrayListResponsible: any = [];

  //ARRAYS TEMPORALES QUE GUARDAN MATRICES MODIFICADAS

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
    private EMatrizRequisitosLegales: EMatrizRequisitosLegalesComponent,

  ) {}

  ngOnInit() {
    
    this.estadoFormulario = this.formService.obtenerEstadoFormulario(this.selectedMatrizId);  
    
    // //REMOVER ARRAY TEMPORAL
    localStorage.removeItem('MiArrayTemporal');
    ;
 debugger;
    this.form = this.formBuilder.group({
      estadoCumplimiento:[this.estadoFormulario?.ESTADO_CUMPLIMIENTO ||''],
      responsable:[this.estadoFormulario?.ID_RESPONSABLE || ''],
      evidencia:[this.estadoFormulario?.EVIDENCIA || ''],
      observaciones:[this.estadoFormulario?.OBSERVACIONES || ''],
      acciones:[this.estadoFormulario?.ACCIONES || ''],
      responsableCumplimiento:[this.estadoFormulario?.ID_RESPONSABLE_CUMPLIMIENTO || ''],
      fecha:[this.estadoFormulario?.FECHA || ''],
      estado:[this.estadoFormulario?.ESTADO || ''],
    });  
    
    this.setSelectedValues();
    this.fnListResponsible();
    
    this.setFormDisabledState();
    this.restaurarForm();
    this.isDisabled = true;
    console.log("gian2", this.data);
    console.log("giancito", this.selectedMatrizId);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Los meses comienzan en 0
    const day = today.getDate();

    this.minDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  //VALORES POR DEFECTO EN LOS CAMPOS DEL FORMULARIO(ULTIMA MODIFICACION DE DATOS EN LA BD)
  restaurarForm(){
    debugger;
    this.form = this.formBuilder.group({
      estadoCumplimiento: [{ value: this.data?.ESTADO_CUMPLIMIENTO || this.estadoFormulario?.ESTADO_CUMPLIMIENTO || '', disabled: true }],
      responsable: [{value: this.data?.ID_RESPONSABLE_CUMPLIMIENTO || this.estadoFormulario?.ID_RESPONSABLE || '',disabled: true,}],
      evidencia: [{ value: this.data?.DATA_CUMPLIMIENTO || this.estadoFormulario?.EVIDENCIA || '', disabled: true }],
      observaciones: [{ value: this.data?.DATA_CUMPLIMIENTO || this.estadoFormulario?.OBSERVACIONES || '', disabled: true }],
      acciones: [{ value: this.data?.PLAN_ACCIONES_A_REALIZAR || this.estadoFormulario?.ACCIONES || '', disabled: true }],
      responsableCumplimiento: [{ value: this.data?.ID_PLAN_RESPONSABLE_CUMPLIMIENTO || this.estadoFormulario?.ID_RESPONSABLE_CUMPLIMIENTO || '', disabled: true }],
      fecha: [{ value: this.data?.PLAN_FECHA_EJECUCION || this.estadoFormulario?.FECHA || '', disabled: true }],
      estado: [{ value: this.data?.PLAN_ESTADO || this.estadoFormulario?.ESTADO || '', disabled: true }],
    });
    
  }

  


  onSubmit(idMatriz: number,event:any) {  
    console.log("yaaaa", idMatriz)
    console.log("felix", this.selectedMatrizId);
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
    const IDresponsableCumplimiento = this.form.get('responsable')?.value.toString();
    
    const evidencia = this.form.get('evidencia')?.value.toString();
    const observaciones = this.form.get('observaciones')?.value.toString();
    const acciones = this.form.get('acciones')?.value.toString();
    const IDresponsablePlanCumplimiento = this.form.get('responsableCumplimiento')?.value.toString();
    const fechaEjecucion = this.form.get('fecha')?.value.toString();
    const estado = this.form.get('estado')?.value.toString();
    const checkbox = this.isCheckboxOn;

    const cont = this.arrayListResponsible.length
    let nombreCumplimiento = '';
    let nombrePlanCumplimiento = '';

    for(let index=0; index<cont ;index++){
      if(IDresponsableCumplimiento == this.arrayListResponsible[index].ID_USUARIO){
          nombreCumplimiento = this.arrayListResponsible[index].NOMBRE
        }      
    }
    for(let index=0; index<cont ;index++){
      if(IDresponsablePlanCumplimiento == this.arrayListResponsible[index].ID_USUARIO){
          nombrePlanCumplimiento = this.arrayListResponsible[index].NOMBRE
        }      
    }
  //RESUMEN 
    
    console.log(
      estadoCumplimiento,
      IDresponsableCumplimiento,
      evidencia,
      observaciones,
      acciones,
      IDresponsablePlanCumplimiento,
      fechaEjecucion,
      estado,
      this.selectedMatrizId,
      checkbox
    );

    const data = {
      FK_ID_USUARIO: window.localStorage.getItem('Id'),
      FK_ID_MATRIZ_LEGAL: this.selectedMatrizId,
      ESTADO_CUMPLIMIENTO: estadoCumplimiento,
      ID_RESPONSABLE_CUMPLIMIENTO: IDresponsableCumplimiento,
      RESPONSABLE_CUMPLIMIENTO: nombreCumplimiento,
      DATA_CUMPLIMIENTO: estadoCumplimiento === 'Si' ? evidencia : observaciones,
      PLAN_INTERVENCION: [
        {
          PLAN_ACCIONES_A_REALIZAR: acciones || null,
          ID_PLAN_RESPONSABLE_CUMPLIMIENTO : IDresponsablePlanCumplimiento || null,
          PLAN_RESPONSABLE_CUMPLIMIENTO: nombrePlanCumplimiento || null,
          PLAN_FECHA_EJECUCION: fechaEjecucion  || null,
          PLAN_ESTADO: estado  || null,
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
        RESPONSABLE: nombrePlanCumplimiento,
        DESCRIPCION: acciones,
        NTC: "",
        REQUISITOS: "",
        TIPO: "Matriz Legal",
        ESTADO: estado,
        FECHA_INICIO: fechaEjecucion,
        FECHA_FIN: fechaEjecucion
      }
      console.log("esto se envia a la API MEJORA: ", data2);
      this.ApiService.postMejoraContinua(data2).subscribe((savedData2: any) => {
        console.log('Se guardó correctamente: 2', savedData2);
        // Update the form values with the latest data
        // this.data = savedData;
        
        
        //console.log("indicador", this.arrayIdMatriz);
      });
    }
    if(estadoCumplimiento =="No" || estadoCumplimiento == "En proceso"){
      const fechaCorregida = formatDate(fechaEjecucion, 'dd-MM-yyyy', 'en-US');
      
      const data3 = {
        
          FK_ID_USUARIO_PST: window.localStorage.getItem('Id'),
          FK_ID_RESPONSABLE: IDresponsablePlanCumplimiento,
          TIPO_ACTIVIDAD: "Matriz Requisitos Legales",
          DESCRIPCION: acciones,
          FECHA_INICIO: fechaCorregida,
          FECHA_FIN: fechaCorregida,
          ESTADO_PLANIFICACION: "En Proceso",
          ENVIO_CORREO: false
        
      }
      this.ApiService.postNewRecord(data3).subscribe((savedData3:any)=>{
        console.log('Se guardo correctamente : 3', savedData3);
      })

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

  eliminarLey(idMatriz: number,event:any){
    
    console.log("MATRIZ A BORRAR: ", this.selectedMatrizId);
    console.log("MATRIZ A BORRAR: ", idMatriz);
    this.matrizAEliminar = this.selectedMatrizId;
    console.log("primer guardado: ", this.matrizAEliminar)
    console.log("yaaaa", idMatriz)
    console.log("felix", this.selectedMatrizId);
    var array:any=[];
    var datosLocalStorage=localStorage.getItem('MiArrayTemporalELIMINAR');
    if(datosLocalStorage){
        this.arrayIdMatriz.push(idMatriz);
  
        array=datosLocalStorage.split(',');
  
  
        array.push(idMatriz);
        localStorage.setItem('MiArrayTemporalELIMINAR', array);
        console.log('arayyy2', array);
    }
    else{
      this.arrayIdMatriz.push(idMatriz);
      localStorage.setItem('MiArrayTemporalELIMINAR', this.arrayIdMatriz);
      array.push(idMatriz);
      console.log('arayyy1', array);
    }
    
  }
  
  confirmDelete(){
    
    console.log("segundo guardado: ", this.matrizAEliminar)
    var datosLocalStorage=localStorage.getItem('MiArrayTemporalELIMINAR');
    var arrayID = datosLocalStorage.split(',');
    arrayID.forEach(element => {

      this.ApiService.deleteLey(element).subscribe((dataLey)=>{
        console.log("element: ", element);
          const title = "Eliminación exitosa";
          const message = "El registro se ha eliminado exitosamente"
          this.Message.showModal(title, message);
          this.EMatrizRequisitosLegales.separarCategoria();
          
      
      console.log("MATRIZ A BORRAR: THIS.SELECTEDMATRIZ ", this.selectedMatrizId);
      
    })
      
      
      })
      
    
      localStorage.removeItem('MiArrayTemporalELIMINAR');

    

  }
  cancelDelete(){
    localStorage.removeItem('MiArrayTemporalELIMINAR');
    

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

  fnListResponsible() {
    this.ApiService.getListResponsible().subscribe((data) => {
      this.arrayListResponsible = data;
    })
  }
  
  
  
}
