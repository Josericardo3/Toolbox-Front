import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-diagnostico',
  templateUrl: './app-diagnostico.component.html',
  styleUrls: ['./app-diagnostico.component.css']
})
export class AppDiagnosticoComponent implements OnInit {
  formParent!: FormGroup;
  datos: any = [];

  valorSeleccionado: string[] = [];

  itemSeleccionado: string;
  observacionF: string;

  numeralprincipalArray: string[] = [];
  numeralespecificoArray: string[] = [];
  numeralprincipalString: string;
  numeralespecificoString: string;

  public opcionSeleccionada: boolean = false;
  // opcionesSeleccionadas: string[][] = [[]];
  // opcionSeleccionada: string[] = [];


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private ApiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.formParent = this.fb.group({
      // campos: this.fb.array([])
      radio: ['', Validators.required],
      observacion: ['', Validators.required]
    });

    // this.http.get('assets/datos.json')
    this.ApiService.getDiagnostico()
    .subscribe((data: any) => {
      this.datos = data;
      // this.datos.campos.forEach((campo:any) => {
      //   if(campo.values !== null){
      //     this.formParent.addControl(campo.campo_local, new FormControl({value: campo.values, disabled: true}))
      //   }else{
      //     this.formParent.addControl(campo.campo_local, new FormControl('', Validators.required))
      //   }
      // });


      // Recorremos el objeto y guardamos los valores en las variables correspondientes
      this.datos.campos.forEach((campo: any) => {
      this.numeralprincipalArray.push(String(campo.numeralprincipal));
      this.numeralprincipalString = this.numeralprincipalArray.join(',');
      campo.listacampos.forEach((listacampo: any) => {
      this.numeralespecificoArray.push(String(listacampo.numeralespecifico));
      this.numeralespecificoString = this.numeralespecificoArray.join(',');
          // listacampo.desplegable.forEach((desplegable: any) => {
          //   this.itemArray.push(String(desplegable.item));
          //   this.ObsArray.push(String(desplegable.observacion));
          // });
        });
      });
    });

}

validarCampos() {
  let camposVacios = false;
  if (this.datos && this.datos.campos) { // Verifica si hay campos definidos
    this.datos.campos.forEach(campo => {
      campo.listacampos.forEach(subcampo => {
        if (!subcampo.valorSeleccionado || !subcampo.observacion) {
          camposVacios = true;
          this.formParent.addControl(`observacion_${subcampo.numeralespecifico}`, this.fb.control('', Validators.required));
      this.formParent.addControl(`radio_${subcampo.numeralespecifico}}`, this.fb.control('', Validators.required));
    
        }
      });
    });
  }
  return camposVacios;
}

  // getCampo(i: number) {
  //   return (this.formParent.get('campos') as FormArray).at(i).get('opcionSeleccionada');
  // }
  
  // addCampo(numeralprincipal: string, numeralespecifico: string, titulo: string, requisito: string) {
  //   const campo = this.fb.group({
  //     numeralprincipal: [numeralprincipal],
  //     numeralespecifico: [numeralespecifico],
  //     titulo: [titulo],
  //     requisito: [requisito]
  //   });
  
  //   this.campos.push(campo);
  // }

  // get campos() {
  //   return this.formParent.get('campos') as FormArray;
  // }
  
//   public radiosSeleccionados = false;

// valorSeleccionado() {
//   this.radiosSeleccionados = true;
// }


  getControlType(campo: any) {
    switch (campo.tipodedato) {
      case 'string':
        return new FormControl(campo.values);
      case 'radio':
        return new FormControl(campo.values);
      case 'textarea':
        return new FormControl(campo.values);
      default:
        return new FormControl('');
    }
  }

  valoresObservaciones: string[] = [];
  valoresRadios: string[] = [];
  valoresForm: any = [];
  v: any = [];
  valor:any;
  capturarValor(id: string | number,event: any, value: any, iddiagnosticodinamico: any) {
    const normaValue = JSON.parse(window.localStorage.getItem('norma'));
    const idn = normaValue[0].id;

      // const capturarObservacion = () => {
      //   const idObs = `observacion-${iddiagnosticodinamico}`;
      //   const valorObs = document.querySelector('#idObs') as HTMLInputElement;
      //   const val = valorObs.value
      // };

    const result = this.valoresForm.find((o: any) => o.numeralespecifico === iddiagnosticodinamico);
    if (result) {
      result.valor = value;
    }else{
      this.valoresForm.push({
        "valor": value,
        "idnormatecnica": idn,
        "idusuario": localStorage.getItem('Id'),
        "numeralprincipal": iddiagnosticodinamico,
        "numeralespecifico": iddiagnosticodinamico,
      });
      // capturarObservacion();
    }
}

valorObs:any;
capturarValorObs(i: number, event: Event, idObs: string){
  this.valorObs = (event.target as HTMLInputElement).value;
}

  saveForm(){
    const observaciones = document.querySelectorAll('.obs');
    observaciones.forEach((observacion: HTMLTextAreaElement) => {
      this.valoresObservaciones.push(observacion.value);
    });

    const radios = document.querySelectorAll('.checkRadio');
    radios.forEach((rad: HTMLInputElement) => {
      if (rad.checked) {
        this.valoresRadios.push((rad.value));
      }
    });
    this.v = this.valoresObservaciones.concat(this.valoresRadios).join(" - ");
    //this.ApiService.saveDataDiagnostico(this.valoresForm)
    /*.subscribe((data: any) =>{
      
      
    })*/
    this.router.navigate(['/diagnosticoDoc'])
  }

  goBack() {
    this.router.navigate(['/dashboard'])
  }

}
