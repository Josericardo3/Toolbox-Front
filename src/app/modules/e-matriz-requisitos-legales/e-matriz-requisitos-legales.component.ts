import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms'

@Component({
  selector: 'app-e-matriz-requisitos-legales',
  templateUrl: './e-matriz-requisitos-legales.component.html',
  styleUrls: ['./e-matriz-requisitos-legales.component.css']
})

export class EMatrizRequisitosLegalesComponent implements OnInit{
  // @ViewChild('nuevoDiv', {static: true}) nuevoDivRef!: TemplateRef<any>;
  // @ViewChild('container', {read: ViewContainerRef}) containerRef!: ViewContainerRef;

  @ViewChild('containers', { read: ViewContainerRef }) containers: ViewContainerRef;
  @ViewChild('inputTemplate') inputTemplate: TemplateRef<any>;
  @ViewChild('divsContainer', { read: ViewContainerRef }) divsContainer: ViewContainerRef;
  divsVisible = false;

  datos: any = [];
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

  leyesVisibles: boolean[] = [];

  descripcion: string;
  secciones: string;
  numero: string;
  anio: string;
  selectedOption: string = '';
  busqueda: string = '';
  nuevoDiv: any;
  tabActual = 'tab1';

  opcionSeleccionada: string = '';
  responsableSeleccionado: string = '';
  evidenciaInput: string = '';
  observacionInput: string = '';
  accionesText: string = '';
  responsablePlanSeleccionado: string = '';
  fechaInput: string = '';
  estadoSeleccionado: string = '';

  divs: any[] = [{}];
  divsTab1 = [];
  divsTab2 = [];
  divsTab3 = [];
  divsTab4 = [];
  divsTab5 = [];
  divsTab6 = [];

  public tab1Form!: FormGroup
  public tab2Form!: FormGroup
  public tab3Form!: FormGroup
  public tab4Form!: FormGroup
  public tab5Form!: FormGroup
  public tab6Form!: FormGroup

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit() {
    this.separarCategoria();

    this.tab1Form = this.formBuilder.group({
      tipoNormatividad: ['', Validators.required],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: ['', Validators.required],
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
      const gruposTurismo = this.datos.filter((ley) => ley.categoria === 'Turismo')
      .reduce((acumulador, ley) => {
        const clave = ley.tipO_NORMATIVIDAD + ley.numero + ley.anio;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,
            docS_ESPECIFICOS: [ley.docS_ESPECIFICOS],
          };
        } else {
          acumulador[clave].docS_ESPECIFICOS.push(ley.docS_ESPECIFICOS);
        }
        return acumulador;
      }, {});
      this.leyesTurismo = Object.values(gruposTurismo);

      const gruposAmbiental = this.datos.filter((ley) => ley.categoria === 'Ambiental' || ley.categoria === 'NTC 6496 Ambiental')
      .reduce((acumulador, ley) => {
        const clave = ley.tipO_NORMATIVIDAD + ley.numero + ley.anio;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,
            docS_ESPECIFICOS: [ley.docS_ESPECIFICOS],
          };
        } else {
          acumulador[clave].docS_ESPECIFICOS.push(ley.docS_ESPECIFICOS);
        }
        return acumulador;
      }, {});
      this.leyesAmbiental = Object.values(gruposAmbiental);

      const gruposLaboral = this.datos.filter((ley) => ley.categoria === 'Laboral y SGSST')
      .reduce((acumulador, ley) => {
        const clave = ley.tipO_NORMATIVIDAD + ley.numero + ley.anio;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,
            docS_ESPECIFICOS: [ley.docS_ESPECIFICOS],
          };
        } else {
          acumulador[clave].docS_ESPECIFICOS.push(ley.docS_ESPECIFICOS);
        }
        return acumulador;
      }, {});
      this.leyesLaboral = Object.values(gruposLaboral);

      const gruposSocial = this.datos.filter((ley) => ley.categoria === 'Social')
      .reduce((acumulador, ley) => {
        const clave = ley.tipO_NORMATIVIDAD + ley.numero + ley.anio;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,
            docS_ESPECIFICOS: [ley.docS_ESPECIFICOS],
          };
        } else {
          acumulador[clave].docS_ESPECIFICOS.push(ley.docS_ESPECIFICOS);
        }
        return acumulador;
      }, {});
      this.leyesSocial = Object.values(gruposSocial);

      const gruposEconomico = this.datos.filter((ley) => ley.categoria === 'Economico')
      .reduce((acumulador, ley) => {
        const clave = ley.tipO_NORMATIVIDAD + ley.numero + ley.anio;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,
            docS_ESPECIFICOS: [ley.docS_ESPECIFICOS],
          };
        } else {
          acumulador[clave].docS_ESPECIFICOS.push(ley.docS_ESPECIFICOS);
        }
        return acumulador;
      }, {});
      this.leyesEconomico = Object.values(gruposEconomico);

      const gruposParticular = this.datos.filter((ley) => ley.categoria === 'NTC 6496 General')
      .reduce((acumulador, ley) => {
        const clave = ley.tipO_NORMATIVIDAD + ley.numero + ley.anio;
        if (!acumulador[clave]) {
          acumulador[clave] = {
            ...ley,
            docS_ESPECIFICOS: [ley.docS_ESPECIFICOS],
          };
        } else {
          acumulador[clave].docS_ESPECIFICOS.push(ley.docS_ESPECIFICOS);
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
  
  toggleSectionLey(section, index) {
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
    if (value === 'otro') {
      const otroInput = document.querySelector('#otroInput') as HTMLInputElement;
      otroInput.style.display = 'block';
    } else {
      const otroInput = document.querySelector('#otroInput') as HTMLInputElement;
      otroInput.style.display = 'none';
    }
  }
  
  agregarDiv() {
    const anio = (document.querySelector('#anioInput') as HTMLInputElement).value;
    const numero = (document.querySelector('#numeroInput') as HTMLInputElement).value;
    const descripcion = (document.querySelector('#descripcionTextAreaAdd') as HTMLTextAreaElement).value;
    const secciones = (document.querySelector('#seccionesTextAreaAdd') as HTMLTextAreaElement).value;
    const tipoNormatividad = this.selectedOption === 'otro' ? (document.querySelector('#otroInput') as HTMLInputElement).value : this.selectedOption;
  
    this.nuevoDiv = {
      anio: anio,
      numero: numero,
      descripcion: descripcion,
      secciones: secciones,
      tipoNormatividad: tipoNormatividad
    };
  
    const divA = this.tab1Form.value;
    this.divsTab1.push(divA); // Agrega el div a la lista específica del tab1
    const divB = this.tab2Form.value;
    this.divsTab2.push(divB);
    const divC = this.tab3Form.value;
    this.divsTab3.push(divC);
    const divD = this.tab4Form.value;
    this.divsTab4.push(divD);
    const divE = this.tab5Form.value;
    this.divsTab5.push(divE);
    const divF = this.tab6Form.value;
    this.divsTab6.push(divF);
    // this.divs.push(this.nuevoDiv);

    this.divsVisible = true;
      // Limpiar
      (document.querySelector('#tipoNormatividadSelect') as HTMLSelectElement).value = "";
      (document.querySelector('#numeroInput') as HTMLInputElement).value = "";
      (document.querySelector('#anioInput') as HTMLInputElement).value = "";
      (document.querySelector('#descripcionTextAreaAdd') as HTMLTextAreaElement).value = "";
      (document.querySelector('#seccionesTextAreaAdd') as HTMLTextAreaElement).value = "";
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

  goBack() {
    this.router.navigate(['/dashboard'])
  }
}
