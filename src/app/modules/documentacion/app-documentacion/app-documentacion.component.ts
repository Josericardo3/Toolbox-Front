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

  // visible = {
  //   norma: false,
  //   contexts: false,
  //   subContexts: false,
  //   liderazgo: false,
  // };

  constructor() {}
  ngOnInit(): void {
    // this.toggleContent('norma');
    // this.toggleContent('contexts');
    // this.toggleContent('subContexts');
    // this.toggleContent('liderazgo');
  }

  // toggleContent(name: string) {
  //   Object.keys(this.visible).forEach(key => {
  //     if (key !== name) {
  //       this.visible[key] = false;
  //     }
  //   });
  //   this.visible[name] = !this.visible[name];
  // }

  toggleSection(section) {
    // this.normaVisible = section === 'norma';
    // this.contextsVisible = section === 'contexts';
    // this.subContextsVisible = section === 'subContexts';
    // this.liderazgoVisible = section === 'liderazgo';
    // this.planificacionVisible = section === 'planificacion';
    // this.subPlanificacionA = section === 'subPlanificacionA';
    // this.subPlanificacionB = section === 'subPlanificacionB';
    // this.apoyoVisible = section === 'apoyo';
    // this.subApoyoVisible = section === 'subApoyo';

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
      this.mejoraVisible = !this.mejoraVisible;
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
      } else if (this.lastVisible === 'mejora') {
        this.mejoraVisible = false;
      } else if (this.lastVisible === 'anexoA') {
        this.anexoAVisible = false;
      } else if (this.lastVisible === 'anexoA') {
        this.anexoBVisible = false;
      } else if (this.lastVisible === 'anexoA') {
        this.anexoCVisible = false;
      }
    }
    
    this.lastVisible = section;

  }

  toggleSubContexts() {
    this.subContextsVisible = !this.subContextsVisible;
  }

// toggleNorma() {
  //   this.normaVisible = !this.normaVisible;
  //   this.contextsVisible = false;
  //   this.liderazgoVisible = false;
  //   this.planificacionVisible = false;
  // }

  // toggleContexts() {
  //   this.contextsVisible = !this.contextsVisible;
  //   this.normaVisible = false;
  //   this.liderazgoVisible = false;
  //   this.planificacionVisible = false;
  // }
  // toggleLiderazgo() {
  //   this.liderazgoVisible = !this.liderazgoVisible;
  //   this.normaVisible = false;
  //   this.contextsVisible = false;
  //   this.planificacionVisible = false;
  // }

  // togglePlanificacion(){
  //   this.planificacionVisible = !this.planificacionVisible;
  //   this.normaVisible = false;
  //   this.contextsVisible = false;
  //   this.liderazgoVisible = false
  // }

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
}
