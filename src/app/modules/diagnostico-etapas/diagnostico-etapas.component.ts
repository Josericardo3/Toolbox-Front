import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { Router } from '@angular/router';
import { BtnEmpezarContinuarService } from 'src/app/servicios/btn-empezar-continuar/btn-empezar-continuar.service';
import { ChangeDetectorRef } from '@angular/core';


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
  normaValue = Number(window.localStorage.getItem('idNormaSelected'));
  normaDiadnostico: any = {};
  totalFormulariosSum: number = 0;
  porcentajeAvance: number = 0;
  datos: any = [];

  etapaPorcentaje: number = 0;
  etapaActual: string = '';
  porcentajeInicial: number;
  porcentajeIntermedia: number;
  porcentajeFinal: number;

  constructor(
    private ApiService: ApiService,
    private Message: ModalService,
    private router: Router,
    public btnEmpezarContinuarService : BtnEmpezarContinuarService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ApiService.validateDiagnostico(this.normaValue).subscribe((data: any) => {
      this.normaDiadnostico = data
      this.fnShowModal();
    });

    // this.btnEmpezarContinuarService.totalFormulariosSum$.subscribe(sum => {
    //   this.totalFormulariosSum = sum;
    //   console.log(this.totalFormulariosSum);
    // });

    // this.btnEmpezarContinuarService.totalFormulariosRespondidos$.subscribe(total => {
    //   this.porcentajeAvance = (total / this.totalFormulariosSum) * 100;
    //   console.log(this.porcentajeAvance)
    // });

    this.ApiService.getEtapaDiag().subscribe((data:any) => {
      this.datos = data;
      // this.actualizarPorcentajes()
      
    const etapaInicial = this.datos.find(item => item.ETAPA === 1);
    const etapaIntermedia = this.datos.find(item => item.ETAPA === 2);
    const etapaFinal = this.datos.find(item => item.ETAPA === 3);

    if (etapaInicial) {
      this.porcentajeInicial = etapaInicial.PORCENTAJE;
      console.log(this.porcentajeInicial)
    }

    if (etapaIntermedia) {
      this.porcentajeIntermedia = etapaIntermedia.PORCENTAJE;
      console.log(this.porcentajeIntermedia)
    }

    if (etapaFinal) {
      this.porcentajeFinal = etapaFinal.PORCENTAJE;
      console.log(this.porcentajeFinal)
    }
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

  getProgressBarClasses(etapa: string): any {
    switch (etapa) {
      case 'inicio':
        return this.etapaShowInicio ? 'custom-progress-bar-inicio' : 'custom-progress-bar';
      case 'intermedia':
        return this.etapaShowIntermedio ? 'custom-progress-bar-intermedia' : 'custom-progress-bar';
      case 'final':
        return this.etapaShowFinal ? 'custom-progress-bar-final' : 'custom-progress-bar';
      default:
        return '';
    }
  }
}