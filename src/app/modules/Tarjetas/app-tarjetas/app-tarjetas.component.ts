import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormService } from 'src/app/servicios/form/form.service';
import { ActivatedRoute } from '@angular/router';
import { forEach } from 'lodash';
import { elements } from 'chart.js';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';

interface Option {
  id: number
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-app-tarjetas',
  templateUrl: './app-tarjetas.component.html',
  styleUrls: ['./app-tarjetas.component.css']
})

export class AppTarjetasComponent implements OnInit, AfterViewInit {

  @Input() index: number | undefined;
  @Output() eliminarTarjeta = new EventEmitter<number>();
  @Output() tarjetaClicada = new EventEmitter<number>();
  @Output() formularioCompletado = new EventEmitter<FormGroup>();
  @Output() tarjetaCompletada = new EventEmitter<any>();
  @Input() valoresPreguntas: any = [];
  @Input() editandoEncuesta: boolean = false;
  @Input() datosPreguntaEncuesta: any[]
  @Input() tituloEditar: any = "";
  @Input() descripcionEditar: any = "";
  @Input() selectCrearTarjeta: boolean = false;
  @Output() ultimoIDChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() activarCompartirEncuesta: EventEmitter<any> = new EventEmitter<any>();

  public form: FormGroup;
  hayopcion:any=true;
  valoresPreguntass: any = [];
  showOtro: boolean = false;
  addInput: boolean = false;
  selectedOption: Option = { id: 0, label: 'Seleccione una opción', value: '', icon: '' };
  selectedOptionEditar: any = [{ id: 0, label: 'Seleccione una opción', value: '', icon: '' }]
  showOptions = false;
  showOptionEditar = []
  selectedOptions: any = [];
  showOptionss: any = [];
  inputs: any[] = [];
  isOn: boolean = false;
  modeloEnvio: any = {};
  idEncuesta:any=0;
  options: Option[] = [
    { id: 1, label: 'Respuesta corta', value: 'respuestaCorta', icon: 'fa-solid fa-minus' },
    { id: 2, label: 'Respuesta larga', value: 'respuestaLarga', icon: 'fa-solid fa-grip-lines' },
    { id: 3, label: 'Varias opciones', value: 'radioButton', icon: 'fa-regular fa-circle-dot' },
    { id: 4, label: 'Casillas', value: 'checkbox', icon: 'fa-regular fa-square-check' },
    { id: 5, label: 'Desplegable', value: 'desplegable', icon: 'fa-solid fa-circle-arrow-down' }
  ];
  modelPreguntas: any = [{ IDUNICO: 1, opcionesBoton: [], opcionesCheckbox: [], opcionesDesplegableEditar: [] }];
  selectTarjeta: boolean = false;
  selectObligatorio: boolean = true;
  ultimoID: any;
  compartirEncuestaBtn: boolean = false;
  cambiarEstadoSwitch: boolean = false;

  constructor(
    private ApiService: ApiService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.formulario();

    if (this.editandoEncuesta) {
      this.activatedRoute.params.subscribe(params => {
        if (params['id']) {
          this.editandoEncuesta = true;
          this.selectObligatorio = true;
          this.cambiarEstadoSwitch = true;
          this.selectTarjeta = true;
          this.obtenerDatosEncuesta(params['id']);
          this.idEncuesta=params['id'];
        }
      });
      this.completarFormularioEdicion();
      console.log(this.editandoEncuesta)
    }
    else {
      this.selectOptionEditar(this.selectedOptionEditar[0], 0) 
      this.toggleOptionsEditar(0);
    }

    this.onInputChange(this.form);
  }

  obtenerDatosEncuesta(encuestaId: string) {
    this.ApiService.getEncuestasRespuesta(encuestaId)
      .subscribe(respuesta => {
        this.modeloEnvio.ID_MAE_ENCUESTA = respuesta.ID_MAE_ENCUESTA;

        this.modeloEnvio.MAE_ENCUESTA_PREGUNTAS = respuesta.MAE_ENCUESTA_PREGUNTAS;

        this.valoresPreguntass = respuesta.MAE_ENCUESTA_PREGUNTAS;
        this.modelPreguntas = respuesta.MAE_ENCUESTA_PREGUNTAS;
        this.modelPreguntas = this.modelPreguntas.map(function (pregunta) {
          return { ...pregunta, IDUNICO: pregunta.ID_MAE_ENCUESTA_PREGUNTA, opcionesBoton: [], opcionesCheckbox: [], opcionesDesplegableEditar: [] };
        });
        this.completarFormularioEdicion();
        this.completarFormularioValores();
      });
  }

  completarFormularioValores() {
    this.modelPreguntas.forEach(elements => {

      if (elements.TIPO === "radioButton") {
        //var elemtosRadio:any=[];
        var elemtosRadio = elements.VALOR.split(';');
        elemtosRadio.forEach(x => {
          var objeto: any = {};
          if (x == "Otro") {
            objeto = { esOpcion: true, valorCheck: x }
          } else {
            objeto = { esOpcion: false, valorCheck: x }
          }
          elements.opcionesBoton.push(objeto);
        })
      }
      if (elements.TIPO === "checkbox") {
        //var elemtosRadio:any=[];
        var elemtosRadio = elements.VALOR.split(';');
        elemtosRadio.forEach(x => {
          var objeto: any = {};
          if (x == "Otro") {
            objeto = { esOpcion: true, valorCheck: x }
          } else {
            objeto = { esOpcion: false, valorCheck: x }
          }
          elements.opcionesCheckbox.push(objeto);
        })
      }
      if (elements.TIPO === "desplegable") {
        //var elemtosRadio:any=[];
        var elemtosRadio = elements.VALOR.split(';');
        elemtosRadio.forEach(x => {
          var objeto: any = {};
          if (x == "Otro") {
            objeto = { esOpcion: true, valorCheck: x }
          } else {
            objeto = { esOpcion: false, valorCheck: x }
          }
          elements.opcionesDesplegableEditar.push(objeto);
        })
      }
    })
  }

  ngAfterViewInit() {
    this.completarFormulario();
  }

  formulario() {
    this.form = this.formBuilder.group({
      pregunta: [''],
      respuestaCorta: [''],
      respuestaLarga: [''],
      opcion1Radio: [''],
      otroRadio: [''],
      opcionesRadio: this.formBuilder.array([]),
      opcion1Checkbox: [''],
      otroCheckbox: [''],
      opcionesCheckbox: this.formBuilder.array([]),
      desplegableOpcion1: [''],
      opcionesDesplegable: this.formBuilder.array([]),
      obligatorio: [false],
    });
  }
  
  onInputChange(formulario: any) {
    console.log(formulario)
    
    if (this.form.status === 'VALID') {
      this.tarjetaCompletada.emit(true);
      console.log('aaaaaaaaaaaaaaa', this.selectCrearTarjeta)
    }
    else {
      this.tarjetaCompletada.emit(false);
      this.selectCrearTarjeta = true;
    }
  }
  
  completarFormulario() {
    let valor = '';
    let tipo = '';
    let otroValor = '';

    if (this.selectedOption.value === 'respuestaCorta') {
      valor = this.form.get('respuestaCorta').value.toString();
      tipo = 'respuestaCorta';
    } else if (this.selectedOption.value === 'respuestaLarga') {
      valor = this.form.get('respuestaLarga').value.toString();
      tipo = 'respuestaLarga';
    } else if (this.selectedOption.value === 'radioButton') {
      const opcion1Radio = this.form.get('opcion1Radio').value.toString();
      const opcionesRadioArray = this.form.get('opcionesRadio') as FormArray;
      const opcionesValores = opcionesRadioArray.controls.map(control => control.value.toString());

      // Verificar si la primera opción está vacía antes de concatenar
      if (opcion1Radio) {
        valor = opcion1Radio;
      }
      if (this.showOtro) {
        otroValor = 'Otro';
      }
      if (opcionesValores.length > 0) {
        valor += ';' + opcionesValores.join(';');
      }

      tipo = 'radioButton';
    } else if (this.selectedOption.value === 'checkbox') {
      const opcion1Checkbox = this.form.get('opcion1Checkbox').value.toString();
      const opcionesCheckboxArray = this.form.get('opcionesCheckbox') as FormArray;
      const opcionesValores = opcionesCheckboxArray.controls.map(control => control.value.toString());

      // Verificar si la primera opción está vacía antes de concatenar
      if (opcion1Checkbox) {
        valor = opcion1Checkbox;
      }
      if (this.showOtro) {
        otroValor = 'Otro';
      }
      if (opcionesValores.length > 0) {
        valor += ';' + opcionesValores.join(';');
      }

      tipo = 'checkbox';
    } else if (this.selectedOption.value === 'desplegable') {
      const desplegableOpcion1 = this.form.get('desplegableOpcion1').value.toString();
      const opcionesDesplegableArray = this.form.get('opcionesDesplegable') as FormArray;
      const opcionesValores = opcionesDesplegableArray.controls.map(control => control.value.toString());

      // Verificar si la primera opción está vacía antes de concatenar
      if (desplegableOpcion1) {
        valor = desplegableOpcion1;
      }
      if (opcionesValores.length > 0) {
        valor += ';' + opcionesValores.join(';');
      }

      tipo = 'desplegable';
    }

    const finalValor = valor + (valor && otroValor ? ';' : '') + otroValor;

    return {
      "ID_MAE_ENCUESTA_PREGUNTA": 0,
      "FK_MAE_ENCUESTA": 0,
      "DESCRIPCION": this.form.get('pregunta').value.toString(),
      "TIPO": tipo.toString(),
      "VALOR": finalValor,
      "OBLIGATORIO": this.form.get('obligatorio').value,
    };
  }

  completarFormularioEdicion() {
    for (var i = 0; i < this.valoresPreguntass.length; i++) {
      var tipo = this.valoresPreguntass[i].TIPO;
      var seleccionado = this.options.filter(x => x.value == tipo);
      this.selectedOptions[i] = seleccionado[0];
    }
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  toggleOptionsEditar(id: any) {   
    this.showOptionEditar[id] = !this.showOptionEditar[id];
  }

  selectOptionEditar(option: Option, id: any) {
    // this.selectTarjeta = true;
    this.showOptionss[id] = false;
    this.selectedOptions[id] = option;
    this.modelPreguntas[id].TIPO = option.value;
    if (option.value === 'respuestaCorta' || option.value === 'respuestaLarga' || option.value === 'radioButton' 
    || option.value === 'checkbox' || option.value === 'desplegable') {
      
      // Establecer el campo VALOR a una cadena vacía ('')
      this.modelPreguntas[id].VALOR = '';
      this.selectTarjeta = true;
    } 
    if (this.modelPreguntas[id].opcionesBoton.length < 1) {
      this.modelPreguntas[id].opcionesBoton.push({})
    }
    if (this.modelPreguntas[id].opcionesCheckbox.length < 1) {
      this.modelPreguntas[id].opcionesCheckbox.push({})
    }
    if (this.modelPreguntas[id].opcionesDesplegableEditar.length < 1) {
      this.modelPreguntas[id].opcionesDesplegableEditar.push({})
    }

    this.showOptionEditar[id] = !this.showOptionEditar[id];
  }

  agregarTarjeta() {
    // Solo emitir el evento tarjetaClicada si no estás en el modo de opciones
    if (!this.showOptions) {
      this.tarjetaClicada.emit(this.index);
    }
  }

  eliminarEstaTarjeta() {
    this.eliminarTarjeta.emit(this.index);
  }

  selectOption(option: Option) {
    console.log(option)
    if (option.id === 1 || option.id === 2) {
      this.selectCrearTarjeta = true; 
    }
    else{
      this.selectCrearTarjeta = false; 
    }
    this.selectedOption = option;
    this.showOptions = false;
    
    this.onInputChange(this.form);
    console.log('fffffffffffffff', this.selectedOption)
  }

  // agregarOtro() {
  //   this.showOtro = !this.showOtro;
  // }

  agregarOtros(pregunta: any, i: any, opcion) {
  var existeOtro=false;
    for (let index = 0; index < this.modelPreguntas[i].opcionesBoton.length; index++) {
      if (this.modelPreguntas[i].opcionesBoton[index].esOpcion == true && opcion) {
        this.removeRadioOptions(i,index);
        return;
      }
    }
   
    for (let index = 0; index < this.modelPreguntas[i].opcionesBoton.length; index++) {
      if (this.modelPreguntas[i].opcionesBoton[index].esOpcion == true) {
        existeOtro=true;
        this.removeRadioOptions(i,index);
      }
    }
    if (opcion) {
     
      this.showOtro = !this.showOtro;
      this.modelPreguntas[i].opcionesBoton.push({ esOpcion: true });
    } else {
      
     
        this.modelPreguntas[i].opcionesBoton.push({ esOpcion: false, nombre: 'opcion' });
        if(existeOtro){
          this.modelPreguntas[i].opcionesBoton.push({ esOpcion: true });
        }
    }
  }

  agregarOtrosCheck(pregunta: any, i: any, opcion) {
    var existeOtro=false;
    for (let index = 0; index < this.modelPreguntas[i].opcionesCheckbox.length; index++) {
      if (this.modelPreguntas[i].opcionesCheckbox[index].esOpcion == true && opcion) {
        this.removeCheckOptions(i,index);
        return;
      }

    }
    for (let index = 0; index < this.modelPreguntas[i].opcionesCheckbox.length; index++) {
      if (this.modelPreguntas[i].opcionesCheckbox[index].esOpcion == true) {
        existeOtro=true;
        this.removeCheckOptions(i,index);
      }
    }
    if (opcion) {
      this.showOtro = !this.showOtro;
      this.modelPreguntas[i].opcionesCheckbox.push({ esOpcion: true });
    } else {
      this.modelPreguntas[i].opcionesCheckbox.push({ esOpcion: false, nombre: 'opcion' });
      if(existeOtro){
        this.modelPreguntas[i].opcionesCheckbox.push({ esOpcion: true });
      }
    }
  }

  agregarOtrosDesplegable(pregunta: any, i: any, opcion) {
    for (let index = 0; index < this.modelPreguntas[i].opcionesDesplegableEditar.length; index++) {
      if (this.modelPreguntas[i].opcionesDesplegableEditar[index].esOpcion == true && opcion) {
        this.modelPreguntas[i].opcionesDesplegableEditar = this.modelPreguntas[i].opcionesDesplegableEditar.filter(x => x.esOpcion == false);
        return;
      }
    }
    for (let index = 0; index < this.modelPreguntas[i].opcionesDesplegableEditar.length; index++) {
      if (this.modelPreguntas[i].opcionesDesplegableEditar[index].esOpcion == true && opcion) {
        this.modelPreguntas[i].opcionesDesplegableEditar = this.modelPreguntas[i].opcionesDesplegableEditar.filter(x => x.esOpcion == false);
        return;
      }
    }
    if (opcion) {
      this.showOtro = !this.showOtro;
      this.modelPreguntas[i].opcionesDesplegableEditar.push({ esOpcion: true });
    } else {
      this.modelPreguntas[i].opcionesDesplegableEditar.push({ esOpcion: false, nombre: 'opcion' });
    }
  }

  removeRadioOptions(i, j) {
    this.modelPreguntas[i].opcionesBoton = this.modelPreguntas[i].opcionesBoton.filter(function (_, index) {
      return index !== j;
    });
  }

  removeCheckOptions(i, j) {
    this.modelPreguntas[i].opcionesCheckbox = this.modelPreguntas[i].opcionesCheckbox.filter(function (_, index) {
      return index !== j;
    });
  }

  removeDeplegableOptions(i, j) {
    this.modelPreguntas[i].opcionesDesplegableEditar = this.modelPreguntas[i].opcionesDesplegableEditar.filter(function (_, index) {
      return index !== j;
    });
  }

  removeOtro(optionType: string) {
    if (optionType === 'radioButton') {
      this.form.get('otroRadio').setValue('');
      this.showOtro = false;
    } else if (optionType === 'checkbox') {
      this.form.get('otroCheckbox').setValue('');
      this.showOtro = false;
    }
  }

  get opcionesRadio(): FormArray {
    return this.form.get('opcionesRadio') as FormArray;
  }

  get opcionesCheckbox(): FormArray {
    return this.form.get('opcionesCheckbox') as FormArray;
  }

  get opcionesDesplegable(): FormArray {
    return this.form.get('opcionesDesplegable') as FormArray;
  }

  agregarInputRadio() {
    this.opcionesRadio.push(this.formBuilder.control(''));
  }

  agregarInputCheckbox() {
    this.opcionesCheckbox.push(this.formBuilder.control(''));
  }

  agregarInputDesplegable() {
    this.opcionesDesplegable.push(this.formBuilder.control(''));
  }

  removeRadioOption(index: number) {
    this.opcionesRadio.removeAt(index);
    this.opcionesCheckbox.removeAt(index);
    this.opcionesDesplegable.removeAt(index);
  }

  generarUUID(): string {     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {         
        const r = Math.random() * 16 | 0;         
        const v = c === 'x' ? r : (r & 0x3 | 0x8);        
        return v.toString(16);     
      }); 
  }

  agregarotro(i) {
    this.selectObligatorio = false;
    this.cambiarEstadoSwitch = false;
    let defaultOption = { id: 0, label: 'Seleccione una opción', value: '', icon: '' };
  
    if (i != 0 && i != (this.modelPreguntas.length - 1)) {
      this.modelPreguntas.splice(-1, 0, { IDUNICO: this.generarUUID() ,FK_MAE_ENCUESTA: 0, ID_MAE_ENCUESTA_PREGUNTA: 0, OBLIGATORIO: false, opcionesBoton: [], opcionesCheckbox: [], opcionesDesplegableEditar: [] });
      console.log("tamañooo", this.modelPreguntas.length);
  
      // Establecer todas las opciones en 'Seleccione una opción'
      this.selectedOptions.splice(-1, 0, { ...defaultOption });
    } else if (i == this.modelPreguntas.length - 1) {
      // Agregar después
      this.modelPreguntas.push({ IDUNICO: this.generarUUID(), FK_MAE_ENCUESTA: 0, ID_MAE_ENCUESTA_PREGUNTA: 0, OBLIGATORIO: false, opcionesBoton: [], opcionesCheckbox: [], opcionesDesplegableEditar: [] });
  
      // Establecer la nueva opción en 'Seleccione una opción'
      this.selectedOptions.push({ ...defaultOption });
    } else if (i == 0) {
      this.modelPreguntas.splice(1, 0, { IDUNICO: this.generarUUID(), FK_MAE_ENCUESTA: 0, ID_MAE_ENCUESTA_PREGUNTA: 0, OBLIGATORIO: false, opcionesBoton: [], opcionesCheckbox: [], opcionesDesplegableEditar: [] });
      console.log("tamañooo", this.modelPreguntas.length);
  
      // Establecer la nueva opción en 'Seleccione una opción'
      this.selectedOptions.splice(1, 0, { ...defaultOption });
    }
  
    this.selectTarjeta = false;
    // this.selectObligatorio = false;
    console.log(this.selectTarjeta)
  }
  
  eliminar(i,pregunta) {
    console.log("eliminadaaaaa",pregunta)
    if(pregunta.ID_MAE_ENCUESTA_PREGUNTA!=0){
      this.ApiService.deletePregunta(pregunta.ID_MAE_ENCUESTA_PREGUNTA).subscribe(x => {
        this.obtenerDatosEncuesta(this.idEncuesta);
        this.modalService.showModal("Correcto", "Se Eliminó correctamente");
      })
    }else{
      this.modelPreguntas = this.modelPreguntas.filter(function (_, index) {
        return index !== i;
      });
      this.modalService.showModal("Correcto", "Se Eliminó correctamente");
      this.selectedOptions[this.modelPreguntas.length - 1] = { id: 0, label: 'Seleccione una opción', value: '', icon: '' };
    }
  }

  cambiarEstado(i) {
    
    // this.selectObligatorio = false;
    if (this.cambiarEstadoSwitch) {
      this.selectObligatorio = false;
      this.cambiarEstadoSwitch = false;
      console.log("estadoooooooo", i)
    }
    // if (i == true && this.selectTarjeta == true) {
    //   this.selectObligatorio = true;
    //   // this.selectTarjeta = true;
    // }
  }

  actualizarrEncuesta() {
    console.log(this.modelPreguntas);
    this.modelPreguntas.forEach(elements => {
      var arrayTemporal: any = [];
      var arrayTemporal2: any = [];
      var arrayTemporal3: any = [];
      if (elements.TIPO === "radioButton") {
        elements.opcionesBoton.forEach(x => {
          if (x.esOpcion) {
            x.valorCheck = "Otro";
          }
          arrayTemporal.push(x.valorCheck);
        });
        elements.VALOR = arrayTemporal.join(";");
      }
      if (elements.TIPO === "checkbox") {
        elements.opcionesCheckbox.forEach(x => {
          if (x.esOpcion) {
            x.valorCheck = "Otro";
          }
          arrayTemporal2.push(x.valorCheck);
        });
        elements.VALOR = arrayTemporal2.join(";");
      }
      if (elements.TIPO === "desplegable") {
        elements.opcionesDesplegableEditar.forEach(x => {
          if (x.esOpcion) {
            x.valorCheck = "Otro";
          }
          arrayTemporal3.push(x.valorCheck);
        });
        elements.VALOR = arrayTemporal3.join(";");
      }
    })

    this.modeloEnvio.TITULO = this.tituloEditar;
    this.modeloEnvio.DESCRIPCION = this.descripcionEditar;
    this.modeloEnvio.MAE_ENCUESTA_PREGUNTAS = this.modelPreguntas;

   
    this.ApiService.saveEncuestaEditar(this.modeloEnvio).subscribe(x => {
      this.obtenerDatosEncuesta(this.idEncuesta);
      this.modalService.showModal("Correcto", "Se Actualizó correctamente");
    })
  }

  guardarEncuesta(){
    this.modelPreguntas.forEach(elements => {
      var arrayTemporal: any = [];
      var arrayTemporal2: any = [];
      var arrayTemporal3: any = [];
      if (elements.TIPO === "radioButton") {
        elements.opcionesBoton.forEach(x => {
          if (x.esOpcion) {
            x.valorCheck = "Otro";
          }
          arrayTemporal.push(x.valorCheck);
        });
        elements.VALOR = arrayTemporal.join(";");
      }
      if (elements.TIPO === "checkbox") {
        elements.opcionesCheckbox.forEach(x => {
          if (x.esOpcion) {
            x.valorCheck = "Otro";
          }
          arrayTemporal2.push(x.valorCheck);
        });
        elements.VALOR = arrayTemporal2.join(";");
      }
      if (elements.TIPO === "desplegable") {
        elements.opcionesDesplegableEditar.forEach(x => {
          if (x.esOpcion) {
            x.valorCheck = "Otro";
          }
          arrayTemporal3.push(x.valorCheck);
        });
        elements.VALOR = arrayTemporal3.join(";");
      }
    })

    this.modeloEnvio.TITULO = this.tituloEditar;
    this.modeloEnvio.DESCRIPCION = this.descripcionEditar;
    this.modeloEnvio.MAE_ENCUESTA_PREGUNTAS = this.modelPreguntas;
    this.modeloEnvio.ID_MAE_ENCUESTA = 0
    this.modeloEnvio.FK_ID_USUARIO = localStorage.getItem('Id'),

    this.ApiService.saveEncuesta(this.modeloEnvio)
    .subscribe( (d) => {
      this.modalService.showModal("ENCUESTA CREADA", "Se creó la encuesta correctamente");
      this.compartirEncuestaBtn = true;
      this.activarCompartirEncuesta.emit(this.compartirEncuestaBtn)
      this.ApiService.getEncuestas()
      .subscribe(response => {
        console.log(response)
        const encuestas = response as Array<any>;

        if (encuestas.length > 0) {
          this.ultimoID = encuestas[encuestas.length - 1].ID_MAE_ENCUESTA;
          this.ultimoIDChanged.emit(this.ultimoID)
          console.log('Último ID_MAE_ENCUESTA:', this.ultimoID);
        } else {
          console.log('No hay encuestas disponibles');
        }
      })
    });
  }
}