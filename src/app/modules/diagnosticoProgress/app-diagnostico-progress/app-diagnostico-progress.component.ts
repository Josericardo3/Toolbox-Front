import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';
import { BtnEmpezarContinuarService } from 'src/app/servicios/btn-empezar-continuar/btn-empezar-continuar.service';


@Component({
  selector: 'app-app-diagnostico-progress',
  templateUrl: './app-diagnostico-progress.component.html',
  styleUrls: ['./app-diagnostico-progress.component.css']
})
export class AppDiagnosticoProgressComponent implements OnInit{

  datos: any = [];

  constructor(
    private ApiService: ApiService,
    private router: Router,
    public btnEmpezarContinuarService : BtnEmpezarContinuarService
  ) { }

  ngOnInit() {
    this.getDiagnostico();
  }

  getDiagnostico() {
    this.ApiService.getDiagnostico()
      .subscribe((data: any) => {
        this.datos = data;
        // Verifica que la respuesta del endpoint tenga la estructura adecuada
        if (data && data.campos && Array.isArray(data.campos) && data.campos.length > 0) {
          // Accede a la propiedad 'campos' de la respuesta
          const campos = this.datos.campos;
  
          campos.forEach((campo: any) => {
            const valorBuscar = campo.NUMERAL_PRINCIPAL;
          
            // Filtra los datos según el valor dinámico en NUMERAL_PRINCIPAL
            const formularioData = campo.listacampos.filter((item: any) => item.NUMERAL_PRINCIPAL === valorBuscar.toString());
          
            // Cuenta los subformularios únicos en NUMERAL_ESPECIFICO
            const subformularios = new Set(formularioData.map((item: any) => item.NUMERAL_ESPECIFICO));
            campo.totalFormularios = subformularios.size;
          
            // Establece el valor inicial de progresoActual como 0
            // campo.progresoActual = 0;
            this.getButtonClasses(campo.CANT_RESPUESTAS)
          
            // Establece la propiedad guardado como false
            campo.guardado = false;
          
            console.log(`Cantidad de subformularios del formulario ${valorBuscar}: ${campo.totalFormularios}`);
          });
        } else {
          console.error('La respuesta del endpoint no tiene la estructura esperada.');
        }
      });
  }

  isLetra(numeral: string): boolean {
    return /^[A-Za-z]$/.test(numeral);
  }

  irDiagnostico(idNumeral: any) {  
    this.router.navigate(['/diagnostico', idNumeral]);
  }

  getButtonClasses(progresoActual: number) {
    return progresoActual !== 0 ? 'btn btn-outline-primary w-100 text-center' : 'btn btn-primary w-100 text-center';
  }

  coloresProgress: string[] = ['#fc3a3a', '#fc6a3a', '#f5d773', '#abf573', '#46faf4', '#ad5dfc'];
  colorIndex: number = 0;

  // getColorGlobal(cantRespuestasGlobal: number, totalFormulariosGlobal: number): string {
  //   const percentageGlobal = (cantRespuestasGlobal / totalFormulariosGlobal) * 100;
  
  //   if (cantRespuestasGlobal === 0) {
  //     return 'light gray';
  //   }

  //   const currentColor = this.coloresProgress[this.colorIndex];
  //   this.colorIndex = (this.colorIndex + 1) % this.coloresProgress.length;
  
  //   return currentColor;
  // }

  getColorGlobal(cantRespuestasGlobal: number, totalFormulariosGlobal: number): string {
    const colorIndex = this.getNextColorIndex();
  
    if (cantRespuestasGlobal === 0) {
      return 'light gray';
    }
  
    return this.coloresProgress[colorIndex];
  }
  
  private currentColorIndex: number = 0;
  
  private getNextColorIndex(): number {
    const nextIndex = this.currentColorIndex % this.coloresProgress.length;
    this.currentColorIndex = (this.currentColorIndex + 1) % this.coloresProgress.length;
    return nextIndex;
  }
}
