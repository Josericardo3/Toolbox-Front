import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-e-matriz-requisitos-legales',
  templateUrl: './e-matriz-requisitos-legales.component.html',
  styleUrls: ['./e-matriz-requisitos-legales.component.css']
})
export class EMatrizRequisitosLegalesComponent implements OnInit{
  selectedOption: string;
  lastVisible: any;

  contextsVisible = false;
  adicionarVisible = false;

  
  
  constructor() {}
  ngOnInit() {}

  onSelect(value: string) {
    this.selectedOption = value;
  }

  toggleSection(section) {
    if (section === 'contexts') {
      this.contextsVisible = !this.contextsVisible;
    } else if (section === 'adicionar') {
      this.adicionarVisible = !this.adicionarVisible
    } 

    // Cierra el div abierto si se hace clic en otro div
    if (this.lastVisible && this.lastVisible !== section) {
      if (this.lastVisible === 'contexts') {
        this.contextsVisible = false;
      } else if (section === 'adicionar') {
        this.adicionarVisible = false;
      }
    }
    
    this.lastVisible = section;
  }

  descripcion: string;
  anio: string;
  numero: string;
  agregarDiv() {
        const anio = (document.querySelector('#anioInput') as HTMLInputElement).value;
        const descripcion = (document.querySelector('#descripcionTextArea') as HTMLTextAreaElement).value;
        const numero = (document.querySelector('#numeroInput') as HTMLInputElement).value;
        
        const divAdd = document.getElementById('divAdd') as HTMLDivElement;
        // const anioP = divAdd.querySelector('#anio') as HTMLInputElement;
        // anioP.innerText = anio;
        const descripcionP = divAdd.querySelector('#descripcion') as HTMLTextAreaElement;
        if (descripcionP) {
          descripcionP.innerText = descripcion;
        }
        const etiquetaTitulo = divAdd.querySelector('#tituloNormativa') as HTMLHeadElement;
        etiquetaTitulo.innerHTML = `Ley ${numero} de ${anio}`
  }

}
