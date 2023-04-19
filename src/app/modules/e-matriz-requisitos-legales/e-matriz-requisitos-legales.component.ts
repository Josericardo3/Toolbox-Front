import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e-matriz-requisitos-legales',
  templateUrl: './e-matriz-requisitos-legales.component.html',
  styleUrls: ['./e-matriz-requisitos-legales.component.css']
})

export class EMatrizRequisitosLegalesComponent implements OnInit{
  @ViewChild('nuevoDiv', {static: true}) nuevoDivRef!: TemplateRef<any>;
  @ViewChild('container', {read: ViewContainerRef}) containerRef!: ViewContainerRef;

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
  divAddVisible = false;
  adicionarVisible = false;

  leyesVisibles: boolean[] = [];

  descripcion: string;
  secciones: string;
  numero: string;
  anio: string;
  selectedOption: string = '';
  divs: any[] = [];
  tabActual = 'tab1';
  busqueda: string = '';

  opcionSeleccionada: string = '';
  responsableSeleccionado: string = '';
  evidenciaInput: string = '';
  observacionInput: string = '';
  accionesText: string = '';
  responsablePlanSeleccionado: string = '';
  fechaInput: string = '';
  estadoSeleccionado: string = '';

  constructor(
    private ApiService: ApiService,
    private router: Router
    ) {}

  ngOnInit() {
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

      const gruposAmbiental = this.datos.filter((ley) => ley.categoria === 'Ambiental')
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

      // this.leyesParticular = this.datos.filter((ley) => ley.categoria === 'Turismo'); // ¿cuál es la categoría?
      
     });
  }

  // getLeyesApi(){
  //   this.ApiService.getLeyes()
  //   .subscribe((data: any) => {
  //     this.datos = data;
  //     console.log(this.datos)
  //   });
  // }

  cambiarTab(tab: string) {
    this.tabActual = tab;
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

  toggleSection(section) {
  if (section === 'adicionar') {
      this.adicionarVisible = !this.adicionarVisible
    } else if (section === 'divAdd') {
      this.divAddVisible = !this.divAddVisible
    }

    // Cierra el div abierto si se hace clic en otro div
    if (this.lastVisible && this.lastVisible !== section) {
  if (section === 'adicionar') {
        this.adicionarVisible = false;
      } else if (section === 'divAdd') {
        this.divAddVisible = false;
      }
    }

    this.lastVisible = section;
  }

  isLeyVisible(index) {
    return this.leyesVisibles[index];
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
  
    const nuevoDiv = {
      anio: anio,
      numero: numero,
      descripcion: descripcion,
      secciones: secciones,
      tipoNormatividad: tipoNormatividad
    };
  
    this.divs.push(nuevoDiv);

      // Limpiar
      this.selectedOption = "0";
      (document.querySelector('#numeroInput') as HTMLInputElement).value = "";
      (document.querySelector('#anioInput') as HTMLInputElement).value = "";
      (document.querySelector('#descripcionTextAreaAdd') as HTMLTextAreaElement).value = "";
      (document.querySelector('#seccionesTextAreaAdd') as HTMLTextAreaElement).value = "";
  }
  
  showDivAdd(){
    const divAdd = document.getElementById('divAdd') as HTMLDivElement;
    if (divAdd) {
      divAdd.style.display = "block";
    }
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
