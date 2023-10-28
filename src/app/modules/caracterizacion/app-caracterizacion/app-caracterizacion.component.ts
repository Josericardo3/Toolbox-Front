import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from 'src/app/servicios/api/api.service';
// import 'core-js/es/object';
import { Router } from '@angular/router';
import { Categoria } from '../../../utils/constants';
import { SpinnerService } from 'src/app/servicios/spinnerService/spinner.service';
import { NgxSpinnerModule } from 'ngx-spinner'; 
import { ConditionalExpr } from '@angular/compiler';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ColorLista } from 'src/app/servicios/api/models/color';
import { throws } from 'assert';

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
  otroControlRed: FormControl;
  facebook: FormControl;
  twitter: FormControl;
  instagram: FormControl;
  tiktok: FormControl;
  mostrarInputsRedesSociales: { [key: string]: boolean } = {
    'FACEBOOK': false,
    'TWITTER': false,
    'INSTAGRAM': false,
    'TIKTOK': false,
  };
  concatenacionRedesSociales: any = "";
  respuestasRedesSociales: { [key: string]: string } = {};
  seleccionesPorPregunta: { [key: string]: string } = {};
  opcionesAgrupadas: any[] = [];
  
  datos: any = [];
  preguntasDesordenadas: any = [];
  preguntasOrdenadas: any = [];
  idUser: any;
  municipios: any = [];
  arrNormas: any;
  arrResult: any;

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
  public templateGenerado: string = '';
 
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private webPattern: any = /^(http:\/\/www\.|http:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  mostrarContenido: boolean;
  contenidoNTC6502: string;
  colorTitle:ColorLista;
  colorWallpaper:ColorLista;

  constructor(
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private http: HttpClient,
    private router: Router,
    private spinnerService: SpinnerService,
    private Message: ModalService,
  ) {}

ngOnInit(): void { 
  const id = Number(window.localStorage.getItem('Id'));
  this.colorTitle = JSON.parse(localStorage.getItem("color")).title;
  this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;

  this.ApiService.validateCaracterizacion(id).subscribe((data: any)=>{
    if(data === true){
      this.router.navigate(['/dashboard']);
    }
    else{
      this.formParent = this.formBuilder.group({});
      this.getCaracterizacion();
      this.getPreguntasOrdenadas();
      this.http.get('https://www.datos.gov.co/resource/gdxc-w37w.json')
      .subscribe((data: any[]) => {
        this.municipios = data;
      });  
    }
  })

  //validar input-otro
  this.otroControlA = new FormControl('', [Validators.required]);
  this.otroControlB = new FormControl('', [Validators.required]);
  this.otroControlC = new FormControl('', [Validators.required]);
  this.facebook = new FormControl('', [Validators.required]);
  this.twitter = new FormControl('', [Validators.required]);
  this.instagram = new FormControl('', [Validators.required]);
  this.tiktok = new FormControl('', [Validators.required]);
}

toggleMostrarInputRedesSociales(opcion: string) {
  this.mostrarInputsRedesSociales[opcion] = !this.mostrarInputsRedesSociales[opcion];
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

validarCampoOtroRed() {
  return  this.otroControlRed.touched;
}

getCaracterizacion(){
  this.ApiService.getData()
  .subscribe((data: any) => {
    this.datos = data;
    this.preguntasDesordenadas = data.CAMPOS;
    // Obtiene el valor de "Categoría RNT" para el título
    const campoCategoriaRNT = this.datos.CAMPOS.find(campo => campo.NOMBRE === 'Categoría RNT');
    this.categoriaRNTValues = campoCategoriaRNT.VALUES;
    
    //Bloquear campos con valor
    this.datos.CAMPOS.forEach((campo:any) => {
      if(campo.VALUES !== null && campo.ID_CARACTERIZACION_DINAMICA !== '29'){
        this.formParent.addControl(campo.NOMBRE, new FormControl({value: campo.VALUES, disabled: true}))
      }
      else{
        this.formParent.addControl(campo.NOMBRE, new FormControl(null))          
      }
    });

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
      debugger;
      this.opcionesNorma = this.dataNorma.filter(
        opcion => opcion.NORMA && opcion.NORMA.startsWith('NTC 6502') ||
        opcion.NORMA.startsWith('NTC ISO 21101') ||
        opcion.NORMA.startsWith('NTC 6523')
      ).map(opcion => opcion.ID_NORMA);
    } else {
      // Si se seleccionó "NO", se muestran las tres normas
      this.opcionesNorma = this.dataNorma.filter(
        opcion => opcion.NORMA && (
          opcion.NORMA.startsWith('NTC 6502'))
      ).map(opcion => opcion.ID_NORMA);
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

capturarValor(id: string | number, valor: any, idcaracterizaciondinamica: any, opcionNombre: string, nombreCampo: string) {
  const preguntaId = `${id}_${idcaracterizaciondinamica}`;

  if (nombreCampo === '¿Cuáles redes sociales tiene?') {
    if (opcionNombre === 'FACEBOOK' || opcionNombre === 'TWITTER' || opcionNombre === 'INSTAGRAM' || opcionNombre === 'TIKTOK') {
      this.respuestasRedesSociales[opcionNombre] = `${opcionNombre}: ${valor}`;

      const respuestasConcatenadas = [];
      for (const key in this.respuestasRedesSociales) {
        if (this.respuestasRedesSociales.hasOwnProperty(key)) {
          respuestasConcatenadas.push(this.respuestasRedesSociales[key]);
        }
      }

      this.concatenacionRedesSociales = respuestasConcatenadas.join(', ');
      this.opcionesAgrupadas.push(this.concatenacionRedesSociales);
    }
  } else {
    if (valor) {
      this.seleccionesPorPregunta[preguntaId] = this.seleccionesPorPregunta[preguntaId] ?
        `${this.seleccionesPorPregunta[preguntaId]}, ${opcionNombre}` : opcionNombre;
    } else {
      this.seleccionesPorPregunta[preguntaId] = this.seleccionesPorPregunta[preguntaId]
        .replace(new RegExp(opcionNombre + ',?'), '');
    }
    this.opcionesAgrupadas.push(this.seleccionesPorPregunta);
  }

  const result = this.valoresForm.find((o: any) => o.id === id);
  if (result) {
    result.valor = valor;
  } else {
    this.valoresForm.push({
      "id": id,
      "valor": valor,
      "idUsuarioPst": localStorage.getItem('Id'),
      "idCategoriaRnt": localStorage.getItem('idCategoria'),
      "idCaracterizacion": idcaracterizaciondinamica
    });
  }
}


hasDepency(id: number) {
  const campos = this.datos.campos;
  const dictionay = new Map(campos.map(d => [d.idcaracterizaciondinamica, d]));
  return dictionay.has(+id);
}

public saveForm(){
  const caracterizacionRespuesta = this.valoresForm.map((elemento) => {
    this.idUser =  Number(elemento.idUsuarioPst);
    return { VALOR: elemento.valor.toString(),
      FK_ID_USUARIO:Number(elemento.idUsuarioPst), 
      FK_ID_CATEGORIA_RNT: Number(elemento.idCategoriaRnt),
      FK_ID_CARACTERIZACION_DINAMICA: elemento.id};
  })

    this.mostrarMensaje = true;
    if (this.formParent.valid) {
      this.ApiService.saveData(caracterizacionRespuesta).subscribe((data: any) => {
        this.ApiService.getNorma(this.idUser).subscribe(
          (categ: any) => {
            this.arrNormas = categ;
            localStorage.setItem("idCategoria", JSON.stringify(this.arrNormas[0].FK_ID_CATEGORIA_RNT));
        });
          this.ApiService.validateCaracterizacion(this.idUser).subscribe(
            (response) => {
              if (response) {
                this.ApiService.getNorma(this.idUser).subscribe(
                  (data: any) => {
                    if (
                      data[0].FK_ID_CATEGORIA_RNT === 5 ||
                      data[0].FK_ID_CATEGORIA_RNT === 2
                    ) {
                      this.arrResult = data;
                      localStorage.setItem("norma", JSON.stringify(this.arrResult));
                    } else {
                      this.arrResult = data;
                      localStorage.setItem("norma", JSON.stringify(this.arrResult));
                      localStorage.setItem("normaSelected", data[0].NORMA);
                      localStorage.setItem("idNormaSelected", data[0].ID_NORMA);
                      if( data[0].ID_NORMA === 1){
                      this.router.navigate(["/dashboard"]);
                      }else{
                        this.router.navigate(["/dashboard"]);
                      }      
                    }
                  }
                );
              } else {
                this.router.navigate(["/dashboard"]);
              }
            }
          );       
        const title = "Se guardó correctamente";
        const message = "El formulario se ha guardado exitosamente"
        this.Message.showModal(title,message);
        this.router.navigate(['/dashboard']);
      });
    }
}

checkMarcadoEnDesplegable(campo:any) {
  return campo.DESPLEGABLE.some(opcion => opcion.checked);
}
}
