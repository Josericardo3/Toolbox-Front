import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from 'src/app/servicios/api/api.service';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/servicios/spinnerService/spinner.service';
import { NgxSpinnerModule } from 'ngx-spinner'; 
import { ConditionalExpr } from '@angular/compiler';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ColorLista } from 'src/app/servicios/api/models/color';
import { Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';

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
  // facebook: FormControl;
  // twitter: FormControl;
  // instagram: FormControl;
  // tiktok: FormControl;
  // mostrarInputsRedesSociales: { [key: string]: boolean } = {
  //   'FACEBOOK': false,
  //   'TWITTER': false,
  //   'INSTAGRAM': false,
  //   'TIKTOK': false,
  // };
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
  valoresForm: any[] = [];
  numOfFields!: number;
  selectedOption: string;
  selectedOptions: string[] = [];
  seleccione: string = 'Seleccione una opción';

  aventuraSeleccionada: boolean = false;
  opcionesNorma: any[] = [];
  indexProceso: number = 0; 
  proceso1: any []= [];
  proceso2: any []= [];
  proceso3: any []= [];
  @ViewChild('stepper') stepper: MatStepper  ; 

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
    private cdref: ChangeDetectorRef,
    private location: Location,
   
  ) {
    this.cargaInicial=true;
    this.setState(this.valid1,true)
  this.setState(this.valid2,true)
  this.setState(this.valid3,true)
  }

cargaInicial: boolean;
ngOnInit(): void { 

  const id = Number(window.localStorage.getItem('Id'));
  this.colorTitle = JSON.parse(localStorage.getItem("color")).title;
  this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;

   this.ApiService.validateCaracterizacion(id).subscribe((data: any)=>{
  //   if(data === true){
  //     this.router.navigate(['/dashboard']);
  //   }
  // else{
      this.formParent = this.formBuilder.group({});
      this.getCaracterizacion();
      this.getPreguntasOrdenadas();
      this.http.get('https://www.datos.gov.co/resource/gdxc-w37w.json')
      .subscribe((data: any[]) => {
        this.municipios = data;
      });  
  //}
  })

  //validar input-otro
  this.otroControlA = new FormControl('', [Validators.required]);
  this.otroControlB = new FormControl('', [Validators.required]);
  this.otroControlC = new FormControl('', [Validators.required]);
  // this.facebook = new FormControl('', [Validators.required]);
  // this.twitter = new FormControl('', [Validators.required]);
  // this.instagram = new FormControl('', [Validators.required]);
  // this.tiktok = new FormControl('', [Validators.required]);
}

// toggleMostrarInputRedesSociales(opcion: string) {
//   this.mostrarInputsRedesSociales[opcion] = !this.mostrarInputsRedesSociales[opcion];
// }

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
validarCampoInput(opcion: any){
  let ver=false;
  if(opcion.valorUrl!==undefined){
    if(opcion.valorUrl.trim()!=""){
      ver=true;
    }
  }
  return ver;
}


getCaracterizacion(){
  this.valoresForm=[];
  this.ApiService.getData()
  .subscribe((data: any) => {
    this.datos = data;

    const tempoArray =  data.CAMPOS
    this.preguntasDesordenadas = data.CAMPOS;
    // Obtiene el valor de "Categoría RNT" para el título
    const campoCategoriaRNT = tempoArray.find(campo => campo.NOMBRE === 'Categoría RNT');
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

fnStepper(value: any){
  
   this.indexProceso = value.selectedIndex; 
   let anterior= value.previouslySelectedIndex;
   if(this.indexProceso==0 && (anterior == 1|| anterior ==2) ){
    this.setState(this.valid1,true)
    this.setState(this.valid2,true)
    this.setState(this.valid3,true)
   } 
   else if(this.indexProceso==1  && anterior ==2 ) {
    this.setState(this.valid2,true)
    this.setState(this.valid3,true)
   }
   this.cdref.detectChanges();
}

valid1 = new FormControl('')
valid2 = new FormControl('')
valid3 = new FormControl('')
setState(control: FormControl, state: boolean) {
  if (state) {
    control.setErrors({ "required": true })
  } else {
    control.reset()
  }
}

guardarYContinuar(value: string){
if(value == 'proceso1'){
  this.stepper.selectedIndex = 1;
}
if(value == 'proceso2'){
  this.stepper.selectedIndex = 2;
}
// if(value == 'proceso2') {
//   this.stepper.selectedIndex = 1;
// }
}
retroceder(){
  this.location.back();
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

  this.preguntasOrdenadas = this.preguntasOrdenadas.map((e:any)=>{
    e.esCargarInicial=true;
    return e;
  })


  // Para la barra de procesos
  const totalPag = this.preguntasOrdenadas.length;
  const preguntasPorProceso  =  Math.ceil(totalPag / 3);
  this.proceso1 = this.preguntasOrdenadas.slice(0, preguntasPorProceso).map((elemento:any)=>{ elemento.numeroPaso=1 ; return elemento;});
  this.proceso2 = this.preguntasOrdenadas.slice(preguntasPorProceso, preguntasPorProceso * 2).map((elemento:any)=>{ elemento.numeroPaso=2 ; return elemento;});
  this.proceso3 = this.preguntasOrdenadas.slice(preguntasPorProceso * 2).map((elemento:any)=>{ elemento.numeroPaso=3 ; return elemento;});
  
  let arrayTemporal =this.proceso1.concat(this.proceso2).concat(this.proceso3);
  //inicializar el saveForm
  this.valoresForm=[];
  arrayTemporal.forEach(element => {
    if(element.VALUES == null || element.ID_CARACTERIZACION_DINAMICA == '29'){
      this.valoresForm.push({
        "NOMBRE":element.NOMBRE,
        "id": 0,
        "valor": '',
        "idUsuarioPst": localStorage.getItem('Id'),
        "idCategoriaRnt": localStorage.getItem('idCategoria'),
        "idCaracterizacion": element.ID_CARACTERIZACION_DINAMICA,
        "tipoDato": element.TIPO_DE_DATO,
        "requerido": element.REQUERIDO,
        "seleccionCheckValido": false,
        "seleccionInputCheckValido": false,
        "numeroPaso":element.numeroPaso
      });
    }
  });
}


onChangeAventuraSeleccionada(value: boolean) {
    this.aventuraSeleccionada = value;
  
    if (this.aventuraSeleccionada) {
      // Si se seleccionó "SI", se muestra solo la norma que comienza con "NTC 6502"
     
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

 // this.selectedOptions.push(this.selectedOption);
 if (!this.selectedOptions.includes(this.selectedOption)) {
  // Si no está presente, agrégala
  this.selectedOptions.push(this.selectedOption);
}
}

allFieldsFilled(): boolean {
  const campos = Object.values(this.formParent.value);
  const lleno = campos.every(campo => typeof campo === 'string' && campo.trim() !== '');
  return lleno;
}

createFormControls() {
  for (let campo of this.datos.CAMPOS) {
    let control = this.getControlType(campo);
    campo.numero=1;
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


// toggleCampoRedSocial(index: number) {
//   this.mostrarCampoRedSocial[index] = !this.mostrarCampoRedSocial[index];
// }
habilitarInputPorCheck(opcion: any): boolean{
  let ver=false;
  const result = this.preguntasOrdenadas.find((o: any) => o.ID_CARACTERIZACION_DINAMICA === opcion.FK_ID_CARACTERIZACION_DINAMICA);
  if(result){
    if(result.NOMBRE=="¿Cuáles redes sociales tiene?"){
      if(opcion.check!==undefined){
        ver=opcion.check;
      }
    }
    else{
      if(opcion.NOMBRE=="OTROS"){
        if(opcion.check!==undefined){
          ver=opcion.check;
        }
      }
    }
  }
  return ver;
}



existeUnoSeleccionado(grupoPregunta: any): boolean{
  let alMenosUnCheck=false;
  if (grupoPregunta.DESPLEGABLE.some(elemento => elemento.check === true)) {
     alMenosUnCheck = true;
  }
  return alMenosUnCheck;
}



  capturarValor(id: string | number, valor: any, campo: any,opcionNombre?: string, nombreCampo?: string) {

    const result = this.valoresForm.find((o: any) => o.idCaracterizacion === campo.ID_CARACTERIZACION_DINAMICA);
    //cambios 30.10.2023 
    let valorTemp ="";
    let hayVacios=true;
    if(campo.TIPO_DE_DATO == "checkbox"){
      let arrayTempDesplegable = campo.DESPLEGABLE.filter((e: any) => e.check === true );
      valorTemp = arrayTempDesplegable.map(item => {

        const valorUrl = item.valorUrl || ""; // Usar '' si no hay valorUrl
        if((valorUrl.trim() == "" && campo.ID_CARACTERIZACION_DINAMICA == 18) ||
           (valorUrl.trim() == "" && campo.ID_CARACTERIZACION_DINAMICA != 18 && item.NOMBRE == 'OTROS')
        ){
            hayVacios=false;
          }
        return `${item.NOMBRE};${valorUrl}`;
      }).join('|');

      
      if(arrayTempDesplegable.length>0) campo.haySeleccionGrupoCheck=true;
      else  campo.haySeleccionGrupoCheck=false;
      campo.esCargarInicial=false;
    }
    else if(campo.TIPO_DE_DATO == "radio") {
      valorTemp =campo.valorSeleccionadoRadio;
    }
    else{
      valorTemp=valor;
    }
    //fin 
      if (result) {
        result.valor = valorTemp;
        if(campo.TIPO_DE_DATO == "checkbox") {
          result.seleccionCheckValido = campo.haySeleccionGrupoCheck;
          result.seleccionInputCheckValido = hayVacios;
        }
      } else {
        this.valoresForm.push({
          "id": id,
          "valor": valorTemp,
          "idUsuarioPst": localStorage.getItem('Id'),
          "idCategoriaRnt": localStorage.getItem('idCategoria'),
          "idCaracterizacion": campo.ID_CARACTERIZACION_DINAMICA,
          "tipoDato": campo.TIPO_DE_DATO,
          "requerido": campo.REQUERIDO,
          "seleccionCheckValido": campo.TIPO_DE_DATO == "checkbox" ?  campo.haySeleccionGrupoCheck : false,
          "seleccionInputCheckValido": campo.TIPO_DE_DATO == "checkbox" ?  hayVacios: true,
          "mensaje": campo.MENSAJE
        });
      }
      this.cdref.detectChanges();
      this.cargaInicial=false;
  }

  
requiredCheckbox(){
  return false
}

hasDepency(id: number) {
  const campos = this.datos.CAMPOS;
  const dictionay = new Map(campos.map(d => [d.ID_CARACTERIZACION_DINAMICA, d]));
  return dictionay.has(+id);
}

valorSeleccionadoRadio: string = '';
validateCampo(valoresForm: any){
  let preguntasRequeridas=valoresForm.filter((e:any)=>e.requerido);
  let ver=true;
    let temporal =  preguntasRequeridas.filter((elemento: any)=>
    elemento.tipoDato == "checkbox" 
    && elemento.idCaracterizacion != 21
    && (!elemento.seleccionCheckValido || !elemento.seleccionInputCheckValido )
    )

   if(preguntasRequeridas.filter((e:any)=>e.tipoDato == "radio" && e.valor=="").length>0){
    ver = false;
   }
   else if(preguntasRequeridas.filter((e:any)=>e.tipoDato == "radio" && e.valor=="SI").length>0){
      let temporal2 =  preguntasRequeridas.filter((elemento: any)=>
      elemento.tipoDato == "checkbox" 
      && elemento.idCaracterizacion == 21
      && (!elemento.seleccionCheckValido || !elemento.seleccionInputCheckValido )
      )
      if(temporal2.length>0){
        ver = false;
       }
   }
   if(temporal.length>0){
    ver = false;
   }
   if(preguntasRequeridas.filter((e:any)=>e.tipoDato != "radio" && e.tipoDato != "checkbox" && String(e.valor).trim()=="" ).length>0)
   {
      ver = false;
   }

   return ver;

}

public saveForm(){
  let validate = this.validateCampo(this.valoresForm);

  if(validate){
    let seleccionOpcionRadio= this.valoresForm.filter((e:any)=>e.tipoDato == "radio" && e.valor=="NO");
    let caracterizacionRespuesta: any = this.valoresForm.map((elemento) => {
    if( elemento.mensaje == "municipios") elemento.valor = this.selectedOptions
      this.idUser =  Number(elemento.idUsuarioPst);
      return { VALOR: elemento.valor?.toString(),
        FK_ID_USUARIO:Number(elemento.idUsuarioPst), 
        FK_ID_CATEGORIA_RNT: Number(elemento.idCategoriaRnt),
        FK_ID_CARACTERIZACION_DINAMICA: elemento.idCaracterizacion};
    })

    if(seleccionOpcionRadio.length>0){
      caracterizacionRespuesta = caracterizacionRespuesta.filter((e:any)=>e.FK_ID_CARACTERIZACION_DINAMICA!=21)
    }
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
  else{
         const title = "Registro no exitoso";
        const message = "Por favor verifique las respuestas";
        this.Message.showModal(title,message);
  }

}
checkMarcadoEnDesplegable(campo:any) {
  return campo.DESPLEGABLE.some(opcion => opcion.checked);
}
llenadoPasoValido(paso:any){
  let validate = this.validateCampo(this.valoresForm.filter((item:any)=>item.numeroPaso==paso));
  return validate;
}


}

