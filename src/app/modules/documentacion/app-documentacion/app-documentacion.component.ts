import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-documentacion',
  templateUrl: './app-documentacion.component.html',
  styleUrls: ['./app-documentacion.component.css']
})
export class AppDocumentacionComponent implements OnInit {

  lastVisible: any;

  normaVisible = false;
  contextsVisible = false;
  subContextsVisible = false;
  liderazgoVisible = false;
  planificacionVisible = false;
  subPlanificacionA = false;
  subPlanificacionB = false;
  apoyoVisible = false;
  subApoyoVisible = false;
  operacionVisible = false;
  evaluacionVisible = false;
  subEvaluacionVisible = false;
  mejoraVisible = false;
  anexoAVisible = false;
  anexoBVisible = false;
  anexoCVisible = false;

  normaSelected: string;
  ntc: string;
  pdfUrl: string;

  constructor() {}
  ngOnInit(): void {
    this.normaSelected = localStorage.getItem('normaSelected');
    this.ntc = this.normaSelected.substring(0, 8);
    // this.pdfUrl = `../../../../assets/DOCS/Norma/${this.ntc}-MATRIZ REQUISITOS LEGALES-Aprobada V2.pdf`;
  }

  toggleSection(section) {
    if (section === 'norma') {
      this.normaVisible = !this.normaVisible;
    } else if (section === 'contexts') {
      this.contextsVisible = !this.contextsVisible;
    } else if (section === 'subContexts') {
      this.subContextsVisible = !this.subContextsVisible;
    } else if (section === 'liderazgo') {
      this.liderazgoVisible = !this.liderazgoVisible;
    } else if (section === 'planificacion') {
      this.planificacionVisible = !this.planificacionVisible;
    } else if (section === 'subPlanificacionA') {
      this.subPlanificacionA = !this.subPlanificacionA;
    } else if (section === 'subPlanificacionB') {
      this.subPlanificacionB = !this.subPlanificacionB;
    } else if (section === 'apoyo') {
      this.apoyoVisible = !this.apoyoVisible;
    } else if (section === 'subApoyo') {
      this.subApoyoVisible = !this.subApoyoVisible;
    } else if (section === 'operacion') {
      this.operacionVisible = !this.operacionVisible;
    } else if (section === 'evaluacion') {
      this.evaluacionVisible = !this.evaluacionVisible;
    } else if (section === 'subEvaluacion') {
      this.subEvaluacionVisible = !this.subEvaluacionVisible;
    } else if (section === 'mejora') {
      this.mejoraVisible = !this.mejoraVisible
    } else if (section === 'anexoA') {
      this.anexoAVisible = !this.anexoAVisible;
    } else if (section === 'anexoB') {
      this.anexoBVisible = !this.anexoBVisible;
    } else if (section === 'anexoC') {
      this.anexoCVisible = !this.anexoCVisible;
    }

    // Cierra el div abierto si se hace clic en otro div
    if (this.lastVisible && this.lastVisible !== section) {
      if (this.lastVisible === 'norma') {
        this.normaVisible = false;
      } else if (this.lastVisible === 'contexts') {
        this.contextsVisible = false;
      } else if (this.lastVisible === 'subContexts') {
        this.subContextsVisible = false;
      } else if (this.lastVisible === 'liderazgo') {
        this.liderazgoVisible = false;
      } else if (this.lastVisible === 'planificacion') {
        this.planificacionVisible = false;
      } else if (this.lastVisible === 'subPlanificacionA') {
        this.subPlanificacionA = false;
      } else if (this.lastVisible === 'subPlanificacionB') {
        this.subPlanificacionB = false;
      } else if (this.lastVisible === 'apoyo') {
        this.apoyoVisible = false;
      } else if (this.lastVisible === 'subApoyo') {
        this.subApoyoVisible = false;
      } else if (this.lastVisible === 'operacion') {
        this.operacionVisible = false;
      } else if (this.lastVisible === 'evaluacion') {
        this.evaluacionVisible = false;
      } else if (this.lastVisible === 'subEvaluacion') {
        this.subEvaluacionVisible = false;
      } else if(this.lastVisible === 'mejora') {
        this.mejoraVisible = false;
      } else if(this.lastVisible === 'anexoA') {
        this.anexoAVisible = false;
      } else if(this.lastVisible === 'anexoB') {
        this.anexoBVisible = false;
      } else if(this.lastVisible === 'anexoC') {
        this.anexoCVisible = false;
      }
    }
    
    this.lastVisible = section;

  }

  toggleSubContexts() {
    this.subContextsVisible = !this.subContextsVisible;
  }

  toggleSubPlanificacionA(){
    this.subPlanificacionA = !this.subPlanificacionA;
  }

  toggleSubPlanificacionB(){
    this.subPlanificacionB = !this.subPlanificacionB;
  }

  toggleSubApoyo(){
    this.subApoyoVisible = !this.subApoyoVisible;
  }

  toggleSubEvaluacion(){
    this.subEvaluacionVisible = !this.subEvaluacionVisible;
  }

  downloadPdf(fileName: string) {
    const pdfUrl = `../../../../assets/DOCS/Norma/${fileName}`;
    const pdfName = `${this.ntc}-${fileName}`;
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', pdfUrl);
    link.setAttribute('download', pdfName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

}
