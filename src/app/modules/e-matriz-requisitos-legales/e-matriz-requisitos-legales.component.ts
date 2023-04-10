import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
// import { MatTabsModule } from '@angular/material/tabs';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-e-matriz-requisitos-legales',
  templateUrl: './e-matriz-requisitos-legales.component.html',
  styleUrls: ['./e-matriz-requisitos-legales.component.css']
})
export class EMatrizRequisitosLegalesComponent implements OnInit{
  @ViewChild('nuevoDiv', {static: true}) nuevoDivRef!: TemplateRef<any>;
  @ViewChild('container', {read: ViewContainerRef}) containerRef!: ViewContainerRef;

  datos: any = [];

  detalles: any[] = [];
  showAdd = false;

  lastVisible: any;

  primeraLeyVisible = false;
  divAddVisible = false;
  adicionarVisible = false;

  descripcion: string;
  secciones: string;
  numero: string;
  anio: string;
  selectedOption: string = '';
  opcionSeleccionada: string = '';
  divs: any[] = [];
  tabActual = 'tab1';
  busqueda: string = '';

  constructor(private ApiService: ApiService,) {}
  ngOnInit() {
    this.ApiService.getLeyes()
    .subscribe((data: any) => {
      this.datos = data;
      console.log(this.datos)
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
  

leyesVisibles: boolean[] = [];
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

  // agregarDiv() {  
  //   this.anio = (document.querySelector('#anioInput') as HTMLInputElement).value;
  //   this.numero = (document.querySelector('#numeroInput') as HTMLInputElement).value;
  //   this.descripcion = (document.querySelector('#descripcionTextAreaAdd') as HTMLTextAreaElement).value;
  //   this.secciones = (document.querySelector('#seccionesTextAreaAdd') as HTMLTextAreaElement).value;

  //   // const divAdd = document.querySelector('#divAdd') as HTMLDivElement;
  //     // if (divAdd) {
  //       // const descripcionP = divAdd.querySelector('#descripcion') as HTMLParagraphElement;
  //       // if (descripcionP) {
  //       //   descripcionP.innerText = this.descripcion;
  //       // }
  //       // const seccionesP = divAdd.querySelector('#secciones') as HTMLParagraphElement;
  //       // if (seccionesP) {
  //       //   seccionesP.innerText = this.secciones;
  //       // }

  //       // const etiquetaTitulo = divAdd.querySelector('#tituloNormativa') as HTMLHeadElement;
        
  //       let tipoNormatividad = this.selectedOption;
  //       if (tipoNormatividad === 'otro') {
  //         const otroValue = (document.querySelector('#otroInput') as HTMLInputElement).value;
  //         tipoNormatividad = otroValue;
  //       }
  //       // etiquetaTitulo.innerHTML = `${tipoNormatividad} ${numero} de ${anio}`

  //       // Crear un nuevo elemento div
  //       const nuevoDiv = document.createElement('div');
  //       nuevoDiv.classList.add('div');
  //       nuevoDiv.id = 'divAdd';

  //       // Agregar la estructura HTML al nuevo div
  //       nuevoDiv.innerHTML = `
  //         <div class="titulo" (click)="toggleSection('divAdd')" [ngClass]="{'verde': divAddVisible}">
  //           <h3 id="tituloNormativa">${this.selectedOption} ${this.numero} de ${this.anio}</h3>
  //           <div class="iconos">
  //             <i class="fa-solid" [class.fa-angle-up]="divAddVisible" [class.fa-angle-down]="!divAddVisible"></i>
  //           </div>
  //           <button (click)="eliminarDivAdd()" class="boton-eliminar">x</button>
  //           </div>
  //         <div class="detalle" id="detalleAdd" *ngIf="divAddVisible">     
  //           <p id="descripcion">${this.descripcion}</p>
  //           <p id="secciones">${this.secciones}</p>
  //         </div>
  //       `;

  //       // Agregar el nuevo div al contenedor
  //       const contenedor = document.querySelector('#ContainerdetalleAdicionar');
  //       contenedor.insertBefore(nuevoDiv, contenedor.lastChild);



  //       // Crear una instancia de la plantilla
  //       // const nuevoDiv = this.nuevoDivRef.createEmbeddedView({
  //       //   selectedOption: this.selectedOption,
  //       //   numero: this.numero,
  //       //   anio: this.anio,
  //       //   descripcion: this.descripcion,
  //       //   secciones: this.secciones,
  //       //   toggleSection: this.toggleSection.bind(this),
  //       //   divAddVisible: this.divAddVisible
  //       // });
    
  //       // Agregar la instancia de la plantilla al contenedor
  //       // this.containerRef.insert(nuevoDiv);




  //       // Limpiar
  //       // this.selectedOption = "0";
  //       (document.querySelector('#numeroInput') as HTMLInputElement).value = "";
  //       (document.querySelector('#anioInput') as HTMLInputElement).value = "";
  //       (document.querySelector('#descripcionTextAreaAdd') as HTMLTextAreaElement).value = "";
  //       (document.querySelector('#seccionesTextAreaAdd') as HTMLTextAreaElement).value = "";
  //     // }
  // }
  // agregarDiv() {  
  //   const anio = (document.querySelector('#anioInput') as HTMLInputElement).value;
  //   const numero = (document.querySelector('#numeroInput') as HTMLInputElement).value;
  //   this.descripcion = (document.querySelector('#descripcionTextAreaAdd') as HTMLTextAreaElement).value;
  //   this.secciones = (document.querySelector('#seccionesTextAreaAdd') as HTMLTextAreaElement).value;
  //   let tipoNormatividad = this.selectedOption;
  //     if (tipoNormatividad === 'otro') {
  //       const otroValue = (document.querySelector('#otroInput') as HTMLInputElement).value;
  //       tipoNormatividad = otroValue;
  //     }
  //   const divAdd = {
  //     descripcion: this.descripcion,
  //     secciones: this.secciones,
  //     titulo: `${tipoNormatividad} ${numero} de ${anio}`
  //   };

  //   this.detalles.push(divAdd);
  //   this.showAdd = false;
      
  //       // Limpiar
  //       // this.selectedOption = "0";
  //       // (document.querySelector('#numeroInput') as HTMLInputElement).value = "";
  //       // (document.querySelector('#anioInput') as HTMLInputElement).value = "";
  //       // (document.querySelector('#descripcionTextAreaAdd') as HTMLTextAreaElement).value = "";
  //       // (document.querySelector('#seccionesTextAreaAdd') as HTMLTextAreaElement).value = "";
  //     // }
  // }

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
}
