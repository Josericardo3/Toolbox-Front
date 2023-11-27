import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-diagnostico-etapas',
  templateUrl: './diagnostico-etapas.component.html',
  styleUrls: ['./diagnostico-etapas.component.css']
})

export class DiagnosticoEtapasComponent implements OnInit{

  etapaShowInicio: boolean = false;
  etapaShowIntermedio: boolean = false;
  etapaShowFinal: boolean = false;
  bloquearIntermedio: boolean = false;
  bloquearFinal: boolean = false;
  idUser = localStorage.getItem("Id");
  // validateCaracterizacion = this.ApiService.validateCaracterizacion(this.idUser);
  normaValue = Number(window.localStorage.getItem('idNormaSelected'));
  // validateDiagnostico = this.ApiService.validateDiagnostico(this.normaValue);
  normaDiadnostico: any = {};

  constructor(
    private ApiService: ApiService,
    private Message: ModalService,
    private router: Router,
  ) { }

  ngOnInit() {
    // this.validateDiagnostico.subscribe((data: any) => this.normaDiadnostico = data);
    
    this.ApiService.validateDiagnostico(this.normaValue).subscribe((data: any) => {
      this.normaDiadnostico = data
      this.fnShowModal();
    })
  }

  fnShowModal() {
    this.ApiService.validateCaracterizacion(this.idUser).subscribe((data) => {
      console.log(data)
      console.log(this.normaDiadnostico.ETAPA_INICIO, this.normaDiadnostico.ETAPA_INTERMEDIO, this.normaDiadnostico.ETAPA_FINAL)
      if (!data) {
        const title = "Aviso";
        const message = "Debe realizar el proceso de caracterización antes de continuar con el proceso de diagnostico"
        this.Message.showModal(title, message);
        return
      }else{
        if (this.normaDiadnostico.ETAPA_INICIO == false) {
          this.bloquearIntermedio = true;
          this.bloquearFinal = true;
        }
        if (this.normaDiadnostico.ETAPA_INICIO == true) {
          this.etapaShowInicio = true;
          this.bloquearIntermedio = false;
          this.bloquearFinal = true;
        }
        if (this.normaDiadnostico.ETAPA_INTERMEDIO == true) {
          this.etapaShowIntermedio = true;
          this.bloquearIntermedio = false;
          this.bloquearFinal = false;
        }
        if (this.normaDiadnostico.ETAPA_FINAL == true) {
          this.etapaShowFinal = true;
          this.bloquearIntermedio = false;
          this.bloquearFinal = false;
        }
      }
    });
  }

  fnEtapa(etapa: string) {
    if (etapa === "inicial") {
      localStorage.setItem("etapa", '1');
      this.router.navigate(["/diagnosticoProgress"]);
    } else if (etapa === "intermedia") {
      localStorage.setItem("etapa", '2');
      this.router.navigate(["/diagnosticoProgress"]);
    } else if (etapa === "final") {
      localStorage.setItem("etapa", '3');
      this.router.navigate(["/diagnosticoProgress"]);
    }
  }

  // getButtonClasses(etapa: any) {
  //   return etapa ? 'btn btn-primary w-100 text-center' : 'btn custom-background w-100 text-center';
  // }

  getProgressBarClasses(etapa: string): any {
    switch (etapa) {
      case 'inicio':
        return this.etapaShowInicio ? 'custom-progress-bar-inicio': 'custom-progress-bar';
      case 'intermedia':
        return this.etapaShowIntermedio ? 'custom-progress-bar-intermedia' : 'custom-progress-bar';
      case 'final':
        return this.etapaShowFinal ? 'custom-progress-bar-final' : 'custom-progress-bar';
      default:
        return '';
    }
  }
  
}
