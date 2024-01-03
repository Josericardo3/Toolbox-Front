import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';
import { BtnEmpezarContinuarService } from 'src/app/servicios/btn-empezar-continuar/btn-empezar-continuar.service';
import { SpinnerService } from 'src/app/servicios/spinnerService/spinner.service';

@Component({
  selector: 'app-app-diagnostico-progress',
  templateUrl: './app-diagnostico-progress.component.html',
  styleUrls: ['./app-diagnostico-progress.component.css']
})
export class AppDiagnosticoProgressComponent implements OnInit{

  datos: any = [];
  totalFormulariosSum: number = 0;

  constructor(
    private ApiService: ApiService,
    private router: Router,
    public btnEmpezarContinuarService : BtnEmpezarContinuarService,
    private cd: ChangeDetectorRef
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
            this.getButtonClasses(campo.CANT_RESPUESTAS)
          
            // Establece la propiedad guardado como false
            campo.guardado = false;

            // Suma de todos los formularios
            campo.totalFormularios = subformularios.size;
            this.totalFormulariosSum += campo.totalFormularios;
            
            console.log(this.totalFormulariosSum);
          });
          // Actualiza el servicio con el totalFormulariosSum
          this.btnEmpezarContinuarService.updateTotalFormulariosSum(this.totalFormulariosSum);

                  // Actualiza el servicio con el total de formularios respondidos
        const totalFormulariosRespondidos = this.datos.campos.reduce((total, campo) => total + campo.CANT_RESPUESTAS, 0);
        this.btnEmpezarContinuarService.updateTotalFormulariosRespondidos(totalFormulariosRespondidos);

          this.verificarBotonesDesaparecidos();
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

  coloresPorNumeral: { [numeral: string]: string } = {};
  private coloresProgress: string[] = ['#fc3a3a', '#fc6a3a', '#f5d773', '#abf573', '#46faf4', '#ad5dfc'];
  private currentColorIndex: number = 0;
  todosBotonesDesaparecidos: boolean = false;

  getColorGlobal(numeral: string, cantRespuestasGlobal: number, totalFormulariosGlobal: number): string {
    // Verifica si ya se asignó un color a este NUMERAL_PRINCIPAL
    if (!this.coloresPorNumeral[numeral]) {
      // Si no se ha asignado, asigna un color único y constante
      this.coloresPorNumeral[numeral] = this.getNextColor();
    }
    // Retorna el color asignado a este NUMERAL_PRINCIPAL
    return this.coloresPorNumeral[numeral];
  }

  private getNextColor(): string {
    const nextIndex = this.currentColorIndex % this.coloresProgress.length;
    this.currentColorIndex = (this.currentColorIndex + 1) % this.coloresProgress.length;
    return this.coloresProgress[nextIndex];
  }

  verificarBotonesDesaparecidos() {
    this.todosBotonesDesaparecidos = this.datos && this.datos.campos && this.datos.campos.length > 0 &&
      this.datos.campos.every(campo => campo.CANT_RESPUESTAS === campo.totalFormularios);
  }

  areAllButtonsHidden(): boolean {
    return this.datos.campos.every(campo => campo.CANT_RESPUESTAS === campo.totalFormularios);
  }
}
