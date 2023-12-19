import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder,FormControl, NgForm, AbstractControl, FormArray } from '@angular/forms'
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { Subscription } from 'rxjs';
import { AppFormularioComponent } from '../formulario/app-formulario/app-formulario.component';
import { FormService } from 'src/app/servicios/form/form.service';
import { AUTO_STYLE } from '@angular/animations';
import { BarOptions } from 'chart.js';
import { ModalPadreService } from 'src/app/servicios/api/modal.padre.services';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { SpinnerService } from 'src/app/servicios/spinnerService/spinner.service';
import { NgxSpinnerService } from 'ngx-spinner';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-e-matriz-requisitos-legales',
  templateUrl: './e-matriz-requisitos-legales.component.html',
  styleUrls: ['./e-matriz-requisitos-legales.component.css']
})

export class EMatrizRequisitosLegalesComponent implements OnInit{
  @ViewChild('containers', { read: ViewContainerRef }) containers: ViewContainerRef;
  @ViewChild('inputTemplate') inputTemplate: TemplateRef<any>;
  @ViewChild('divsContainer', { read: ViewContainerRef }) divsContainer: ViewContainerRef;

  divsVisible = false;

  datos: any = [];
  datosReporte: any = [];

  leyesTurismo: any[] = [];
  dataLeyesTurismo: any[]= [];
  leyesAmbiental: any[] = [];
  dataLeyesAmbiental: any[]= [];
  leyesLaboral: any[] = [];
  dataLeyesLaboral: any[]= [];
  leyesSocial: any[] = [];
  dataLeyesSocial: any[]= [];
  leyesEconomico: any[] = [];
  dataLeyesEconomico: any[]= [];
  leyesParticular: any[] = [];
  dataLeyesParticular: any[]= [];
  detalles: any[] = [];
  showAdd = false;

  lastVisible: any;

  primeraLeyVisible = false;
  divAddVisible: boolean[] = [];
  adicionarVisibleTurismo = false;
  adicionarVisibleAmbiental = false;
  adicionarVisibleLaboral = false;
  adicionarVisibleSocial = false;
  adicionarVisibleEconomico = false;
  adicionarVisibleParticular = false;

  disabledAgregar: boolean = false;

  entroAlPadre: boolean = false;

//agregando nuevo
  showModal: boolean = false;
  title: '';
  message: '';

  
  
  //MODAL DEL RESUMEN

  showModalResumen: boolean = false;
  descripcionResumen1: string;
  descripcionResumen2: string;
  descripcionResumen3: string;
  descripcionResumen4: string;
  descripcionResumen5: string;
  descripcionResumen6: string;
 
  
  categoria: string;
  descripcion: string;
  
  numero: string;
  anio: string;
  busqueda: string = '';
  tabActual = 'tab1';

  opcionSeleccionada: string = '';
  responsableSeleccionado: string = '';
  evidenciaInput: string = '';
  observacionInput: string = '';
  accionesText: string = '';
  responsablePlanSeleccionado: string = '';
  fechaInput: string = '';
  estadoSeleccionado: string = '';

  selectedOption: string = '';
  otroValor: string = '';
  nuevoDiv: any;
  tipoNormatividad: string;
  selectedTabIndex: number = -1;

  divs: any[] = [{}];
  divsTab1: any[] = [];
  divsTab2: any[] = [];
  divsTab3: any[] = [];
  divsTab4: any[] = [];
  divsTab5: any[] = [];
  divsTab6: any[] = [];

  gruposTurismoReporte: any = [];
  gruposAmbientalReporte: any = [];
  gruposLaboralReporte: any = [];
  gruposSocialReporte: any = [];
  gruposEconomicoReporte: any = [];
  gruposParticularReporte: any = [];

  public tab1Form!: FormGroup
  public tab2Form!: FormGroup
  public tab3Form!: FormGroup
  public tab4Form!: FormGroup
  public tab5Form!: FormGroup
  public tab6Form!: FormGroup
  // public form: FormGroup;
  // public form: FormGroup[] = [];
  // tabData: any[] = [];
  // public form!: FormGroup;
  isFormDisabled: boolean = false
  isDisabled: boolean = false;



  //BOTON MODIFICAR NUEVO
  disabledModificar: boolean = false;

  disabledTabs1: boolean = false;
  disabledTabs2: boolean = false;
  disabledTabs3: boolean = false;
  disabledTabs4: boolean = false;
  disabledTabs5: boolean = false;
  disabledTabs6: boolean = false;


  //BOTON ELIMINAR LEY
  disabledEliminar: boolean = false;




  subscriptions: any;

  leyesVisibles: boolean[] = [];
//editarcaracteristica
  editarCaracteristica: any = {};
  
  datosHeaderMatriz: any = [];
  //crear para cada uno de los rubros  
  headerTurismo: any;
  headerAmbiental: any;
  headerLaboral: any;
  headerSocial: any;
  headerEconomico: any;


  saveForm : FormGroup;
  //modelo

  modelo: any = {};


  datosUsuario: any = [];
  pst: any;
  logo: any;
  estadoFormulario: any;
  public idMatriz: number| null = null;
  showExitoGuardado: boolean;




  constructor(
    private ApiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private Message: ModalService,
    private formService: FormService,
    //SERVICIO PARA COMUNICAR APP-FORMULARIO CON MATRIZ-REQUISITOS-LEGAL
    private modalPadre: ModalPadreService,
    private spinnerService: SpinnerService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit() {
    //REMOVER ARRAY TEMPORAL
    
    localStorage.removeItem('MiArrayTemporalELIMINAR')




    localStorage.removeItem('MiArrayTemporal');
    this.getUser();
    this.separarCategoria();
    this.showModal = true;

    //NOS SUSCRIBIMOS AL SERVICIO Y LE PASAMOS LA FUNCION QUE QUEREMOS QUE UTILIZE NUESTRO BOTON EN EL FORMULARIO
    this.modalPadre.abrirModal$.subscribe(()=>{
      this.terminarModificarCampos2()
      // this.entroAlPadre = false;
    })
    

    this.ApiService.getUsuario()
    .subscribe((data: any) => {
      this.datosUsuario = data;
      this.pst = data.nombrePst;
      this.logo = data.logo
    })
    //para turismo
    this.ApiService.getDatosHeaderMatriz()
    .subscribe((data: any) => {
      this.datosHeaderMatriz = data;
      this.headerTurismo = data.find(p => p.CATEGORIA === "Turismo");
      console.log("asdo",this.headerTurismo);
     
    })
    this.ApiService.getDatosHeaderMatriz()
    .subscribe((data: any) => {
      this.datosHeaderMatriz = data;
      this.headerAmbiental = data.find(p => p.CATEGORIA === "Ambiental");
     
    })
    this.ApiService.getDatosHeaderMatriz()
    .subscribe((data: any) => {
      this.datosHeaderMatriz = data;
      this.headerLaboral = data.find(p => p.CATEGORIA === "Laboral y SGSST");
     
    })
    this.ApiService.getDatosHeaderMatriz()
    .subscribe((data: any) => {
      this.datosHeaderMatriz = data;
      this.headerEconomico = data.find(p => p.CATEGORIA === "Economico");
     
    })
    this.ApiService.getDatosHeaderMatriz()
    .subscribe((data: any) => {
      this.datosHeaderMatriz = data;
      this.headerSocial = data.find(p => p.CATEGORIA === "Social");
     
    })

    this.tab1Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      otroValor: [''],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: this.formBuilder.array([
          this.formBuilder.control('' ,[Validators.required])
      ])
    }, {
      validators: this.customValidation // Agrega la función de validación personalizada
    });
    //agregado 
    

    this.tab2Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      otroValor: [''],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones2: this.formBuilder.array([
        this.formBuilder.control('' ,[Validators.required])
      ])
    }, {
      validators: this.customValidation 
    });

    this.tab3Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      otroValor: [''],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones3: this.formBuilder.array([
        this.formBuilder.control('' ,[Validators.required])
      ])
    }, {
      validators: this.customValidation 
    });

    this.tab4Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      otroValor: [''],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones4: this.formBuilder.array([
        this.formBuilder.control('' ,[Validators.required])
      ])
    }, {
      validators: this.customValidation 
    });

    this.tab5Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      otroValor: [''],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones5: this.formBuilder.array([
        this.formBuilder.control('' ,[Validators.required])
      ])
    }, {
      validators: this.customValidation 
    });
    this.tab6Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      otroValor: [''],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones6: this.formBuilder.array([
        this.formBuilder.control('' ,[Validators.required])
      ])
    }, {
      validators: this.customValidation 
    });
    
    //SAVEFORM DEL MODAL RESUMEN
    this.saveForm = this.formBuilder.group({
      descripcionNoticia: ['', Validators.required],
      
    });
    

    
  } 
  userInfor:any={};
  
  getUser() {
    const idUsuario = window.localStorage.getItem('Id');
    this.ApiService.getUser(idUsuario).subscribe((data: any) => {
      this.userInfor = data;
      
      //console.log(this.userInfor.LOGO);
    })
  }
  get secciones(){
    return this.tab1Form.get('secciones') as FormArray;
  }
  get secciones2(){
    return this.tab2Form.get('secciones2') as FormArray;
  }
  get secciones3(){
    return this.tab3Form.get('secciones3') as FormArray;
  }
  get secciones4(){
    return this.tab4Form.get('secciones4') as FormArray;
  }
  get secciones5(){
    return this.tab5Form.get('secciones5') as FormArray;
  }
  get secciones6(){
    return this.tab6Form.get('secciones6') as FormArray;
  }

  contSecciones: number = 0;
  deshabilitaRemove: boolean = true

  addSecciones(){
    if(this.tabActual === 'tab1'){
      this.secciones.push(this.formBuilder.control('',[Validators.required]))
    }
    if(this.tabActual === 'tab2'){
      this.secciones2.push(this.formBuilder.control('',[Validators.required]))
    }
    if(this.tabActual === 'tab3'){
      this.secciones3.push(this.formBuilder.control('',[Validators.required]))
    }
    if(this.tabActual === 'tab4'){
      this.secciones4.push(this.formBuilder.control('',[Validators.required]))
    }
    if(this.tabActual === 'tab5'){
      this.secciones5.push(this.formBuilder.control('',[Validators.required]))
    }
    if(this.tabActual === 'tab6'){
      this.secciones6.push(this.formBuilder.control('',[Validators.required]))
    }
       
    this.deshabilitaRemove = false;
    this.contSecciones = this.contSecciones + 1;
    console.log("hay esta cantidad de secciones:",this.contSecciones)
  }
  // addSecciones2(){
  //   this.secciones2.push(this.formBuilder.control('',[Validators.required]))
  //   this.deshabilitaRemove = false;
  //   this.contSecciones = this.contSecciones + 1;
  //   console.log("hay esta cantidad de secciones:",this.contSecciones)
  // }
  
  removeSeccion(index: number){
    if(this.tabActual === 'tab1'){
      this.secciones.removeAt(index);
      
    }
    if(this.tabActual === 'tab2'){
      this.secciones2.removeAt(index);
      
    }
    if(this.tabActual === 'tab3'){
      this.secciones3.removeAt(index);
    }
    if(this.tabActual === 'tab4'){
      this.secciones4.removeAt(index);
    }
    if(this.tabActual === 'tab5'){
      this.secciones5.removeAt(index);
    }
    if(this.tabActual === 'tab6'){
      this.secciones6.removeAt(index);
    }
    
  }
  // removeSeccion2(index: number){
  //   this.secciones2.removeAt(index);
  // }

  customValidation(control: AbstractControl) {
    if (control.get('tipoNormatividad').value === 'otro') {
      if (!control.get('otroValor').value) {
        return { customError: true };
      }
    }
    return null;
  }


  
  separarCategoria(){
    this.ApiService.getLeyes()
    .subscribe((data: any) => {
      this.datos = data;
      const gruposTurismo = this.datos.filter((ley) => ley.CATEGORIA === 'Turismo')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DESCRIPCION: ley.DESCRIPCION,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
              ES_FIJO: ley.ES_FIJO,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DESCRIPCION: ley.DESCRIPCION,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            ES_FIJO: ley.ES_FIJO,
          });
        }
        return acumulador;
      }, {});
      this.leyesTurismo = Object.values(gruposTurismo);
      this.dataLeyesTurismo = Object.values(gruposTurismo);
      console.log("GAAAAA", this.leyesTurismo);
      const gruposAmbiental = this.datos.filter((ley) => ley.CATEGORIA === 'Ambiental' || ley.CATEGORIA === 'NTC 6496 Ambiental')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
         if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
              ES_FIJO: ley.ES_FIJO,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            ES_FIJO: ley.ES_FIJO,
          });
        }
        return acumulador;
      }, {});
      this.leyesAmbiental = Object.values(gruposAmbiental);
      this.dataLeyesAmbiental = Object.values(gruposAmbiental);
      const gruposLaboral = this.datos.filter((ley) => ley.CATEGORIA === 'Laboral y SGSST')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
              ES_FIJO: ley.ES_FIJO,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            ES_FIJO: ley.ES_FIJO,
          });
        }
        return acumulador;
      }, {});
      this.leyesLaboral = Object.values(gruposLaboral);
      this.dataLeyesLaboral = Object.values(gruposLaboral);
      const gruposSocial = this.datos.filter((ley) => ley.CATEGORIA === 'Social')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
              ES_FIJO: ley.ES_FIJO,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            ES_FIJO: ley.ES_FIJO,
          });
        }
        return acumulador;
      }, {});
      this.leyesSocial = Object.values(gruposSocial);
      this.dataLeyesSocial = Object.values(gruposSocial);
      const gruposEconomico = this.datos.filter((ley) => ley.CATEGORIA === 'Economico')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
              ES_FIJO: ley.ES_FIJO,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            ES_FIJO: ley.ES_FIJO,
          });
        }
        return acumulador;
      }, {});
      this.leyesEconomico = Object.values(gruposEconomico);
      this.dataLeyesEconomico = Object.values(gruposEconomico);
      const gruposParticular = this.datos.filter((ley) => ley.CATEGORIA === 'NTC 6496 General' || ley.CATEGORIA === 'NTC 6487' || 
      ley.CATEGORIA === 'NTC 6503' || ley.CATEGORIA === 'NTC 6503adicionar requisito Economico' || ley.CATEGORIA === 'NTC 6504' || ley.CATEGORIA === 'NTC 6505'
      || ley.CATEGORIA === 'NTC 6505 Ambiental' || ley.CATEGORIA === 'NTC 6502' || ley.CATEGORIA === 'NTC 6506' || ley.CATEGORIA === 'NTC 6507' || ley.CATEGORIA === 'NTC 6523'|| ley.CATEGORIA === 'Particular de Prestador')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
              ES_FIJO: ley.ES_FIJO,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            ID_RESPONSABLE_CUMPLIMIENTO: ley.ID_RESPONSABLE_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            ID_PLAN_RESPONSABLE_CUMPLIMIENTO: ley.ID_PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            ES_FIJO: ley.ES_FIJO,
          });
        }
        return acumulador;
      }, {});
      this.leyesParticular = Object.values(gruposParticular);
      this.dataLeyesParticular = Object.values(gruposParticular);
      // this.leyesParticular = this.datos.filter((ley) => ley.categoria === 'Turismo'); // ¿cuál es la categoría?
      
     });
  }

  cambiarTab(tab: string) {
    this.tabActual = tab;
    this.separarCategoria();
    this.deshabilitaRemove = false;
    this.contSecciones = 0

    this.tab1Form.reset();
    this.tab2Form.reset();
    this.tab3Form.reset();
    this.tab4Form.reset();
    this.tab5Form.reset();
    this.tab6Form.reset();
    // Actualiza divs para que muestre los divs específicos del tab seleccionado
    if (tab === 'tab1') {
      this.divs = this.divsTab1;
    } else if (tab === 'tab2') {
      this.divs = this.divsTab2;
    } else if (tab === 'tab3') {
      this.divs = this.divsTab3;
    } else if (tab === 'tab4') {
      this.divs = this.divsTab4;
    } else if (tab === 'tab5') {
      this.divs = this.divsTab5;
    } else if (tab === 'tab6') {
      this.divs = this.divsTab6;
    }
  }

  toggleSectionLey(section, index, idMatriz: number) {
    
      // Obtén el estado del formulario desde el servicio
    this.estadoFormulario = this.formService.obtenerEstadoFormulario(idMatriz);
    this.idMatriz = idMatriz;
    if (section === 'primeraLey') {
      this.leyesVisibles[index] = !this.leyesVisibles[index];
    }

  // Cierra el div abierto si se hace clic en otro div
      if (this.lastVisible && this.lastVisible.section !== section) {
        if (this.lastVisible.section === 'primeraLey') {
          this.leyesVisibles[this.lastVisible.index] = false;
        }
      }
      this.lastVisible = { section, index };

    
    //   if(ES_FIJO == 0){
    //     this.estadoFormulario = this.formService.obtenerEstadoFormulario(idMatriz);
    // this.idMatriz = idMatriz;
    // if (section === 'primeraLey') {
    //   this.leyesVisibles[index] = !this.leyesVisibles[index];
    // }

    // // Cierra el div abierto si se hace clic en otro div
    // if (this.lastVisible && this.lastVisible.section !== section) {
    //     if (this.lastVisible.section === 'primeraLey') {
    //       this.leyesVisibles[this.lastVisible.index] = false;
    //     }
    // }
    // this.lastVisible = { section, index };
    //   }
      
  
    
}

  toggleSectionDivAdd(section, index) {
    if (section === 'divAdd') {
      this.divAddVisible[index] = !this.divAddVisible[index];
    }

    // Cierra el div abierto si se hace clic en otro div
    if (this.lastVisible && this.lastVisible.section !== section) {
        if (this.lastVisible.section === 'divAdd') {
          this.divAddVisible[this.lastVisible.index] = false;
      }
    }
    this.lastVisible = { section, index };
  }

  toggleSection(section) {
  if (section === 'adicionarTurismo') {
      this.adicionarVisibleTurismo = !this.adicionarVisibleTurismo
    } else if (section === 'adicionarAmbiental') {
      this.adicionarVisibleAmbiental = !this.adicionarVisibleAmbiental
    } else if (section === 'adicionarLaboral') {
      this.adicionarVisibleLaboral = !this.adicionarVisibleLaboral
    } else if (section === 'adicionarSocial') {
      this.adicionarVisibleSocial = !this.adicionarVisibleSocial
    } else if (section === 'adicionarEconomico') {
      this.adicionarVisibleEconomico = !this.adicionarVisibleEconomico
    } else if (section === 'adicionarParticular') {
      this.adicionarVisibleParticular = !this.adicionarVisibleParticular
    }
    

    // Cierra el div abierto si se hace clic en otro div
    if (this.lastVisible && this.lastVisible !== section) {
      if (section === 'adicionarTurismo') {
            this.adicionarVisibleTurismo = !this.adicionarVisibleTurismo
          } else if (section === 'adicionarAmbiental') {
            this.adicionarVisibleAmbiental = !this.adicionarVisibleAmbiental
          } else if (section === 'adicionarLaboral') {
            this.adicionarVisibleLaboral = !this.adicionarVisibleLaboral
          } else if (section === 'adicionarSocial') {
            this.adicionarVisibleSocial = !this.adicionarVisibleSocial
          } else if (section === 'adicionarEconomico') {
            this.adicionarVisibleEconomico = !this.adicionarVisibleEconomico
          } else if (section === 'adicionarParticular') {
            this.adicionarVisibleParticular = !this.adicionarVisibleParticular
          }
    }
    this.lastVisible = section;
  }

  isLeyVisible(index) {
    return this.leyesVisibles[index];
  }

  isDivAddVisible(index){
    return this.divAddVisible[index]
  }
selectValue: any
  onSelect(value: string) {
    console.log(value)
    this.selectedOption = value;
    this.selectValue = value;

  }

  onOtroInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.otroValor = inputElement.value;
  }

  arrayLeyes: any = [];

  agregarDiv() {
    debugger
    var categoria = "";
    if (this.tabActual === 'tab1'||this.tabActual === 'tab2'||this.tabActual === 'tab3'||this.tabActual === 'tab4'||this.tabActual === 'tab5') {
      categoria = (document.querySelector('#categoriaInput') as HTMLInputElement).value;
    } else if (this.tabActual === 'tab6') {
      categoria = (document.querySelector('#categoriaParticularInput') as HTMLInputElement).value;
    } 
    console.log("ARTICULOS: ", this.tab1Form.value.secciones);
    console.log("ARTICULOS2: ", this.tab2Form.value.secciones2);
    let seccionesArray: string[];
    if(this.tabActual === 'tab1'){
      seccionesArray = this.tab1Form.value.secciones
    }
    if(this.tabActual === 'tab2'){
      seccionesArray = this.tab2Form.value.secciones2
    }
    if(this.tabActual === 'tab3'){
      seccionesArray = this.tab3Form.value.secciones3
    }
    if(this.tabActual === 'tab4'){
      seccionesArray = this.tab4Form.value.secciones4
    }
    if(this.tabActual === 'tab5'){
      seccionesArray = this.tab5Form.value.secciones5
    }
    if(this.tabActual === 'tab6'){
      seccionesArray = this.tab6Form.value.secciones6
    }

    console.log("EL ARRAY DEFINITIVO: ", seccionesArray)
  
    
    const tipoNormatividad = this.tab1Form.value.tipoNormatividad;
    const anio = (document.querySelector('#anioInput') as HTMLInputElement).value;
    
    const numero = (document.querySelector('#numeroInput') as HTMLInputElement).value;
    const emisor = this.userInfor.NOMBRE;
    const descripcion = (document.querySelector('#descripcionTextAreaAdd') as HTMLTextAreaElement).value;
    // const secciones = (document.querySelector('#seccionesTextAreaAdd') as HTMLTextAreaElement).value;
    // const tipoNormatividad = this.selectedOption === 'otro' ? (document.querySelector('#otroInput') as HTMLInputElement).value : this.selectedOption;
    // this.tipoNormatividad = this.selectedOption === 'otro' ? this.otroValor : this.selectedOption;
    this.tipoNormatividad = this.selectedOption === 'otro' ? this.otroValor : this.selectedOption;
    
    if (this.tipoNormatividad === 'otro') {
      this.tipoNormatividad = this.otroValor;
    }
    
    seccionesArray.forEach(async seccion => {
      this.nuevoDiv = {
        ID_DOCUMENTO: 1,
        CATEGORIA: categoria,
        TIPO_NORMATIVIDAD: this.tipoNormatividad,
        NUMERO: numero,
        ANIO: anio,
        EMISOR: emisor,
        DESCRIPCION: descripcion,
        DOCS_ESPECIFICOS: seccion,
        //AGREGAR ES FIJO
        ES_FIJO: 0,
        ID_USUARIO_REG: localStorage.getItem('Id')

  };
  console.log("YONI TEST: ", this.nuevoDiv);
  console.log("previa enviar api");

  this.arrayLeyes.push(this.nuevoDiv);
  console.log("ARRAY LEYES: ", this.arrayLeyes);

   

  
  
  
    
      
    });

    this.ApiService.insertLey(this.arrayLeyes).subscribe(
      (res:any) => {
        this.separarCategoria();
        for(var i=1;i<=this.contSecciones;i++){
          this.removeSeccion(1);
        }
        this.contSecciones = 0;
        if(this.tabActual == 'tab1'){
          if(this.adicionarVisibleTurismo == true){
            this.toggleSection('adicionarTurismo');
          }
          
        }
        if(this.tabActual == 'tab2'){
          if(this.adicionarVisibleAmbiental == true){
            this.toggleSection('adicionarAmbiental');
          }
        }
        if(this.tabActual == 'tab3'){
          if(this.adicionarVisibleLaboral == true){
            this.toggleSection('adicionarLaboral');
          }
        }
        if(this.tabActual == 'tab4'){
          if(this.adicionarVisibleSocial == true){
            this.toggleSection('adicionarSocial');
          }
        }
        if(this.tabActual == 'tab5'){
          if(this.adicionarVisibleEconomico == true){
            this.toggleSection('adicionarEconomico');
          }
        }
        if(this.tabActual == 'tab6'){
          if(this.adicionarVisibleParticular == true){
            this.toggleSection('adicionarParticular');
          }
        }
        this.showModal = true;
        const title = "Requisito Legal";
        const message = "Requisito Legal Agregado";
        this.Message.showModal(title, message);
      },
      (error) => {
        console.error('Error al enviar la solicitud:', error);
      });
    
      
    
    

    this.nuevoDiv = {};

    this.divsVisible = true;
    
    this.tab1Form.reset();
    this.tab2Form.reset();
    this.tab3Form.reset();
    this.tab4Form.reset();
    this.tab5Form.reset();
    this.tab6Form.reset();

    
    
  }   

  eliminarDivAdd() {
    const divAdd = document.getElementById('divAdd');
    divAdd.parentNode.removeChild(divAdd);
  }

  buscarTitulos(): void {
    
    if (this.tabActual === 'tab1') {
      let arrayTemp = this.dataLeyesTurismo.map((item: any) => {
        item.leyesTexto = `${item.TIPO_NORMATIVIDAD} ${item.NUMERO} de ${item.ANIO}`
        return item;
      })
      arrayTemp = this.dataLeyesTurismo.filter((item: any) =>
        (item.leyesTexto.toUpperCase().includes(this.busqueda.trim().toUpperCase()) || this.busqueda.trim().toUpperCase() == '')
      )
      this.leyesTurismo = arrayTemp;
    } 
    else if (this.tabActual === 'tab2') {
      let arrayTemp = this.dataLeyesAmbiental.map((item: any) => {
        item.leyesTexto = `${item.TIPO_NORMATIVIDAD} ${item.NUMERO} de ${item.ANIO}`
        return item;
      })
      arrayTemp = this.dataLeyesAmbiental.filter((item: any) =>
        (item.leyesTexto.toUpperCase().includes(this.busqueda.trim().toUpperCase()) || this.busqueda.trim().toUpperCase() == '')
      )
      this.leyesAmbiental = arrayTemp;
    
    } 
    else if (this.tabActual === 'tab3') {
      let arrayTemp = this.dataLeyesLaboral.map((item: any) => {
        item.leyesTexto = `${item.TIPO_NORMATIVIDAD} ${item.NUMERO} de ${item.ANIO}`
        return item;
      })
      arrayTemp = this.dataLeyesLaboral.filter((item: any) =>
        (item.leyesTexto.toUpperCase().includes(this.busqueda.trim().toUpperCase()) || this.busqueda.trim().toUpperCase() == '')
      )
      this.leyesLaboral = arrayTemp;
    } 
    else if (this.tabActual === 'tab4') {
      let arrayTemp = this.dataLeyesSocial.map((item: any) => {
        item.leyesTexto = `${item.TIPO_NORMATIVIDAD} ${item.NUMERO} de ${item.ANIO}`
        return item;
      })
      arrayTemp = this.dataLeyesSocial.filter((item: any) =>
        (item.leyesTexto.toUpperCase().includes(this.busqueda.trim().toUpperCase()) || this.busqueda.trim().toUpperCase() == '')
      )
      this.leyesSocial = arrayTemp;
    } 
    else if (this.tabActual === 'tab5') {
      let arrayTemp = this.dataLeyesEconomico.map((item: any) => {
        item.leyesTexto = `${item.TIPO_NORMATIVIDAD} ${item.NUMERO} de ${item.ANIO}`
        return item;
      })
      arrayTemp = this.dataLeyesEconomico.filter((item: any) =>
        (item.leyesTexto.toUpperCase().includes(this.busqueda.trim().toUpperCase()) || this.busqueda.trim().toUpperCase() == '')
      )
      this.leyesEconomico = arrayTemp;
    } 
    else if (this.tabActual === 'tab6') {
      let arrayTemp = this.dataLeyesParticular.map((item: any) => {
        item.leyesTexto = `${item.TIPO_NORMATIVIDAD} ${item.NUMERO} de ${item.ANIO}`
        return item;
      })
      arrayTemp = this.dataLeyesParticular.filter((item: any) =>
        (item.leyesTexto.toUpperCase().includes(this.busqueda.trim().toUpperCase()) || this.busqueda.trim().toUpperCase() == '')
      )
      this.leyesParticular = arrayTemp;
    }

  }

  // buscarTitulos(): void {
  //     const titulos = document.querySelectorAll('.titulo h3');
  //     titulos.forEach((titulo) => {
  //         const tituloString = titulo.textContent.toLowerCase();
  //         if (tituloString.includes(this.busqueda.toLowerCase())) {
  //             titulo.parentElement.parentElement.style.display = 'block';
  //         } else {
  //             titulo.parentElement.parentElement.style.display = 'none';
  //         }
  //     });
  // }
  
  actualizarHeader(){
    this.ApiService.getDatosHeaderMatriz()
    .subscribe((data: any) => {
      this.datosHeaderMatriz = data;
      this.headerTurismo = data.find(p => p.CATEGORIA === "Turismo");
      this.headerAmbiental = data.find(p => p.CATEGORIA === "Ambiental");
      this.headerLaboral = data.find(p => p.CATEGORIA === "Laboral y SGSST");
      this.headerEconomico = data.find(p => p.CATEGORIA === "Economico");
      this.headerSocial = data.find(p => p.CATEGORIA === "Social");
      console.log("datita",data);
      console.log("asdo2",this.headerTurismo); 
      console.log("asd3",this.headerAmbiental);
    })
    
  }
  
  generateReporteTurismo(){   

    this.actualizarHeader();   
     
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      
      this.datosReporte = data;
      this.gruposTurismoReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'Turismo')  
  
      //CAMBIOS RADICALES
      
      
      let bodyContent;
      
      //SI USERINFOR.LOGO ES NULO CAMBIA EL FORMATO DEL PDF A TIPO TEXT
      if(this.userInfor.LOGO == null){
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                { text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                //{ image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      else{
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                //{ text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                { image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      const matrizUsuario = {
        columns: [
          {
            width: 'auto',
            table: {
              widths: ['auto', '*', '*', '*', '*', '*'],
              body: [
                [     
                  { text: 'COMPONENTE ACTUALIZADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA ACTUALIZACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }

                ],
                [
                  { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.NOMBRE, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'COMPONENTE EVALUADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA EVALUACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'EVALUADOR', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.VALOR, alignment: 'center',rowSpan: 1 }

                ],
                
              ]
            },
            fontSize: 7,
            margin: [0, 0, 27, 0]
          },
          {
            table: {
              heights: [87],
              widths: ['*', '*'],
              body: [
                [     
                  { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                  { text: this.headerTurismo?.RESUMEN, alignment: 'center',rowSpan: 1 }
                ]
              ]
            },
            fontSize: 8,
          },
        ]
      };
      const matrizLeyes = {
        table: {
          widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
          body: [
            [     
              { text: 'REQUISITOS LEGALES', colSpan:10, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '¿APLICA PLAN DE INTERVENCIÓN?', colSpan:2, style: ['tituloTabla'] },
              {},
              { text: 'PLAN DE INTERVENCIÓN', colSpan:5, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
            ],
            [     
              { text: 'TIPO DE NORMATIVIDAD', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'NÚMERO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'AÑO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'EMISOR', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'DESCRIPCIÓN', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ARTÍCULOS / SECCIONES / REQUISITOS ESPECÍFICOS QUE APLICAN', style: ['tituloTabla'] },
              { text: 'ESTADO DE CUMPLIMIENTO (SI/NO/EN PROCESO/NA)', style: ['tituloTabla'], margin:[ 0, 5, 0, 5 ] },
              { text: 'RESPONSABLE DE DAR CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'EVIDENCIA DEL CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'OBSERVACIONES / INCUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'SI', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'NO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ACCIONES A REALIZAR', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA PARA LA  EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'RESPONSABLE DE LA EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA / SEGUIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'ESTADO (ABIERTO / CERRADO)', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
            ],
          // ...this.gruposTurismoReporte.flatMap((item: any) =>
          //   item.DOCUMENTO.map((documento: any) => [
          //     { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
          //     { text: documento.NUMERO, style: ['dinamicTable'] },
          //     { text: documento.AÑO, style: ['dinamicTable'] },
          //     { text: documento.EMISOR, style: ['dinamicTable'] },
          //     { text: documento.DESCRIPCION, style: ['dinamicTable'] },
          //     { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] }
          //   ])
          // ),
        ...this.gruposTurismoReporte.flatMap((item: any) =>
          item.DOCUMENTO.map((documento: any) => {
            const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
            
            let siValue = 'No aplica';
            let noValue = 'No aplica';
            
  
            if (aplicaPlanIntervencion === 'Si') {
              siValue = 'SI';
            } else if (aplicaPlanIntervencion === 'No') {
              noValue = 'NO';
            }
            //console.log("gian", documento);
            return [
              { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
              { text: documento.NUMERO, style: ['dinamicTable'] },
              { text: documento.AÑO, style: ['dinamicTable'] },
              { text: documento.EMISOR, style: ['dinamicTable'] },
              { text: documento.DESCRIPCION, style: ['dinamicTable'] },
              { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
              { text: siValue, style: ['dinamicTable'] },
              { text: noValue, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] },
            ];
          })
        )
          ],
        },
        fontSize: 6,
      };
      //CREANDO PDF
      const pdfDefinition: any = {
        
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [bodyContent          ,         '\n',  matrizUsuario        ,     '\n',  matrizLeyes    ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [20, 20, 20, 20],
            alignment: 'center',
          },
          tituloTabla: {
            alignment: 'center',
            bold: true,
            fontSize: 9,
            fillColor: '#eeeeee'
          },
          dinamicTable: {
            fontSize: 6,
            alignment: 'center'
          },
        }
      }      
      pdfMake.createPdf(pdfDefinition).open();
      const title = "Se descargó correctamente";
      const message = "La descarga se ha realizado exitosamente"
      this.Message.showModal(title, message);
      
      
    });
    
  }

  generateReporteAmbiental(){
    this.actualizarHeader();
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      this.datosReporte = data;
      this.gruposAmbientalReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'Ambiental' || ley.CATEGORIA === 'NTC 6496 Ambiental')
      let bodyContent;
      //SI USERINFOR.LOGO ES NULO CAMBIA EL FORMATO DEL PDF A TIPO TEXT
      if(this.userInfor.LOGO == null){
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                { text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                //{ image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      else{
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                //{ text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                { image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      const matrizUsuario = {
        columns: [
          {
            width: 'auto',
            table: {
              widths: ['auto', '*', '*', '*', '*', '*'],
              body: [
                [     
                  { text: 'COMPONENTE ACTUALIZADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA ACTUALIZACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }

                ],
                [
                  { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.NOMBRE, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'COMPONENTE EVALUADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA EVALUACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'EVALUADOR', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.VALOR, alignment: 'center',rowSpan: 1 }

                ],
                
              ]
            },
            fontSize: 7,
            margin: [0, 0, 27, 0]
          },
          {
            table: {
              heights: [87],
              widths: ['*', '*'],
              body: [
                [     
                  { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                  { text: this.headerAmbiental?.RESUMEN, alignment: 'center',rowSpan: 1 }
                ]
              ]
            },
            fontSize: 8,
          },
        ]
      };
      const matrizLeyes = {
        table: {
          widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
          body: [
            [     
              { text: 'REQUISITOS LEGALES', colSpan:10, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '¿APLICA PLAN DE INTERVENCIÓN?', colSpan:2, style: ['tituloTabla'] },
              {},
              { text: 'PLAN DE INTERVENCIÓN', colSpan:5, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
            ],
            [     
              { text: 'TIPO DE NORMATIVIDAD', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'NÚMERO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'AÑO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'EMISOR', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'DESCRIPCIÓN', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ARTÍCULOS / SECCIONES / REQUISITOS ESPECÍFICOS QUE APLICAN', style: ['tituloTabla'] },
              { text: 'ESTADO DE CUMPLIMIENTO (SI/NO/EN PROCESO/NA)', style: ['tituloTabla'], margin:[ 0, 5, 0, 5 ] },
              { text: 'RESPONSABLE DE DAR CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'EVIDENCIA DEL CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'OBSERVACIONES / INCUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'SI', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'NO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ACCIONES A REALIZAR', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA PARA LA  EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'RESPONSABLE DE LA EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA / SEGUIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'ESTADO (ABIERTO / CERRADO)', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
            ],
          // ...this.gruposTurismoReporte.flatMap((item: any) =>
          //   item.DOCUMENTO.map((documento: any) => [
          //     { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
          //     { text: documento.NUMERO, style: ['dinamicTable'] },
          //     { text: documento.AÑO, style: ['dinamicTable'] },
          //     { text: documento.EMISOR, style: ['dinamicTable'] },
          //     { text: documento.DESCRIPCION, style: ['dinamicTable'] },
          //     { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] }
          //   ])
          // ),
        ...this.gruposAmbientalReporte.flatMap((item: any) =>
          item.DOCUMENTO.map((documento: any) => {
            const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
            
            let siValue = 'No aplica';
            let noValue = 'No aplica';
            
  
            if (aplicaPlanIntervencion === 'Si') {
              siValue = 'SI';
            } else if (aplicaPlanIntervencion === 'No') {
              noValue = 'NO';
            }
            //console.log("gian", documento);
            return [
              { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
              { text: documento.NUMERO, style: ['dinamicTable'] },
              { text: documento.AÑO, style: ['dinamicTable'] },
              { text: documento.EMISOR, style: ['dinamicTable'] },
              { text: documento.DESCRIPCION, style: ['dinamicTable'] },
              { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
              { text: siValue, style: ['dinamicTable'] },
              { text: noValue, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] },
            ];
          })
        )
          ],
        },
        fontSize: 6,
      };
      //CREANDO PDF
      const pdfDefinition: any = {
        
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [bodyContent          ,         '\n',  matrizUsuario        ,     '\n',  matrizLeyes    ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [20, 20, 20, 20],
            alignment: 'center',
          },
          tituloTabla: {
            alignment: 'center',
            bold: true,
            fontSize: 9,
            fillColor: '#eeeeee'
          },
          dinamicTable: {
            fontSize: 6,
            alignment: 'center'
          },
        }
      }               
      const title = "Se descargó correctamente";
      const message = "La descarga se ha realizado exitosamente"
      this.Message.showModal(title, message);
      pdfMake.createPdf(pdfDefinition).open();
      
    });
  }

  generateReporteLaboral(){
    this.actualizarHeader();
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      this.datosReporte = data;
      this.gruposLaboralReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'Laboral y SGSST')
      let bodyContent;
      //SI USERINFOR.LOGO ES NULO CAMBIA EL FORMATO DEL PDF A TIPO TEXT
      if(this.userInfor.LOGO == null){
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                { text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                //{ image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      else{
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                //{ text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                { image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      const matrizUsuario = {
        columns: [
          {
            width: 'auto',
            table: {
              widths: ['auto', '*', '*', '*', '*', '*'],
              body: [
                [     
                  { text: 'COMPONENTE ACTUALIZADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA ACTUALIZACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }

                ],
                [
                  { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.NOMBRE, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'COMPONENTE EVALUADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA EVALUACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'EVALUADOR', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.VALOR, alignment: 'center',rowSpan: 1 }

                ],
                
              ]
            },
            fontSize: 7,
            margin: [0, 0, 27, 0]
          },
          {
            table: {
              heights: [87],
              widths: ['*', '*'],
              body: [
                [     
                  { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                  { text: this.headerLaboral?.RESUMEN, alignment: 'center',rowSpan: 1 }
                ]
              ]
            },
            fontSize: 8,
          },
        ]
      };
      const matrizLeyes = {
        table: {
          widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
          body: [
            [     
              { text: 'REQUISITOS LEGALES', colSpan:10, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '¿APLICA PLAN DE INTERVENCIÓN?', colSpan:2, style: ['tituloTabla'] },
              {},
              { text: 'PLAN DE INTERVENCIÓN', colSpan:5, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
            ],
            [     
              { text: 'TIPO DE NORMATIVIDAD', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'NÚMERO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'AÑO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'EMISOR', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'DESCRIPCIÓN', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ARTÍCULOS / SECCIONES / REQUISITOS ESPECÍFICOS QUE APLICAN', style: ['tituloTabla'] },
              { text: 'ESTADO DE CUMPLIMIENTO (SI/NO/EN PROCESO/NA)', style: ['tituloTabla'], margin:[ 0, 5, 0, 5 ] },
              { text: 'RESPONSABLE DE DAR CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'EVIDENCIA DEL CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'OBSERVACIONES / INCUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'SI', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'NO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ACCIONES A REALIZAR', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA PARA LA  EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'RESPONSABLE DE LA EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA / SEGUIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'ESTADO (ABIERTO / CERRADO)', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
            ],
          // ...this.gruposTurismoReporte.flatMap((item: any) =>
          //   item.DOCUMENTO.map((documento: any) => [
          //     { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
          //     { text: documento.NUMERO, style: ['dinamicTable'] },
          //     { text: documento.AÑO, style: ['dinamicTable'] },
          //     { text: documento.EMISOR, style: ['dinamicTable'] },
          //     { text: documento.DESCRIPCION, style: ['dinamicTable'] },
          //     { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] }
          //   ])
          // ),
        ...this.gruposLaboralReporte.flatMap((item: any) =>
          item.DOCUMENTO.map((documento: any) => {
            const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
            
            let siValue = 'No aplica';
            let noValue = 'No aplica';
            
  
            if (aplicaPlanIntervencion === 'Si') {
              siValue = 'SI';
            } else if (aplicaPlanIntervencion === 'No') {
              noValue = 'NO';
            }
            //console.log("gian", documento);
            return [
              { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
              { text: documento.NUMERO, style: ['dinamicTable'] },
              { text: documento.AÑO, style: ['dinamicTable'] },
              { text: documento.EMISOR, style: ['dinamicTable'] },
              { text: documento.DESCRIPCION, style: ['dinamicTable'] },
              { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
              { text: siValue, style: ['dinamicTable'] },
              { text: noValue, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] },
            ];
          })
        )
          ],
        },
        fontSize: 6,
      };
      //CREANDO PDF
      const pdfDefinition: any = {
        
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [bodyContent          ,         '\n',  matrizUsuario        ,     '\n',  matrizLeyes    ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [20, 20, 20, 20],
            alignment: 'center',
          },
          tituloTabla: {
            alignment: 'center',
            bold: true,
            fontSize: 9,
            fillColor: '#eeeeee'
          },
          dinamicTable: {
            fontSize: 6,
            alignment: 'center'
          },
        }
      }      
      const title = "Se descargó correctamente";
      const message = "La descarga se ha realizado exitosamente"
      this.Message.showModal(title, message);
      pdfMake.createPdf(pdfDefinition).open();
    });
  }

  generateReporteSocial(){
    this.actualizarHeader();
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      this.datosReporte = data;
      this.gruposSocialReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'Social')
      let bodyContent;
      //SI USERINFOR.LOGO ES NULO CAMBIA EL FORMATO DEL PDF A TIPO TEXT
      if(this.userInfor.LOGO == null){
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                { text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                //{ image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      else{
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                //{ text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                { image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      const matrizUsuario = {
        columns: [
          {
            width: 'auto',
            table: {
              widths: ['auto', '*', '*', '*', '*', '*'],
              body: [
                [     
                  { text: 'COMPONENTE ACTUALIZADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA ACTUALIZACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }

                ],
                [
                  { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.NOMBRE, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'COMPONENTE EVALUADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA EVALUACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'EVALUADOR', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.VALOR, alignment: 'center',rowSpan: 1 }

                ],
                
              ]
            },
            fontSize: 7,
            margin: [0, 0, 27, 0]
          },
          {
            table: {
              heights: [87],
              widths: ['*', '*'],
              body: [
                [     
                  { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                  { text: this.headerSocial?.RESUMEN, alignment: 'center',rowSpan: 1 }
                ]
              ]
            },
            fontSize: 8,
          },
        ]
      };
      const matrizLeyes = {
        table: {
          widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
          body: [
            [     
              { text: 'REQUISITOS LEGALES', colSpan:10, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '¿APLICA PLAN DE INTERVENCIÓN?', colSpan:2, style: ['tituloTabla'] },
              {},
              { text: 'PLAN DE INTERVENCIÓN', colSpan:5, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
            ],
            [     
              { text: 'TIPO DE NORMATIVIDAD', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'NÚMERO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'AÑO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'EMISOR', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'DESCRIPCIÓN', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ARTÍCULOS / SECCIONES / REQUISITOS ESPECÍFICOS QUE APLICAN', style: ['tituloTabla'] },
              { text: 'ESTADO DE CUMPLIMIENTO (SI/NO/EN PROCESO/NA)', style: ['tituloTabla'], margin:[ 0, 5, 0, 5 ] },
              { text: 'RESPONSABLE DE DAR CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'EVIDENCIA DEL CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'OBSERVACIONES / INCUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'SI', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'NO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ACCIONES A REALIZAR', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA PARA LA  EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'RESPONSABLE DE LA EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA / SEGUIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'ESTADO (ABIERTO / CERRADO)', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
            ],
          // ...this.gruposTurismoReporte.flatMap((item: any) =>
          //   item.DOCUMENTO.map((documento: any) => [
          //     { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
          //     { text: documento.NUMERO, style: ['dinamicTable'] },
          //     { text: documento.AÑO, style: ['dinamicTable'] },
          //     { text: documento.EMISOR, style: ['dinamicTable'] },
          //     { text: documento.DESCRIPCION, style: ['dinamicTable'] },
          //     { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] }
          //   ])
          // ),
        ...this.gruposSocialReporte.flatMap((item: any) =>
          item.DOCUMENTO.map((documento: any) => {
            const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
            
            let siValue = 'No aplica';
            let noValue = 'No aplica';
            
  
            if (aplicaPlanIntervencion === 'Si') {
              siValue = 'SI';
            } else if (aplicaPlanIntervencion === 'No') {
              noValue = 'NO';
            }
            //console.log("gian", documento);
            return [
              { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
              { text: documento.NUMERO, style: ['dinamicTable'] },
              { text: documento.AÑO, style: ['dinamicTable'] },
              { text: documento.EMISOR, style: ['dinamicTable'] },
              { text: documento.DESCRIPCION, style: ['dinamicTable'] },
              { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
              { text: siValue, style: ['dinamicTable'] },
              { text: noValue, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] },
            ];
          })
        )
          ],
        },
        fontSize: 6,
      };
      //CREANDO PDF
      const pdfDefinition: any = {
        
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [bodyContent          ,         '\n',  matrizUsuario        ,     '\n',  matrizLeyes    ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [20, 20, 20, 20],
            alignment: 'center',
          },
          tituloTabla: {
            alignment: 'center',
            bold: true,
            fontSize: 9,
            fillColor: '#eeeeee'
          },
          dinamicTable: {
            fontSize: 6,
            alignment: 'center'
          },
        }
      }      
      const title = "Se descargó correctamente";
      const message = "La descarga se ha realizado exitosamente"
      this.Message.showModal(title, message);
      pdfMake.createPdf(pdfDefinition).open();
    });
  }

  generateReporteEconomico(){
    this.actualizarHeader();
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      this.datosReporte = data;
      this.gruposEconomicoReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'Economico')
      let bodyContent;
      //SI USERINFOR.LOGO ES NULO CAMBIA EL FORMATO DEL PDF A TIPO TEXT
      if(this.userInfor.LOGO == null){
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                { text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                //{ image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      else{
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                //{ text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                { image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      const matrizUsuario = {
        columns: [
          {
            width: 'auto',
            table: {
              widths: ['auto', '*', '*', '*', '*', '*'],
              body: [
                [     
                  { text: 'COMPONENTE ACTUALIZADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA ACTUALIZACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }

                ],
                [
                  { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.NOMBRE, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'COMPONENTE EVALUADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA EVALUACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'EVALUADOR', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.VALOR, alignment: 'center',rowSpan: 1 }

                ],
                
              ]
            },
            fontSize: 7,
            margin: [0, 0, 27, 0]
          },
          {
            table: {
              heights: [87],
              widths: ['*', '*'],
              body: [
                [     
                  { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                  { text: this.headerEconomico?.RESUMEN, alignment: 'center',rowSpan: 1 }
                ]
              ]
            },
            fontSize: 8,
          },
        ]
      };
      const matrizLeyes = {
        table: {
          widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
          body: [
            [     
              { text: 'REQUISITOS LEGALES', colSpan:10, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '¿APLICA PLAN DE INTERVENCIÓN?', colSpan:2, style: ['tituloTabla'] },
              {},
              { text: 'PLAN DE INTERVENCIÓN', colSpan:5, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
            ],
            [     
              { text: 'TIPO DE NORMATIVIDAD', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'NÚMERO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'AÑO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'EMISOR', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'DESCRIPCIÓN', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ARTÍCULOS / SECCIONES / REQUISITOS ESPECÍFICOS QUE APLICAN', style: ['tituloTabla'] },
              { text: 'ESTADO DE CUMPLIMIENTO (SI/NO/EN PROCESO/NA)', style: ['tituloTabla'], margin:[ 0, 5, 0, 5 ] },
              { text: 'RESPONSABLE DE DAR CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'EVIDENCIA DEL CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'OBSERVACIONES / INCUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'SI', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'NO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ACCIONES A REALIZAR', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA PARA LA  EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'RESPONSABLE DE LA EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA / SEGUIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'ESTADO (ABIERTO / CERRADO)', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
            ],
          // ...this.gruposTurismoReporte.flatMap((item: any) =>
          //   item.DOCUMENTO.map((documento: any) => [
          //     { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
          //     { text: documento.NUMERO, style: ['dinamicTable'] },
          //     { text: documento.AÑO, style: ['dinamicTable'] },
          //     { text: documento.EMISOR, style: ['dinamicTable'] },
          //     { text: documento.DESCRIPCION, style: ['dinamicTable'] },
          //     { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] }
          //   ])
          // ),
        ...this.gruposEconomicoReporte.flatMap((item: any) =>
          item.DOCUMENTO.map((documento: any) => {
            const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
            
            let siValue = 'No aplica';
            let noValue = 'No aplica';
            
  
            if (aplicaPlanIntervencion === 'Si') {
              siValue = 'SI';
            } else if (aplicaPlanIntervencion === 'No') {
              noValue = 'NO';
            }
            //console.log("gian", documento);
            return [
              { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
              { text: documento.NUMERO, style: ['dinamicTable'] },
              { text: documento.AÑO, style: ['dinamicTable'] },
              { text: documento.EMISOR, style: ['dinamicTable'] },
              { text: documento.DESCRIPCION, style: ['dinamicTable'] },
              { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
              { text: siValue, style: ['dinamicTable'] },
              { text: noValue, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] },
            ];
          })
        )
          ],
        },
        fontSize: 6,
      };
      //CREANDO PDF
      const pdfDefinition: any = {
        
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [bodyContent          ,         '\n',  matrizUsuario        ,     '\n',  matrizLeyes    ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [20, 20, 20, 20],
            alignment: 'center',
          },
          tituloTabla: {
            alignment: 'center',
            bold: true,
            fontSize: 9,
            fillColor: '#eeeeee'
          },
          dinamicTable: {
            fontSize: 6,
            alignment: 'center'
          },
        }
      }      
      const title = "Se descargó correctamente";
      const message = "La descarga se ha realizado exitosamente"
      this.Message.showModal(title, message);
      pdfMake.createPdf(pdfDefinition).open();
    });
  }

  generateReporteParticular(){
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      this.datosReporte = data;
      this.gruposParticularReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'NTC 6496 General' || ley.CATEGORIA === 'NTC 6487' || 
      ley.CATEGORIA === 'NTC 6503' || ley.CATEGORIA === 'NTC 6503 Economico' || ley.CATEGORIA === 'NTC 6504' || ley.CATEGORIA === 'NTC 6505'
      || ley.CATEGORIA === 'NTC 6505 Ambiental' || ley.CATEGORIA === 'NTC 6502' || ley.CATEGORIA === 'NTC 6506' || ley.CATEGORIA === 'NTC 6507' || ley.categoria === 'NTC 6523')
      let bodyContent;
      //SI USERINFOR.LOGO ES NULO CAMBIA EL FORMATO DEL PDF A TIPO TEXT
      if(this.userInfor.LOGO == null){
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                { text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                //{ image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      else{
        bodyContent = {
          width: 'auto',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [     
                //{ text: this.userInfor.LOGO, fit:[50, 50], alignment: 'center', rowSpan: 2 },
                { image: this.userInfor.LOGO, fit: [50, 50], alignment: 'center', rowSpan: 2 },
                { text: this.userInfor.RAZON_SOCIAL_PST, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
                { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
                { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
              ],
              [
                {},
                {},
                '',
                { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
              ]
            ]
          }
        }

      }
      const matrizUsuario = {
        columns: [
          {
            width: 'auto',
            table: {
              widths: ['auto', '*', '*', '*', '*', '*'],
              body: [
                [     
                  { text: 'COMPONENTE ACTUALIZADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA ACTUALIZACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }

                ],
                [
                  { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.NOMBRE, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.NOMBRE, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'COMPONENTE EVALUADO', style: ['tituloTabla'] },
                  { text: 'AMBIENTAL', style: ['tituloTabla'] },
                  { text: 'LABORAL Y SGSST', style: ['tituloTabla'] },
                  { text: 'TURISMO', style: ['tituloTabla'] },
                  { text: 'SOCIAL', style: ['tituloTabla'] },
                  { text: 'ECONÓMICO', style: ['tituloTabla'] }
                ],
                [
                  { text: 'FECHA ÚLTIMA EVALUACIÓN', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.PLAN_FECHA_SEGUIMIENTO, alignment: 'center',rowSpan: 1 }
                ],
                [
                  { text: 'EVALUADOR', style: ['tituloTabla'] },
                  { text: this.headerAmbiental?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerLaboral?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerTurismo?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerSocial?.VALOR, alignment: 'center',rowSpan: 1 },
                  { text: this.headerEconomico?.VALOR, alignment: 'center',rowSpan: 1 }

                ],
                
              ]
            },
            fontSize: 7,
            margin: [0, 0, 27, 0]
          },
          {
            table: {
              heights: [87],
              widths: ['*', '*'],
              body: [
                [     
                  { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                  { text: this.descripcionResumen6, alignment: 'center',rowSpan: 1 }
                ]
              ]
            },
            fontSize: 8,
          },
        ]
      };
      const matrizLeyes = {
        table: {
          widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
          body: [
            [     
              { text: 'REQUISITOS LEGALES', colSpan:10, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '¿APLICA PLAN DE INTERVENCIÓN?', colSpan:2, style: ['tituloTabla'] },
              {},
              { text: 'PLAN DE INTERVENCIÓN', colSpan:5, style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              {},
              {},
              {},
              {},
            ],
            [     
              { text: 'TIPO DE NORMATIVIDAD', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'NÚMERO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'AÑO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'EMISOR', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'DESCRIPCIÓN', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ARTÍCULOS / SECCIONES / REQUISITOS ESPECÍFICOS QUE APLICAN', style: ['tituloTabla'] },
              { text: 'ESTADO DE CUMPLIMIENTO (SI/NO/EN PROCESO/NA)', style: ['tituloTabla'], margin:[ 0, 5, 0, 5 ] },
              { text: 'RESPONSABLE DE DAR CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'EVIDENCIA DEL CUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'OBSERVACIONES / INCUMPLIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'SI', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'NO', style: ['tituloTabla'], margin:[ 0, 21, 0, 21 ] },
              { text: 'ACCIONES A REALIZAR', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA PARA LA  EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'RESPONSABLE DE LA EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
              { text: 'FECHA / SEGUIMIENTO', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'ESTADO (ABIERTO / CERRADO)', style: ['tituloTabla'], margin:[ 0, 10, 0, 10 ] },
            ],
          // ...this.gruposTurismoReporte.flatMap((item: any) =>
          //   item.DOCUMENTO.map((documento: any) => [
          //     { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
          //     { text: documento.NUMERO, style: ['dinamicTable'] },
          //     { text: documento.AÑO, style: ['dinamicTable'] },
          //     { text: documento.EMISOR, style: ['dinamicTable'] },
          //     { text: documento.DESCRIPCION, style: ['dinamicTable'] },
          //     { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
          //     { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] }
          //   ])
          // ),
        ...this.gruposParticularReporte.flatMap((item: any) =>
          item.DOCUMENTO.map((documento: any) => {
            const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
            
            let siValue = 'No aplica';
            let noValue = 'No aplica';
            
  
            if (aplicaPlanIntervencion === 'Si') {
              siValue = 'SI';
            } else if (aplicaPlanIntervencion === 'No') {
              noValue = 'NO';
            }
            //console.log("gian", documento);
            return [
              { text: documento.TIPO_NORMATIVIDAD, style: ['dinamicTable'] },
              { text: documento.NUMERO, style: ['dinamicTable'] },
              { text: documento.AÑO, style: ['dinamicTable'] },
              { text: documento.EMISOR, style: ['dinamicTable'] },
              { text: documento.DESCRIPCION, style: ['dinamicTable'] },
              { text: documento.ARTICULOS_SECCIONES_REQUISITOS_APLICAN, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].EVIDENCIA_CUMPLIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].OBSERVACIONES_INCUMPLIMIENTO, style: ['dinamicTable'] },
              { text: siValue, style: ['dinamicTable'] },
              { text: noValue, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ACCION_A_REALIZAR, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].RESPONSABLE_EJECUCION, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].FECHA_SEGUIMIENTO, style: ['dinamicTable'] },
              { text: documento.RESPUESTAS[0].ESTADO, style: ['dinamicTable'] },
            ];
          })
        )
          ],
        },
        fontSize: 6,
      };
      //CREANDO PDF
      const pdfDefinition: any = {
        
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [bodyContent          ,         '\n',  matrizUsuario        ,     '\n',  matrizLeyes    ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            margin: [20, 20, 20, 20],
            alignment: 'center',
          },
          tituloTabla: {
            alignment: 'center',
            bold: true,
            fontSize: 9,
            fillColor: '#eeeeee'
          },
          dinamicTable: {
            fontSize: 6,
            alignment: 'center'
          },
        }
      }      
      const title = "Se descargó correctamente";
      const message = "La descarga se ha realizado exitosamente"
      this.Message.showModal(title, message);
      pdfMake.createPdf(pdfDefinition).open();
    });
  }

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }

  disabletabsModificar(){
    if(this.tabActual == 'tab1'){
      this.disabledTabs2 = !this.disabledTabs2;
      this.disabledTabs3 = !this.disabledTabs3;
      this.disabledTabs4 = !this.disabledTabs4;
      this.disabledTabs5 = !this.disabledTabs5;
      this.disabledTabs6 = !this.disabledTabs6;
    }
    if(this.tabActual == 'tab2'){
      this.disabledTabs1 = !this.disabledTabs1;
      this.disabledTabs3 = !this.disabledTabs3;
      this.disabledTabs4 = !this.disabledTabs4;
      this.disabledTabs5 = !this.disabledTabs5;
      this.disabledTabs6 = !this.disabledTabs6;
    }
    if(this.tabActual == 'tab3'){
      this.disabledTabs2 = !this.disabledTabs2;
      this.disabledTabs1 = !this.disabledTabs1;
      this.disabledTabs4 = !this.disabledTabs4;
      this.disabledTabs5 = !this.disabledTabs5;
      this.disabledTabs6 = !this.disabledTabs6;
    }
    if(this.tabActual == 'tab4'){
      this.disabledTabs2 = !this.disabledTabs2;
      this.disabledTabs3 = !this.disabledTabs3;
      this.disabledTabs1 = !this.disabledTabs1;
      this.disabledTabs5 = !this.disabledTabs5;
      this.disabledTabs6 = !this.disabledTabs6;
    }
    if(this.tabActual == 'tab5'){
      this.disabledTabs2 = !this.disabledTabs2;
      this.disabledTabs3 = !this.disabledTabs3;
      this.disabledTabs4 = !this.disabledTabs4;
      this.disabledTabs1 = !this.disabledTabs1;
      this.disabledTabs6 = !this.disabledTabs6;
    }
    if(this.tabActual == 'tab6'){
      this.disabledTabs2 = !this.disabledTabs2;
      this.disabledTabs3 = !this.disabledTabs3;
      this.disabledTabs4 = !this.disabledTabs4;
      this.disabledTabs5 = !this.disabledTabs5;
      this.disabledTabs1 = !this.disabledTabs1;
    }
  }

  modificarBloquearCampos(){
    
      this.disabledModificar = !this.disabledModificar;
      this.disabletabsModificar();   
    if(this.disabledModificar == true ){
      this.showModal = true;
        const title = "Modificar Reporte";
        const message = "Despliegue una de las leyes y proceda a editar";
        this.Message.showModal(title, message);

    }
    
  }
  modificarBloquearCampos2(){
    
    this.disabledModificar = !this.disabledModificar;
    this.disabletabsModificar(); 
  
}
guardaMatrizModificada(){
  var arrayMatrices: any=[];
    arrayMatrices = localStorage.getItem('MiArrayTemporal');

    if(arrayMatrices != null){
      this.showModalResumen=!this.showModalResumen;
    }

}

terminarModificarCampos(){
    this.modificarBloquearCampos();
    this.guardaMatrizModificada();
  }
  terminarModificarCampos2(){
    this.modificarBloquearCampos2();
   this.guardaMatrizModificada();

  }
  guardarTextArea(){
    // const textAreaModal = document.getElementById("textAreaModal") as HTMLTextAreaElement
    // this.texto = textAreaModal.value;
    // console.log("asd", this.texto);
    
    const descripcion = this.saveForm.value.descripcionNoticia;
     // if(this.tabActual == 'tab1'){
    //   this.descripcionResumen1 = descripcion;
    //   console.log(this.descripcionResumen1)
    // }
    // if(this.tabActual == 'tab2'){
    //   this.descripcionResumen2 = descripcion;
    //   console.log(this.descripcionResumen2)
    // }
    // if(this.tabActual == 'tab3'){
    //   this.descripcionResumen3 = descripcion;
    //   console.log(this.descripcionResumen3)
    // }
    // if(this.tabActual == 'tab4'){
    //   this.descripcionResumen4 = descripcion;
    // }
    // if(this.tabActual == 'tab5'){
    //   this.descripcionResumen5 = descripcion;
    // }
    if(this.tabActual == 'tab6'){
      this.descripcionResumen6 = descripcion;
    }  
    var datosLocalStorage=localStorage.getItem('MiArrayTemporal');
    var arrayID = datosLocalStorage.split(',');
    arrayID.forEach(element => {
      const data = {
        FK_ID_USUARIO: window.localStorage.getItem('Id'),
        FK_ID_MATRIZ_LEGAL: element,
        RESUMEN: descripcion
      }
      this.ApiService.saveRespuestaMatrizResumen(data).subscribe((x:any)=>{
        console.log('Se guardó correctamente: 2', x);
      })
      
    });
    


    
    
    this.showModalResumen=!this.showModalResumen;
    const title = "Guardado exitoso";
    const message = "Se ha guardado correctamente"
    this.Message.showModal(title,message);
    //remover array
    localStorage.removeItem('MiArrayTemporal');


    //BORRA EL CONTENIDO DEL TEXT AREA AL SER CONSULTADO POR 2DA VEZ EN LA MISMA SESION
    this.saveForm.reset();
    
    

  }


  eliminarBloquearCampos(){
    this.disabledEliminar = !this.disabledEliminar;
  
    if(this.tabActual == 'tab1'){
      this.disabledTabs2 = !this.disabledTabs2;
      this.disabledTabs3 = !this.disabledTabs3;
      this.disabledTabs4 = !this.disabledTabs4;
      this.disabledTabs5 = !this.disabledTabs5;
      this.disabledTabs6 = !this.disabledTabs6;
      if(this.adicionarVisibleTurismo == true){
        this.toggleSection('adicionarTurismo');
      }
      
    }
    if(this.tabActual == 'tab2'){
      this.disabledTabs1 = !this.disabledTabs1;
      this.disabledTabs3 = !this.disabledTabs3;
      this.disabledTabs4 = !this.disabledTabs4;
      this.disabledTabs5 = !this.disabledTabs5;
      this.disabledTabs6 = !this.disabledTabs6;
      if(this.adicionarVisibleAmbiental == true){
        this.toggleSection('adicionarAmbiental');
      }
    }
    if(this.tabActual == 'tab3'){
      this.disabledTabs2 = !this.disabledTabs2;
      this.disabledTabs1 = !this.disabledTabs1;
      this.disabledTabs4 = !this.disabledTabs4;
      this.disabledTabs5 = !this.disabledTabs5;
      this.disabledTabs6 = !this.disabledTabs6;
      if(this.adicionarVisibleLaboral == true){
        this.toggleSection('adicionarLaboral');
      }
    }
    if(this.tabActual == 'tab4'){
      this.disabledTabs2 = !this.disabledTabs2;
      this.disabledTabs3 = !this.disabledTabs3;
      this.disabledTabs1 = !this.disabledTabs1;
      this.disabledTabs5 = !this.disabledTabs5;
      this.disabledTabs6 = !this.disabledTabs6;
      if(this.adicionarVisibleSocial == true){
        this.toggleSection('adicionarSocial');
      }
    }
    if(this.tabActual == 'tab5'){
      this.disabledTabs2 = !this.disabledTabs2;
      this.disabledTabs3 = !this.disabledTabs3;
      this.disabledTabs4 = !this.disabledTabs4;
      this.disabledTabs1 = !this.disabledTabs1;
      this.disabledTabs6 = !this.disabledTabs6;
      if(this.adicionarVisibleEconomico == true){
        this.toggleSection('adicionarEconomico');
      }
    }
    if(this.tabActual == 'tab6'){
      this.disabledTabs2 = !this.disabledTabs2;
      this.disabledTabs3 = !this.disabledTabs3;
      this.disabledTabs4 = !this.disabledTabs4;
      this.disabledTabs5 = !this.disabledTabs5;
      this.disabledTabs1 = !this.disabledTabs1;
      if(this.adicionarVisibleParticular == true){
        this.toggleSection('adicionarParticular');
      }
    }
    if(this.disabledEliminar == true){

      this.showModal = true;
        const title = "Eliminar Requisito Legal";
        const message = "Despliegue una de las leyes habilitadas y proceda a eliminar";
        this.Message.showModal(title, message);

    }
    
  }

  
}
