import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { FormService } from 'src/app/servicios/form/form.service';
import { ActivatedRoute } from '@angular/router';

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
  valoresPreguntass:any=[];

  public form: FormGroup;
  public formEditar: FormGroup;
  showOtro: boolean = false;
  addInput: boolean =  false;
  selectedOption: Option = { id: 0, label: 'Seleccione una opción', value: '', icon: '' };
  selectedOptionEditar: any = [{ id: 0, label: 'Seleccione una opción', value: '', icon: '' }]
  showOptions = false;
  showOptionEditar = []
  // selectedOption: Option = { label: 'Seleccione una opción', value: '', icon: '' };
  selectedOptions:any=[];
  showOptionss:any = [];
  inputs: any[] = [];
  isOn: boolean = false;
  options: Option[] = [
    { id: 1, label: 'Respuesta corta', value: 'respuestaCorta', icon: 'fa-solid fa-minus' },
    { id: 2, label: 'Respuesta larga', value: 'respuestaLarga', icon: 'fa-solid fa-grip-lines' },
    { id: 3, label: 'Varias opciones', value: 'radioButton', icon: 'fa-regular fa-circle-dot' },
    { id: 4, label: 'Casillas', value: 'checkbox', icon: 'fa-regular fa-square-check' },
    { id: 5, label: 'Desplegable', value: 'desplegable', icon: 'fa-solid fa-circle-arrow-down' }
  ];

  constructor(
    private ApiService: ApiService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.formulario();
    
    if (this.editandoEncuesta) {
      this.activatedRoute.params.subscribe(params => {
        if (params['id']) {
          this.editandoEncuesta = true;
          this.obtenerDatosEncuesta(params['id']);
          // this.valoresPreguntas = this.datosPreguntaEncuesta?.MAE_ENCUESTA_PREGUNTAS.map(pregunta => pregunta.VALOR) || [];
        }
      });
      this.completarFormularioEdicion();
      console.log(this.editandoEncuesta)
    }
  }

  obtenerDatosEncuesta(encuestaId: string) {
    this.ApiService.getEncuestasRespuesta(encuestaId)
    .subscribe(respuesta => {
    /*  this.datosPreguntaEncuesta = respuesta;     
      this.valoresPreguntas = this.datosPreguntaEncuesta.MAE_ENCUESTA_PREGUNTAS;
      console.log(this.valoresPreguntas);*/
      this.valoresPreguntass = respuesta.MAE_ENCUESTA_PREGUNTAS;
      console.log("hhhhhhhh",this.valoresPreguntass)
      this.completarFormularioEdicion();
    });
  }
  
  ngAfterViewInit() {
    this.completarFormulario();
    // if (!this.editandoEncuesta) {
    //   this.completarFormulario();
    // }
  }

  formulario(){
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
    console.log("TARJETA", this.valoresPreguntas)
    // this.formEditar = this.formBuilder.group({
    //   preguntaEditar: [''],
    //   respuestaCortaEditar: [''],
    //   respuestaLargaEditar: [''],
    //   opcion1RadioEditar: [''],
    //   otroRadioEditar: [''],
    //   opcionesRadioEditar: this.formBuilder.array([]),
    //   opcion1CheckboxEditar: [''],
    //   otroCheckboxEditar: [''],
    //   opcionesCheckboxEditar: this.formBuilder.array([]),
    //   desplegableOpcion1Editar: [''],
    //   opcionesDesplegableEditar: this.formBuilder.array([]),
    //   obligatorioEditar: [false],
    // });
    this.formEditar = this.formBuilder.group({});
    this.valoresPreguntass.forEach((pregunta, index) => {
      const formControlName = `preguntaEditar_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`;
      this.formEditar.addControl(formControlName, new FormControl(pregunta.DESCRIPCION));

      if (pregunta.TIPO === 'respuestaCorta') {
        const respuestaCortaControlName = `respuestaCortaEditar_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`;
        this.formEditar.addControl(respuestaCortaControlName, new FormControl(pregunta.VALOR));
      } else if (pregunta.TIPO === 'respuestaLarga') {
        const respuestaLargaControlName = `respuestaLargaEditar_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`;
        this.formEditar.addControl(respuestaLargaControlName, new FormControl(pregunta.VALOR));
      } else if (pregunta.TIPO === 'radioButton') {
        const opciones = pregunta.VALOR.split(';');
        const primeraOpcion = opciones[0];
        const otrasOpciones = opciones.slice(1).filter(opcion => opcion !== 'Otro');
  
        // const opcion1RadioControlName = `opcion1RadioEditar_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`;
        // this.formEditar.addControl(opcion1RadioControlName, new FormControl(primeraOpcion));
  
        // const opcionesRadioControlName = `opcionesRadioEditar_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`;
        // const opcionesRadioArray = this.formBuilder.array(otrasOpciones.map(opcion => new FormControl(opcion)));
        // this.formEditar.addControl(opcionesRadioControlName, opcionesRadioArray);
  
        // const otroRadioControlName = `otroRadioEditar_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`;
        // this.formEditar.addControl(otroRadioControlName, new FormControl(''));

  
        // const opcionesRadioControlName = `opcionesRadioEditar_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`;
        // const opcionesRadioArray = this.formBuilder.array(opciones.slice(1).map(opcion => new FormControl(opcion)));
        // this.formEditar.addControl(opcionesRadioControlName, opcionesRadioArray);
  
        // const otroRadioControlName = `otroRadioEditar_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`;
        // this.formEditar.addControl(otroRadioControlName, new FormControl(''));
      } else if (pregunta.TIPO === 'checkbox') {
        
      } else if (pregunta.TIPO === 'desplegable') {

      }
  });  

    console.log("entraaaa")
    for(var i=0; i<this.valoresPreguntass.length; i++){
      console.log("rrrrrrr")
      var tipo = this.valoresPreguntass[i].TIPO;
      var seleccionado = this.options.filter(x=>x.value==tipo);
      this.selectedOptions[i] = seleccionado[0];
    }
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  toggleOptionsEditar(id: any){
    this.showOptionEditar[id] = !this.showOptionEditar[id];
    console.log('uuuuuuu', id)
  }

  selectOptionEditar(option: Option, id: any){
    // this.selectedOption[id] = option;
    // this.showOptionEditar[id] = false;
    console.log('aaaaaaaa', this.selectedOption[id], option)
    console.log("TARJETA", this.valoresPreguntas)
    this.showOptionss[id] = false;
    this.selectedOptions[id] = option;
    
    console.log('uuuuuuu', option)
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
    this.selectedOption = option;
    this.showOptions = false;
  }
  
  agregarOtro(){
    this.showOtro = !this.showOtro;
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

  get opcionesRadioEditar(): FormArray {
    return this.form.get('opcionesRadioEditar') as FormArray;
  }

  get opcionesCheckbox(): FormArray {
    return this.form.get('opcionesCheckbox') as FormArray;
  }

  get opcionesCheckboxEditar(): FormArray {
    return this.form.get('opcionesCheckboxEditar') as FormArray;
  }

  get opcionesDesplegable(): FormArray {
    return this.form.get('opcionesDesplegable') as FormArray;
  }

  get opcionesDesplegableEditar(): FormArray {
    return this.form.get('opcionesDesplegableEditar') as FormArray;
  }

  agregarInputRadio() {
    this.opcionesRadio.push(this.formBuilder.control(''));
  }

  agregarInputCheckbox(){
    this.opcionesCheckbox.push(this.formBuilder.control(''));
  }

  agregarInputDesplegable(){
    this.opcionesDesplegable.push(this.formBuilder.control(''));
  }

  agregarInputDesplegableEditar(){
    this.opcionesDesplegableEditar.push(this.formBuilder.control(''));
  }

  removeRadioOption(index: number) {
    this.opcionesRadio.removeAt(index);
    this.opcionesCheckbox.removeAt(index);
    this.opcionesDesplegable.removeAt(index);
  }
}