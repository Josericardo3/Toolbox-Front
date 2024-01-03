import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormService } from 'src/app/servicios/form/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forEach } from 'lodash';
// import { elements } from 'chart.js';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ComunicacionService } from 'src/app/servicios/comunicacion/comunicacion.service';
import { Subscription } from 'rxjs';


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

  //Enviar del hijo al padre
  @Output() eliminarTarjeta = new EventEmitter<number>();
  @Output() tarjetaClicada = new EventEmitter<number>();
  @Output() formularioCompletado = new EventEmitter<FormGroup>();
  @Output() tarjetaCompletada = new EventEmitter<any>();
  @Output() ultimoIDChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() activarCompartirEncuesta: EventEmitter<any> = new EventEmitter<any>();

  //Recibir del padre al hijo
  @Input() index: number | undefined;
  @Input() valoresPreguntas: any = [];
  @Input() editandoEncuesta: boolean = false;
  @Input() datosPreguntaEncuesta: any[];
  @Input() tituloEditar: any = "";
  @Input() descripcionEditar: any = "";
  @Input() selectCrearTarjeta: boolean = false;
  @Input() activarTitulos: boolean = true;

  public form: FormGroup;
  hayopcion: any = true;
  valoresPreguntass: any = [];
  showOtro: boolean = false;
  addInput: boolean = false;
  selectedOption: Option = { id: 0, label: 'Seleccione una opción', value: '', icon: '' };
  selectedOptionEditar: any = [{ id: 0, label: 'Seleccione una opción', value: '', icon: '' }]
  showOptions = false;
  showOptionEditar:boolean=false;
  selectedOptions: any = [];
  showOptionss: any = [];
  inputs: any[] = [];
  isOn: boolean = false;
  modeloEnvio: any = {};
  idEncuesta: any = 0;
  options: Option[] = [
    { id: 1, label: 'Respuesta corta', value: 'respuestaCorta', icon: 'fa-solid fa-minus' },
    { id: 2, label: 'Respuesta larga', value: 'respuestaLarga', icon: 'fa-solid fa-grip-lines' },
    { id: 3, label: 'Varias opciones', value: 'radioButton', icon: 'fa-regular fa-circle-dot' },
    { id: 4, label: 'Casillas', value: 'checkbox', icon: 'fa-regular fa-square-check' },
    { id: 5, label: 'Desplegable', value: 'desplegable', icon: 'fa-solid fa-circle-arrow-down' }
  ];
  modelPreguntas: any = [{ IDUNICO: 1, opcionesBoton: [], opcionesCheckbox: [], opcionesDesplegableEditar: [] , icon:'', label: 'Seleccione una opción'}];
  selectTarjeta: boolean = false;
  selectObligatorio: boolean = true;
  ultimoID: any;
  compartirEncuestaBtn: boolean = false;
  cambiarEstadoSwitch: boolean = false;
  subscription: Subscription;
 
  constructor(
    private ApiService: ApiService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private comunicacionService: ComunicacionService
  ) { 
    this.subscription = this.comunicacionService.notifyChild$.subscribe(() => {
      this.handleNotifyChild();
    });
  }

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
          this.idEncuesta = params['id'];
        }
      });
      //this.completarFormularioEdicion();
      console.log(this.editandoEncuesta)
    }
    else {
      /*this.selectOptionEditar(this.selectedOptionEditar[0], 0, [])
      this.toggleOptionsEditar(0);*/
    }

    this.onInputChange(this.form);
  }

  handleNotifyChild() {
    // Realiza cualquier acción necesaria en el hijo cuando es notificado por el padre
    console.log('Notificado por el padre en el hijo.');
    this.selectObligatorio = this.activarTitulos;
  }

  obtenerDatosEncuesta(encuestaId: string) {
    this.ApiService.getEncuestasRespuesta(encuestaId)
      .subscribe(respuesta => {
        this.modeloEnvio.ID_MAE_ENCUESTA = respuesta.ID_MAE_ENCUESTA;

        this.modeloEnvio.MAE_ENCUESTA_PREGUNTAS = respuesta.MAE_ENCUESTA_PREGUNTAS;

        this.valoresPreguntass = respuesta.MAE_ENCUESTA_PREGUNTAS;
        this.modelPreguntas = respuesta.MAE_ENCUESTA_PREGUNTAS;

        const tarjetasOrdenadas = [...this.modelPreguntas]; // Crear una copia del array original
        tarjetasOrdenadas.sort((a, b) => a.ORDEN - b.ORDEN);

        this.modelPreguntas = tarjetasOrdenadas.map(function (pregunta) {
          return { ...pregunta, IDUNICO: pregunta.ID_MAE_ENCUESTA_PREGUNTA, opcionesBoton: [], opcionesCheckbox: [], opcionesDesplegableEditar: [] };
        });
        /*this.completarFormularioEdicion();*/
        this.completarFormularioValores();
        this.completarOpcionesSellecionada();

      });
  }
completarOpcionesSellecionada(){
  this.modelPreguntas.forEach(elements => {
    if (elements.TIPO === "radioButton") {
      elements.icon=this.options.filter(x => x.value == elements.TIPO)[0].icon;
      elements.label=this.options.filter(x => x.value == elements.TIPO)[0].label;
    }
    if (elements.TIPO === "checkbox") {
      elements.icon=this.options.filter(x => x.value == elements.TIPO)[0].icon;
      elements.label=this.options.filter(x => x.value == elements.TIPO)[0].label;
    }
    if (elements.TIPO === "desplegable") {
      elements.icon=this.options.filter(x => x.value == elements.TIPO)[0].icon;
      elements.label=this.options.filter(x => x.value == elements.TIPO)[0].label;
    }
    if (elements.TIPO === "respuestaCorta") {
      elements.icon=this.options.filter(x => x.value == elements.TIPO)[0].icon;
      elements.label=this.options.filter(x => x.value == elements.TIPO)[0].label;
    }
    if (elements.TIPO === "respuestaLarga") {
      elements.icon=this.options.filter(x => x.value == elements.TIPO)[0].icon;
      elements.label=this.options.filter(x => x.value == elements.TIPO)[0].label;
    }
  });
  console.log("nuevos elementos", this.modelPreguntas)
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

  toggleOptionsEditar(pregunta: any) {
    pregunta.showOptionEditar=true;
    this.showOptionEditar = !this.showOptionEditar;
  }

  
  selectOptionEditar(option: Option, id: any, pregunta: any) {
    // this.selectTarjeta = true;
    this.showOptionss = false;
    pregunta.showOptionEditar=false;
    this.selectedOptions = option;
    pregunta.TIPO = option.value;
    if (option.value === 'respuestaCorta' || option.value === 'respuestaLarga' || option.value === 'radioButton'
      || option.value === 'checkbox' || option.value === 'desplegable') {

      // Establecer el campo VALOR a una cadena vacía ('')
      pregunta.VALOR = '';
      this.selectTarjeta = true;
    }
    if (pregunta.opcionesBoton.length < 1) {
      pregunta.opcionesBoton.push({})
    }
    if (pregunta.opcionesCheckbox.length < 1) {
      pregunta.opcionesCheckbox.push({})
    }
    if (pregunta.opcionesDesplegableEditar.length < 1) {
      pregunta.opcionesDesplegableEditar.push({})
    }
pregunta.icon=option.icon;
pregunta.label=option.label;
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
    else {
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
    var existeOtro = false;
    for (let index = 0; index < this.modelPreguntas[i].opcionesBoton.length; index++) {
      if (this.modelPreguntas[i].opcionesBoton[index].esOpcion == true && opcion) {
        this.removeRadioOptions(i, index);
        return;
      }
    }

    for (let index = 0; index < this.modelPreguntas[i].opcionesBoton.length; index++) {
      if (this.modelPreguntas[i].opcionesBoton[index].esOpcion == true) {
        existeOtro = true;
        this.removeRadioOptions(i, index);
      }
    }
    if (opcion) {

      this.showOtro = !this.showOtro;
      this.modelPreguntas[i].opcionesBoton.push({ esOpcion: true });
    } else {


      this.modelPreguntas[i].opcionesBoton.push({ esOpcion: false, nombre: 'opcion' });
      if (existeOtro) {
        this.modelPreguntas[i].opcionesBoton.push({ esOpcion: true });
      }
    }
  }

  agregarOtrosCheck(pregunta: any, i: any, opcion) {
    var existeOtro = false;
    for (let index = 0; index < this.modelPreguntas[i].opcionesCheckbox.length; index++) {
      if (this.modelPreguntas[i].opcionesCheckbox[index].esOpcion == true && opcion) {
        this.removeCheckOptions(i, index);
        return;
      }

    }
    for (let index = 0; index < this.modelPreguntas[i].opcionesCheckbox.length; index++) {
      if (this.modelPreguntas[i].opcionesCheckbox[index].esOpcion == true) {
        existeOtro = true;
        this.removeCheckOptions(i, index);
      }
    }
    if (opcion) {
      this.showOtro = !this.showOtro;
      this.modelPreguntas[i].opcionesCheckbox.push({ esOpcion: true });
    } else {
      this.modelPreguntas[i].opcionesCheckbox.push({ esOpcion: false, nombre: 'opcion' });
      if (existeOtro) {
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

  generarUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  agregarotro(i) {
    this.selectObligatorio = false;
    this.cambiarEstadoSwitch = false;
    let defaultOption = { id: 0, label: 'Seleccione una opción', value: '', icon: '' };
    // Obtén el orden actual máximo
    const maxOrder = Math.max(...this.modelPreguntas.map((pregunta) => pregunta.ORDEN));

    if (i != 0 && i != (this.modelPreguntas.length - 1)) {
      const newOrder = maxOrder + 1;
      this.modelPreguntas.splice(i+1, 0, { IDUNICO: this.generarUUID(), FK_MAE_ENCUESTA: 0, ID_MAE_ENCUESTA_PREGUNTA: 0, OBLIGATORIO: false, opcionesBoton: [], opcionesCheckbox: [], opcionesDesplegableEditar: [],       
        icon:this.selectedOptionEditar[0].icon,
      label:this.selectedOptionEditar[0].label  });

      // Establecer todas las opciones en 'Seleccione una opción'
      this.selectedOptions.splice(i+1, 0, { ...defaultOption });

    } else if (i == this.modelPreguntas.length - 1) {
      const newOrder = maxOrder + 1;
      // Agregar después
      this.modelPreguntas.push({ IDUNICO: this.generarUUID(), FK_MAE_ENCUESTA: 0, ID_MAE_ENCUESTA_PREGUNTA: 0, OBLIGATORIO: false, opcionesBoton: [], opcionesCheckbox: [], opcionesDesplegableEditar: [],       
        icon:this.selectedOptionEditar[0].icon,
      label:this.selectedOptionEditar[0].label  });

      // Establecer la nueva opción en 'Seleccione una opción'
      this.selectedOptions.push({ ...defaultOption });
  

    } else if (i == 0) {
      const newOrder = maxOrder + 1;
      this.modelPreguntas.splice(1, 0, { IDUNICO: this.generarUUID(), FK_MAE_ENCUESTA: 0, ID_MAE_ENCUESTA_PREGUNTA: 0, OBLIGATORIO: false, opcionesBoton: [], opcionesCheckbox: [], opcionesDesplegableEditar: [],       
        icon:this.selectedOptionEditar[0].icon,
      label:this.selectedOptionEditar[0].label  });
      console.log("tamañooo", this.modelPreguntas.length);

      // Establecer la nueva opción en 'Seleccione una opción'
      this.selectedOptions.splice(1, 0, { ...defaultOption });

      // Restablecer options con la opción por defecto
      // this.options = [{ ...defaultOption }];
      this.options = [
        { id: 1, label: 'Respuesta corta', value: 'respuestaCorta', icon: 'fa-solid fa-minus' },
        { id: 2, label: 'Respuesta larga', value: 'respuestaLarga', icon: 'fa-solid fa-grip-lines' },
        { id: 3, label: 'Varias opciones', value: 'radioButton', icon: 'fa-regular fa-circle-dot' },
        { id: 4, label: 'Casillas', value: 'checkbox', icon: 'fa-regular fa-square-check' },
        { id: 5, label: 'Desplegable', value: 'desplegable', icon: 'fa-solid fa-circle-arrow-down' }
      ]
    }

    this.selectTarjeta = false;
  }

  actualizarInput(){
    this.selectObligatorio = false;
  }

  eliminar(i, pregunta) {
    if (pregunta.ID_MAE_ENCUESTA_PREGUNTA != 0) {
      this.ApiService.deletePregunta(pregunta.ID_MAE_ENCUESTA_PREGUNTA).subscribe(x => {
        // this.obtenerDatosEncuesta(this.idEncuesta);
        this.modelPreguntas = this.modelPreguntas.filter(x => pregunta.ID_MAE_ENCUESTA_PREGUNTA != x.ID_MAE_ENCUESTA_PREGUNTA);
        this.modalService.showModal("Correcto", "Se Eliminó correctamente");
        // this.selectedOptions[this.modelPreguntas.length - 1] = { id: 0, label: 'Seleccione una opción', value: '', icon: '' };
      })
    } else {
      console.log(this.modelPreguntas)
      this.modelPreguntas = this.modelPreguntas.filter(x => pregunta.IDUNICO != x.IDUNICO);
      console.log(this.modelPreguntas)
      this.modalService.showModal("Correcto", "Se Eliminó correctamente");
      // this.selectedOptions[this.modelPreguntas.length - 1] = { id: 0, label: 'Seleccione una opción', value: '', icon: '' };
    }
  }

  // eliminar(i, pregunta) {
  //   if (pregunta.ID_MAE_ENCUESTA_PREGUNTA != 0) {
  //     this.ApiService.deletePregunta(pregunta.ID_MAE_ENCUESTA_PREGUNTA).subscribe(x => {
  //       this.obtenerDatosEncuesta(this.idEncuesta);
  //       this.modalService.showModal("Correcto", "Se Eliminó correctamente");
  //     });
  //   } else {
  //     // Almacena la opción seleccionada de la tarjeta que se va a eliminar
  //     const opcionSeleccionadaAntesDeEliminar = this.selectedOptions[i];
  
  //     this.modelPreguntas = this.modelPreguntas.filter(function (_, index) {
  //       return index !== i;
  //     });
  
  //     // Restaura la opción seleccionada para las tarjetas restantes
  //     this.selectedOptions.splice(i, 1);
  
  //     // Si la tarjeta eliminada no es la última, restablece la opción para la nueva última tarjeta
  //     if (i < this.modelPreguntas.length) {
  //       this.selectedOptions[this.modelPreguntas.length - 1] = opcionSeleccionadaAntesDeEliminar;
  //     }
  
  //     this.modalService.showModal("Correcto", "Se Eliminó correctamente");
  //   }
  // }
  
  
  cambiarEstado(i) {
    if (this.cambiarEstadoSwitch) {
      this.selectObligatorio = false;
      this.cambiarEstadoSwitch = false;
      console.log("estadoooooooo", i)
    }
  }

  actualizarrEncuesta() {
    console.log(this.modelPreguntas);
    var orden = 0;
    this.modelPreguntas.forEach(elements => {
      orden = orden + 1;
      elements.ORDEN = orden;
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
    console.log(this.modeloEnvio)
    this.ApiService.saveEncuestaEditar(this.modeloEnvio).subscribe(x => {
      this.obtenerDatosEncuesta(this.idEncuesta);
      this.modalService.showModal("Correcto", "Se Actualizó correctamente");
      this.selectObligatorio = true;
    })
  }

  guardarEncuesta() {
    let ordenCounter = 0;
    this.modelPreguntas.forEach((elements: any, index: any) => {
      ordenCounter = ordenCounter + 1;
      elements.ORDEN = ordenCounter;
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
    this.modeloEnvio.ID_MAE_ENCUESTA = 0;
    this.modeloEnvio.FK_ID_USUARIO = localStorage.getItem('Id');

    console.log(this.modeloEnvio)
    this.ApiService.saveEncuesta(this.modeloEnvio).subscribe((d) => {
      this.modalService.showModal("ENCUESTA CREADA", "Se creó la encuesta correctamente");
      this.compartirEncuestaBtn = true;
      this.activarCompartirEncuesta.emit(this.compartirEncuestaBtn)
      this.ApiService.getEncuestas().subscribe(response => {
        console.log(response)
        const encuestas = response as Array<any>;

        if (encuestas.length > 0) {
          this.ultimoID = encuestas[0].ID_MAE_ENCUESTA;
          this.ultimoIDChanged.emit(this.ultimoID)
          console.log('Último ID_MAE_ENCUESTA:', this.ultimoID);
        } else {
          console.log('No hay encuestas disponibles');
        }
      })
    });
  }
}