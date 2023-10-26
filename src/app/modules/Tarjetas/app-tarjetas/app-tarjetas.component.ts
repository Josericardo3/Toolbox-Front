import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { FormService } from 'src/app/servicios/form/form.service';

interface Option {
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

  public form: FormGroup;
  showOtro: boolean = false;
  addInput: boolean =  false;
  selectedOption: Option = { label: 'Seleccione una opción', value: '', icon: '' };
  showOptions = false;
  inputs: any[] = [];
  isOn: boolean = false;
  options: Option[] = [
    { label: 'Respuesta corta', value: 'respuestaCorta', icon: 'fa-solid fa-minus' },
    { label: 'Respuesta larga', value: 'respuestaLarga', icon: 'fa-solid fa-grip-lines' },
    { label: 'Varias opciones', value: 'radioButton', icon: 'fa-regular fa-circle-dot' },
    { label: 'Casillas', value: 'checkbox', icon: 'fa-regular fa-square-check' },
    { label: 'Desplegable', value: 'desplegable', icon: 'fa-solid fa-circle-arrow-down' }
  ];

  constructor(
    private ApiService: ApiService,
    private formBuilder: FormBuilder,
    private formService: FormService,
  ) {}

  ngOnInit() {
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
  
  ngAfterViewInit() {
    this.completarFormulario();
  }

  completarFormulario() { 
    let valor = '';
    let tipo = '';
  
    if (this.selectedOption.value === 'respuestaCorta') {
      valor = this.form.get('respuestaCorta').value.toString();
      tipo = 'respuestaCorta';
    } else if (this.selectedOption.value === 'respuestaLarga') {
      valor = this.form.get('respuestaLarga').value.toString();
      tipo = 'respuestaLarga';
    } else if (this.selectedOption.value === 'radioButton') {
      const opcion1Radio = this.form.get('opcion1Radio').value.toString();
      const otroRadio = this.form.get('otroRadio').value.toString();
      const opcionesRadioArray = this.form.get('opcionesRadio') as FormArray;
      const opcionesValores = opcionesRadioArray.controls.map(control => control.value.toString());  
      
      // Verificar si la primera opción está vacía antes de concatenar
      if (opcion1Radio) {
        valor = opcion1Radio;
      }
      if (otroRadio) {
        valor += ';' + otroRadio;
      }
      if (opcionesValores.length > 0) {
        valor += ';' + opcionesValores.join(';');
      }
      
      tipo = 'radioButton';
    } else if (this.selectedOption.value === 'checkbox') {
      const opcion1Checkbox = this.form.get('opcion1Checkbox').value.toString();
      const otroCheckbox = this.form.get('otroCheckbox').value.toString();
      const opcionesCheckboxArray = this.form.get('opcionesCheckbox') as FormArray;
      const opcionesValores = opcionesCheckboxArray.controls.map(control => control.value.toString());  
      
      // Verificar si la primera opción está vacía antes de concatenar
      if (opcion1Checkbox) {
        valor = opcion1Checkbox;
      }
      if (otroCheckbox) {
        valor += ';' + otroCheckbox;
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
  
    return {
        "ID_MAE_ENCUESTA_PREGUNTA": 0,
        "FK_MAE_ENCUESTA": 0,
        "DESCRIPCION": this.form.get('pregunta').value.toString(),
        "TIPO": tipo.toString(),
        "VALOR": valor,
        "OBLIGATORIO": this.form.get('obligatorio').value,
    };
  }
    

  // completarFormulario() { 
  //   let valor = '';
  //   let tipo = '';

  //   if (this.selectedOption.value === 'respuestaCorta') {
  //     valor = this.form.get('respuestaCorta').value.toString();
  //     tipo = 'respuestaCorta';
  //   } else if (this.selectedOption.value === 'respuestaLarga') {
  //     valor = this.form.get('respuestaLarga').value.toString();
  //     tipo = 'respuestaLarga';
  //   } else if (this.selectedOption.value === 'radioButton') {
  //     const opcion1Radio = this.form.get('opcion1Radio').value.toString();
  //     const otroRadio = this.form.get('otroRadio').value.toString();
  //     const opcionesRadioArray = this.form.get('opcionesRadio') as FormArray;
  //     const opcionesValores = opcionesRadioArray.controls.map(control => control.value.toString());  
  //     valor = [opcion1Radio, otroRadio, ...opcionesValores].join(';');
  //     tipo = 'radioButton';
  //   } else if (this.selectedOption.value === 'checkbox') {
  //     const opcion1Checkbox = this.form.get('opcion1Checkbox').value.toString();
  //     const otroCheckbox = this.form.get('otroCheckbox').value.toString();
  //     const opcionesCheckboxArray = this.form.get('opcionesCheckbox') as FormArray;
  //     const opcionesValores = opcionesCheckboxArray.controls.map(control => control.value.toString());  
  //     valor = [opcion1Checkbox, otroCheckbox, ...opcionesValores].join(';');
  //     tipo = 'checkbox';
  //   } else if (this.selectedOption.value === 'desplegable') {
  //     const desplegableOpcion1 = this.form.get('desplegableOpcion1').value.toString();
  //     const opcionesDesplegableArray = this.form.get('opcionesDesplegable') as FormArray;
  //     const opcionesValores = opcionesDesplegableArray.controls.map(control => control.value.toString());  
  //     valor = [desplegableOpcion1, ...opcionesValores].join(';');
  //     tipo = 'desplegable';
  //   }

  //   return {
  //       "ID_MAE_ENCUESTA_PREGUNTA": 0,
  //       "FK_MAE_ENCUESTA": 0,
  //       "DESCRIPCION": this.form.get('pregunta').value.toString(),
  //       "TIPO": tipo.toString(),
  //       "VALOR": valor,
  //       "OBLIGATORIO": this.form.get('obligatorio').value,
  //   };
  // }

  eliminarInput(controlName: string, index: number) {
    const controlArray = this.form.get(controlName) as FormArray;
    controlArray.removeAt(index);

  }
  
  toggleOptions() {
    this.showOptions = !this.showOptions;
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

  agregarInputCheckbox(){
    this.opcionesCheckbox.push(this.formBuilder.control(''));
  }

  agregarInputDesplegable(){
    this.opcionesDesplegable.push(this.formBuilder.control(''));
  }

  removeRadioOption(index: number) {
    this.opcionesRadio.removeAt(index);
    this.opcionesCheckbox.removeAt(index);
    this.opcionesDesplegable.removeAt(index);
  }
}