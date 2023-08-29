import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/servicios/api/api.service';
// import 'core-js/es/object';
import { Router } from '@angular/router';
import { Categoria } from '../../../utils/constants';
import { SpinnerService } from 'src/app/servicios/spinnerService/spinner.service';
import { NgxSpinnerModule } from 'ngx-spinner'; 
import { ConditionalExpr } from '@angular/compiler';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'

@Component({
  selector: 'app-app-caracterizacion',
  templateUrl: './app-caracterizacion.component.html',
  styleUrls: ['./app-caracterizacion.component.css']
})

export class AppCaracterizacionComponent implements OnInit {
  formParent!: FormGroup;
  otroControlA: FormControl;
  otroControlB: FormControl;
  otroControlC: FormControl;

  datos: any = [];
  preguntasDesordenadas: any = [];
  preguntasOrdenadas: any = [];

  municipios: any = [];

  dataSelect!: any[];
  dataOption!: any[];
  dataNorma!: any[];

  otherChecked: boolean = false;
  showDependency: boolean | any = false;

  showSostenibilidad: boolean | any = false;

  showPrestaServiciosAventura: boolean | any = false;
  mostrarInput = false;
  idCaracterizacionDinamicaCondicion!: any;
  categoriaRNTValues: string;
  valoresForm: any = [];
  numOfFields!: number;
  selectedOption: string;
  selectedOptions: string[] = [];
  seleccione: string = 'Seleccione una opción';

  aventuraSeleccionada: boolean = false;
  opcionesNorma: any[] = [];

  public mostrarMensaje: boolean = false;
  public templateGenerado: string = ''; // Variable de componente para almacenar el template generado
 
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private webPattern: any = /^(http:\/\/www\.|http:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  mostrarContenido: boolean;
  contenidoNTC6502: string;

  constructor(
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private http: HttpClient,
    private router: Router,
    private spinnerService: SpinnerService,
    private Message: ModalService,
  ) {}

ngOnInit(): void { 
  this.formParent = this.formBuilder.group({});
  this.getCaracterizacion();
  this.getPreguntasOrdenadas();
  this.http.get('https://www.datos.gov.co/resource/gdxc-w37w.json')
  .subscribe((data: any[]) => {
    this.municipios = data;
  });  
  //validar input-otro
  this.otroControlA = new FormControl('', [Validators.required]);
  this.otroControlB = new FormControl('', [Validators.required]);
  this.otroControlC = new FormControl('', [Validators.required]);
}

validarCampoOtroA() {
  return this.otroControlA.invalid && this.otroControlA.touched;
}

validarCampoOtroB() {
  return this.otroControlB.invalid && this.otroControlB.touched;
}

validarCampoOtroC() {
  return this.otroControlC.invalid && this.otroControlC.touched;
}
// validarCampoOtroA(index: number) {
//   return this.otroControlA[index].invalid && this.otroControlA[index].touched;
// }

// validarCampoOtroB(index: number) {
//   return this.otroControlB[index].invalid && this.otroControlB[index].touched;
// }

// validarCampoOtroC(index: number) {
//   return this.otroControlC[index].invalid && this.otroControlC[index].touched;
// }
getCaracterizacion(){
  this.ApiService.getData()
  // this.http.get('assets/datos.json')
  .subscribe((data: any) => {
    this.datos = data;
    this.preguntasDesordenadas = data.CAMPOS;

    // Obtiene el valor de "Categoría RNT" para el título
    const campoCategoriaRNT = this.datos.CAMPOS.find(campo => campo.NOMBRE === 'Categoría RNT');
    this.categoriaRNTValues = campoCategoriaRNT.VALUES;
    
    //Bloquear campos con valor
    this.datos.CAMPOS.forEach((campo:any) => {
      // campo.nombre !== 'Nombre del líder de sostenibilidad (opcional si es diferente al representante legal)' &&
      // campo.nombre !== 'Correo electrónico líder (Contacto opcional)' && campo.nombre !== 'Teléfono líder (Contacto opcional)'
      if(campo.VALUES !== null && campo.ID_CARACTERIZACION_DINAMICA !== '29'){
        this.formParent.addControl(campo.NOMBRE, new FormControl({value: campo.VALUES, disabled: true}))
      }
      else{
        this.formParent.addControl(campo.NOMBRE, new FormControl(null))          
      }
    });

    // for (let campo of this.datos.campos) {
    //   if (campo.requerido) {
    //     this.formParent.addControl(campo.nombre, this.formBuilder.control(''));
    //   }
    // }

    this.createFormControls();
    this.ordenarPreguntas();

  });
}

getPreguntasOrdenadas(){
  // this.http.get('assets/datos.json')
  this.ApiService.getOrdenCaracterizacion()
  .subscribe((data: any) => {
    this.preguntasOrdenadas = data.CAMPOS;
    this.ordenarPreguntas();

  });
}

ordenarPreguntas() {
  if (this.preguntasDesordenadas.length && this.preguntasOrdenadas.length) {
    this.preguntasOrdenadas = this.preguntasOrdenadas.map((orden: any) => {

      const pregunta = this.preguntasDesordenadas.find((pregunta: any) => pregunta.ID_CARACTERIZACION_DINAMICA === orden.FK_ID_CARACTERIZACION_DINAMICA);
      return {
        ...pregunta,
        ID_ORDEN: orden.ID_ORDEN
      };
    }).sort((a: any, b: any) => a.ID_ORDEN - b.ID_ORDEN);
  }
}

onChangeAventuraSeleccionada(value: boolean) {
    this.aventuraSeleccionada = value;
  
    if (this.aventuraSeleccionada) {
      // Si se seleccionó "SI", se muestra solo la norma que comienza con "NTC 6502"
      this.opcionesNorma = this.dataNorma.filter(
        opcion => opcion.norma && opcion.norma.startsWith('NTC 6502') ||
        opcion.norma.startsWith('NTC ISO 21101') ||
        opcion.norma.startsWith('NTC 6523')
      ).map(opcion => opcion.id);
    } else {
      // Si se seleccionó "NO", se muestran las tres normas
      this.opcionesNorma = this.dataNorma.filter(
        opcion => opcion.norma && (
          opcion.norma.startsWith('NTC 6502'))
      ).map(opcion => opcion.id);
    } 
}

printSelectedOption() {
  this.selectedOptions.push(this.selectedOption);
}

allFieldsFilled(): boolean {
  const campos = Object.values(this.formParent.value);
  const lleno = campos.every(campo => typeof campo === 'string' && campo.trim() !== '');
  return lleno;
}

createFormControls() {
  for (let campo of this.datos.CAMPOS) {
    let control = this.getControlType(campo);
    // this.formParent.addControl(control.nombre, new FormControl(control.value));
    if(campo.TIPO_DE_DATO === "referencia_id"){
      this.dataSelect = this.datos.CAMPOS
      .filter((campo: { RELATIONS: string; }) => campo.RELATIONS !== '{}' && campo.RELATIONS !== '')
      .flatMap((campo: { RELATIONS: any; }) => this.getTable(campo.RELATIONS))
      .reduce((prev: any, next: any) => prev.concat(next), []);
    }
    if(campo.TIPO_DE_DATO === "option"){
      this.dataOption = campo.DESPLEGABLE
      .filter((campo: { DESPLEGABLE: string; }) => campo.DESPLEGABLE !== '{}' && campo.DESPLEGABLE !== '')
      .flatMap((campo: { DESPLEGABLE: any; }) => this.getOption(campo.DESPLEGABLE))
      .reduce((prev: any, next: any) => prev.concat(next), []);
    }
    if(campo.TIPO_DE_DATO === "norma"){
      this.dataNorma = this.datos.CAMPOS
      .filter((campo: { RELATIONS: string; }) => campo.RELATIONS !== '{}' && campo.RELATIONS !== '')
      .flatMap((campo: { RELATIONS: any; }) => this.getNorma(campo.RELATIONS))
      .reduce((prev: any, next: any) => prev.concat(next), []);
    }
    this.formParent.addControl(campo.CAMPO_LOCAL, control);
  }
}

getTable(relations: any): any {
  if (typeof relations === 'string') {
    this.dataSelect = JSON.parse(relations).table;
    return this.dataSelect;
  } else {
    return relations;
  }
}

getOption(desplegable: any): any{
  if (typeof desplegable === 'string') {
    this.dataOption = JSON.parse(desplegable);
    return this.dataOption;
  } else {
    return desplegable;
  }
}

getNorma(relations: any): any {
  if (typeof relations === 'string') {
    this.dataNorma = JSON.parse(relations).table;
    return this.dataNorma;
  } else {
    return relations;
  }
}

getControlType(campo: any) {
  switch (campo.tipodedato) {
    case 'int':
      return new FormControl(campo.values);
    case 'local_reference_id':
      return new FormControl(campo.values);
    case 'referencia_id':
      return new FormControl(campo.values);
    case 'option':
      return new FormControl(campo.values);
    case 'string':
      return new FormControl(campo.values);
    case 'checkbox':
      return new FormControl(campo.values);
    case 'radio':
      return new FormControl(campo.values);
    case 'norma':
      return new FormControl(campo.values);
    case 'municipio':
      return new FormControl(campo.values);
    default:
      return new FormControl('');
  }
}

capturarValor(id: string | number, valor: any, idcaracterizaciondinamica: any) {
  const result = this.valoresForm.find((o: any) => o.id === id);
  if (result) {
    result.valor = valor;
  }else{
    this.valoresForm.push({
      "id": id,
      "valor": valor,
      "idUsuarioPst": localStorage.getItem('Id'),
      "idCategoriaRnt": localStorage.getItem('idCategoria'),
      "idCaracterizacion": 1 //id de la pregunta
    });
  }
}

hasDepency(id: number) {
  const campos = this.datos.campos;
  const dictionay = new Map(campos.map(d => [d.idcaracterizaciondinamica, d]));
  return dictionay.has(+id);
}

public saveForm(){
    this.mostrarMensaje = true;
    if (this.formParent.valid) {

      this.ApiService.saveData(this.valoresForm).subscribe((data: any) => {
        const title = "Se guardó correctamente";
        const message = "El formulario se ha guardado exitosamente"
        this.Message.showModal(title,message);
        // borrar
        
        
        //
        this.router.navigate(['/dashboard']);
      });
    }
}

}
