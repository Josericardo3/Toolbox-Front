import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder,FormControl, NgForm } from '@angular/forms'
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { Subscription } from 'rxjs';
import { AppFormularioComponent } from '../formulario/app-formulario/app-formulario.component';
import { FormService } from 'src/app/servicios/form/form.service';
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
  leyesAmbiental: any[] = [];
  leyesLaboral: any[] = [];
  leyesSocial: any[] = [];
  leyesEconomico: any[] = [];
  leyesParticular: any[] = [];

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

  descripcion: string;
  secciones: string;
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
  subscriptions: any;

  leyesVisibles: boolean[] = [];
  datosUsuario: any = [];
  pst: any;
  logo: any;
  estadoFormulario: any;
  public idMatriz: number | null = null;

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private Message: ModalService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.separarCategoria();

    this.ApiService.getUsuario()
    .subscribe((data: any) => {
      this.datosUsuario = data;
      this.pst = data.nombrePst;
      this.logo = data.logo
    })

    this.tab1Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: ['', Validators.required]
    });

    this.tab2Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: ['', Validators.required],
    });

    this.tab3Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: ['', Validators.required],
    });

    this.tab4Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: ['', Validators.required],
    });

    this.tab5Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: ['', Validators.required],
    });

    this.tab6Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: ['', Validators.required],
    });
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
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
          });
        }
        return acumulador;
      }, {});
      this.leyesTurismo = Object.values(gruposTurismo);
      const gruposAmbiental = this.datos.filter((ley) => ley.CATEGORIA === 'Ambiental' || ley.CATEGORIA === 'NTC 6496 Ambiental')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
         if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
          });
        }
        return acumulador;
      }, {});
      this.leyesAmbiental = Object.values(gruposAmbiental);

      const gruposLaboral = this.datos.filter((ley) => ley.CATEGORIA === 'Laboral y SGSST')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
          });
        }
        return acumulador;
      }, {});
      this.leyesLaboral = Object.values(gruposLaboral);

      const gruposSocial = this.datos.filter((ley) => ley.CATEGORIA === 'Social')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
          });
        }
        return acumulador;
      }, {});
      this.leyesSocial = Object.values(gruposSocial);

      const gruposEconomico = this.datos.filter((ley) => ley.CATEGORIA === 'Economico')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
          });
        }
        return acumulador;
      }, {});
      this.leyesEconomico = Object.values(gruposEconomico);

      const gruposParticular = this.datos.filter((ley) => ley.CATEGORIA === 'NTC 6496 General' || ley.CATEGORIA === 'NTC 6487' || 
      ley.CATEGORIA === 'NTC 6503' || ley.CATEGORIA === 'NTC 6503 Economico' || ley.CATEGORIA === 'NTC 6504' || ley.CATEGORIA === 'NTC 6505'
      || ley.CATEGORIA === 'NTC 6505 Ambiental' || ley.CATEGORIA === 'NTC 6502' || ley.CATEGORIA === 'NTC 6506' || ley.CATEGORIA === 'NTC 6507' || ley.categoria === 'NTC 6523')
      .reduce((acumulador, ley) => {
        const clave = ley.TIPO_NORMATIVIDAD + ley.NUMERO + ley.ANIO;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,           
            subLeyes: [{
              ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
              RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
              DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
              PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
              PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
              PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
              PLAN_ESTADO: ley.PLAN_ESTADO,
              ID_MATRIZ: ley.ID_MATRIZ,
              DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
            }],
          };
        } else {
          acumulador[clave].subLeyes.push({
            ESTADO_CUMPLIMIENTO: ley.ESTADO_CUMPLIMIENTO,
            RESPONSABLE_CUMPLIMIENTO: ley.RESPONSABLE_CUMPLIMIENTO,
            DATA_CUMPLIMIENTO: ley.DATA_CUMPLIMIENTO,
            PLAN_ACCIONES_A_REALIZAR: ley.PLAN_ACCIONES_A_REALIZAR,
            PLAN_RESPONSABLE_CUMPLIMIENTO: ley.PLAN_RESPONSABLE_CUMPLIMIENTO,
            PLAN_FECHA_EJECUCION: ley.PLAN_FECHA_EJECUCION,
            PLAN_ESTADO: ley.PLAN_ESTADO,
            ID_MATRIZ: ley.ID_MATRIZ,
            DOCS_ESPECIFICOS: ley.DOCS_ESPECIFICOS,
          });
        }
        return acumulador;
      }, {});
      this.leyesParticular = Object.values(gruposParticular);
      // this.leyesParticular = this.datos.filter((ley) => ley.categoria === 'Turismo'); // ¿cuál es la categoría?
      
     });
  }

  cambiarTab(tab: string) {
    this.tabActual = tab;
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

  onSelect(value: string) {
    this.selectedOption = value;
  }

  onOtroInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.otroValor = inputElement.value;
  }

  agregarDiv() {
    const anio = (document.querySelector('#anioInput') as HTMLInputElement).value;
    const numero = (document.querySelector('#numeroInput') as HTMLInputElement).value;
    const descripcion = (document.querySelector('#descripcionTextAreaAdd') as HTMLTextAreaElement).value;
    const secciones = (document.querySelector('#seccionesTextAreaAdd') as HTMLTextAreaElement).value;
    // const tipoNormatividad = this.selectedOption === 'otro' ? (document.querySelector('#otroInput') as HTMLInputElement).value : this.selectedOption;
    // this.tipoNormatividad = this.selectedOption === 'otro' ? this.otroValor : this.selectedOption;
    this.tipoNormatividad = this.selectedOption === 'otro' ? this.otroValor : this.selectedOption;
  
    if (this.tipoNormatividad === 'otro') {
      this.tipoNormatividad = this.otroValor;
    }
    
    this.nuevoDiv = {
      anio: anio,
      numero: numero,
      descripcion: descripcion,
      secciones: secciones,
      tipoNormatividad: this.tipoNormatividad
    };

    if (this.tabActual === 'tab1') {
      this.divsTab1.push(this.nuevoDiv);
    } else if (this.tabActual === 'tab2') {
      this.divsTab2.push(this.nuevoDiv);
    } else if (this.tabActual === 'tab3') {
      this.divsTab3.push(this.nuevoDiv);
    } else if (this.tabActual === 'tab4') {
      this.divsTab4.push(this.nuevoDiv);
    } else if (this.tabActual === 'tab5') {
      this.divsTab5.push(this.nuevoDiv);
    } else if (this.tabActual === 'tab6') {
      this.divsTab6.push(this.nuevoDiv);
    }

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
      const titulos = document.querySelectorAll('.titulo h3');
      titulos.forEach((titulo) => {
          const tituloString = titulo.textContent.toLowerCase();
          if (tituloString.includes(this.busqueda.toLowerCase())) {
              titulo.parentElement.parentElement.style.display = 'block';
          } else {
              titulo.parentElement.parentElement.style.display = 'none';
          }
      });
  }

  generateReporteTurismo(){
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      this.datosReporte = data;
      this.gruposTurismoReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'Turismo')   
      const pdfDefinition: any = {
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [
          // {
          //   width: 'auto',
          //   table: {
          //     widths: ['*', '*', '*', '*'],
          //     body: [
          //       [     
          //         { image: this.logo, fit:[50, 50], alignment: 'center', rowSpan: 2 },
          //         { text: this.pst, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
          //         { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
          //         { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
          //       ],
          //       [
          //         {},
          //         {},
          //         '',
          //         { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
          //       ]
          //     ]
          //   }
          // },
          // '\n',
          {
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'EVALUADOR', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
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
                      {}
                    ]
                  ]
                },
                fontSize: 8,
              },
            ]
          },
          '\n',
          {
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
              // )
            ...this.gruposTurismoReporte.flatMap((item: any) =>
              item.DOCUMENTO.map((documento: any) => {
                const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
                let siValue = '';
                let noValue = '';
      
                if (aplicaPlanIntervencion === 'si') {
                  siValue = 'SI';
                } else if (aplicaPlanIntervencion === 'no') {
                  noValue = 'NO';
                }
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
          }
        ],
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

  generateReporteAmbiental(){
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      this.datosReporte = data;
      this.gruposAmbientalReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'Ambiental' || ley.CATEGORIA === 'NTC 6496 Ambiental')
      const pdfDefinition: any = {
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [
          // {
          //   width: 'auto',
          //   table: {
          //     widths: ['*', '*', '*', '*'],
          //     body: [
          //       [     
          //         { image: this.logo, fit:[50, 50], alignment: 'center', rowSpan: 2 },
          //         { text: this.pst, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
          //         { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
          //         { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
          //       ],
          //       [
          //         {},
          //         {},
          //         '',
          //         { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
          //       ]
          //     ]
          //   }
          // },
          // '\n',
          {
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'EVALUADOR', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                  ]
                },
                fontSize: 8,
                margin: [0, 0, 27, 0]
              },
              {
                width: 'auto',
                table: {
                  heights: [87],
                  widths: ['*', '*'],
                  body: [
                    [     
                      { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                      {}
                    ]
                  ]
                },
                fontSize: 8,
              },
            ]
          },
          '\n',
          {
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
                  { text: 'ARTÍCULOS / SECCIONES /  REQUISITOS ESPECÍFICOS  QUE APLICAN', style: ['tituloTabla'] },
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
                ...this.gruposAmbientalReporte.flatMap((item: any) =>
                item.DOCUMENTO.map((documento: any) => {
                  const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
                  let siValue = '';
                  let noValue = '';
        
                  if (aplicaPlanIntervencion === 'si') {
                    siValue = 'SI';
                  } else if (aplicaPlanIntervencion === 'no') {
                    noValue = 'NO';
                  }
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
              ]
            },
            fontSize: 6,
          }
        ],
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
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      this.datosReporte = data;
      this.gruposLaboralReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'Laboral y SGSST')
      const pdfDefinition: any = {
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [
          // {
          //   width: 'auto',
          //   table: {
          //     widths: ['*', '*', '*', '*'],
          //     body: [
          //       [     
          //         { image: this.logo, fit:[50, 50], alignment: 'center', rowSpan: 2 },
          //         { text: this.pst, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
          //         { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
          //         { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
          //       ],
          //       [
          //         {},
          //         {},
          //         '',
          //         { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
          //       ]
          //     ]
          //   }
          // },
          // '\n',
          {
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'EVALUADOR', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                  ]
                },
                fontSize: 8,
                margin: [0, 0, 27, 0]
              },
              {
                width: 'auto',
                table: {
                  heights: [87],
                  widths: ['*', '*'],
                  body: [
                    [     
                      { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                      {}
                    ]
                  ]
                },
                fontSize: 8,
              },
            ]
          },
          '\n',
          {
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
                  { text: 'ARTÍCULOS / SECCIONES /  REQUISITOS ESPECÍFICOS  QUE APLICAN', style: ['tituloTabla'] },
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
                ...this.gruposLaboralReporte.flatMap((item: any) =>
                item.DOCUMENTO.map((documento: any) => {
                  const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
                  let siValue = '';
                  let noValue = '';
        
                  if (aplicaPlanIntervencion === 'si') {
                    siValue = 'SI';
                  } else if (aplicaPlanIntervencion === 'no') {
                    noValue = 'NO';
                  }
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
              ]
            },
            fontSize: 6,
          }
        ],
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
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      this.datosReporte = data;
      this.gruposSocialReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'Social')
      const pdfDefinition: any = {
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [
          // {
          //   width: 'auto',
          //   table: {
          //     widths: ['*', '*', '*', '*'],
          //     body: [
          //       [     
          //         { image: this.logo, fit:[50, 50], alignment: 'center', rowSpan: 2 },
          //         { text: this.pst, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
          //         { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
          //         { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
          //       ],
          //       [
          //         {},
          //         {},
          //         '',
          //         { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
          //       ]
          //     ]
          //   }
          // },
          // '\n',
          {
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'EVALUADOR', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                  ]
                },
                fontSize: 8,
                margin: [0, 0, 27, 0]
              },
              {
                width: 'auto',
                table: {
                  heights: [87],
                  widths: ['*', '*'],
                  body: [
                    [     
                      { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                      {}
                    ]
                  ]
                },
                fontSize: 8,
              },
            ]
          },
          '\n',
          {
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
                  { text: 'ARTÍCULOS / SECCIONES /  REQUISITOS ESPECÍFICOS  QUE APLICAN', style: ['tituloTabla'] },
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
                ...this.gruposSocialReporte.flatMap((item: any) =>
                item.DOCUMENTO.map((documento: any) => {
                  const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
                  let siValue = '';
                  let noValue = '';
        
                  if (aplicaPlanIntervencion === 'si') {
                    siValue = 'SI';
                  } else if (aplicaPlanIntervencion === 'no') {
                    noValue = 'NO';
                  }
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
              ]
            },
            fontSize: 6,
          }
        ],
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
    this.ApiService.gertArchivoMatriz()
    .subscribe((data: any) => {
      this.datosReporte = data;
      this.gruposEconomicoReporte = this.datosReporte.filter((ley) => ley.CATEGORIA === 'Economico')
      const pdfDefinition: any = {
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [
          // {
          //   width: 'auto',
          //   table: {
          //     widths: ['*', '*', '*', '*'],
          //     body: [
          //       [     
          //         { image: this.logo, fit:[50, 50], alignment: 'center', rowSpan: 2 },
          //         { text: this.pst, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
          //         { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
          //         { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
          //       ],
          //       [
          //         {},
          //         {},
          //         '',
          //         { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
          //       ]
          //     ]
          //   }
          // },
          // '\n',
          {
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'EVALUADOR', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                  ]
                },
                fontSize: 8,
                margin: [0, 0, 27, 0]
              },
              {
                width: 'auto',
                table: {
                  heights: [87],
                  widths: ['*', '*'],
                  body: [
                    [     
                      { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                      {}
                    ]
                  ]
                },
                fontSize: 8,
              },
            ]
          },
          '\n',
          {
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
                  { text: 'ARTÍCULOS / SECCIONES /  REQUISITOS ESPECÍFICOS  QUE APLICAN', style: ['tituloTabla'] },
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
                ...this.gruposEconomicoReporte.flatMap((item: any) =>
                item.DOCUMENTO.map((documento: any) => {
                  const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
                  let siValue = '';
                  let noValue = '';
        
                  if (aplicaPlanIntervencion === 'si') {
                    siValue = 'SI';
                  } else if (aplicaPlanIntervencion === 'no') {
                    noValue = 'NO';
                  }
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
              ]
            },
            fontSize: 6,
          }
        ],
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
      const pdfDefinition: any = {
        pageSize: {
          width: 794,
          height: 1123,
        },
        pageOrientation: 'landscape',
        pageMargins: [ 15, 60, 15, 60 ],
        content: [
          // {
          //   width: 'auto',
          //   table: {
          //     widths: ['*', '*', '*', '*'],
          //     body: [
          //       [     
          //         { image: this.logo, fit:[50, 50], alignment: 'center', rowSpan: 2 },
          //         { text: this.pst, alignment: 'center', margin:[ 0, 15, 0, 15 ], rowSpan: 2},
          //         { text:'MATRIZ DE REQUISITOS LEGALES', alignment: 'center', margin:[ 0, 15, 0, 15 ],rowSpan: 2 },
          //         { text: 'CÓDIGO: GS-M-01', alignment: 'center', margin:[ 0, 2, 0, 2 ] }
          //       ],
          //       [
          //         {},
          //         {},
          //         '',
          //         { text: 'VERSIÓN: 01', alignment: 'center', margin:[ 0, 2, 0, 2 ] },
          //       ]
          //     ]
          //   }
          // },
          // '\n',
          {
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'NOMBRE DE QUIÉN ACTUALIZA', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
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
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      { text: 'EVALUADOR', style: ['tituloTabla'] },
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                  ]
                },
                fontSize: 8,
                margin: [0, 0, 27, 0]
              },
              {
                width: 'auto',
                table: {
                  heights: [87],
                  widths: ['*', '*'],
                  body: [
                    [     
                      { text: 'BREVE RESUMEN DE NORMATIVIDAD QUE SE ACTUALIZA', style: ['tituloTabla'], margin:[ 0, 36, 0, 36 ] },
                      {}
                    ]
                  ]
                },
                fontSize: 8,
              },
            ]
          },
          '\n',
          {
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
                  { text: 'ARTÍCULOS / SECCIONES /  REQUISITOS ESPECÍFICOS  QUE APLICAN', style: ['tituloTabla'] },
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
                ...this.gruposParticularReporte.flatMap((item: any) =>
                item.DOCUMENTO.map((documento: any) => {
                  const aplicaPlanIntervencion = documento.RESPUESTAS[0].APLICA_PLAN_INTERVENCION;
                  let siValue = '';
                  let noValue = '';
        
                  if (aplicaPlanIntervencion === 'si') {
                    siValue = 'SI';
                  } else if (aplicaPlanIntervencion === 'no') {
                    noValue = 'NO';
                  }
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
              ]
            },
            fontSize: 6,
          }
        ],
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
}
