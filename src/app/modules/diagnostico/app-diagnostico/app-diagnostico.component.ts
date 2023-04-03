import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';
// import Swal from 'sweetalert2';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service' 

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

  valoresObservaciones: string[] = [];
  valoresRadios: string[] = [];
  valoresForm: any = [];
  v: any = [];
  valor:any;
  valorObs:any;

  public isDataLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private ApiService: ApiService,
    private Message: ModalService,
  ) { }

  ngOnInit(): void {
    this.formParent = this.fb.group({ });
    // this.http.get('assets/datos.json')
    this.ApiService.getDiagnostico()
    .subscribe((data: any) => {
      this.datos = data;
      this.isDataLoaded = true;
      // this.datos.campos.forEach((campo:any) => {
      //   if(campo.values !== null){
      //     this.formParent.addControl(campo.campo_local, new FormControl({value: campo.values, disabled: true}))
      //   }else{
      //     this.formParent.addControl(campo.campo_local, new FormControl('', Validators.required))
      //   }
      // });

      //Validar Radios para habilitar el formulario
      const formControls = {};
      this.datos.campos.forEach((campo, j) => {
        campo.listacampos.forEach((subcampo, i) => {
          formControls[`radio${j}-${i}`] = new FormControl(null);
        });
      });
      this.formParent = new FormGroup(formControls);

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

    console.log(this.isFormValid());
}

// isFormValid(): boolean {
//   if (!this.datos || !this.datos.campos) {
//     // Si this.datos o this.datos.campos no están definidos, retornar falso
//     return false;
//   }

//   return this.datos.campos.every((campo: any) => {
//     if (!campo.listacampos) {
//       // Si campo.listacampos no está definido, retornar falso
//       return false;
//     }

//     return campo.listacampos.every((i: any) => {
//       const control = this.formParent.get(`radio${campo.id}-${i}`);
//       if (!control) {
//         // Si control no está definido, retornar falso

//         return false;
//       }
//       return control.value !== null;
//     });
//   });
// }

// isFormValid(): boolean {
//   return this.datos.campos.every((campo, j) => {
//     return campo.listacampos.every((subcampo, i) => {
//       const control = this.formParent.get(`radio${j}-${i}`);
//       return control.value !== null;
//     });
//   });
// }

public isFormValid(): boolean {
  if (!this.isDataLoaded) {
    return false;
  }

  return Object.values(this.formParent.controls).every(control => control.value !== null);
}

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
    if (this.isFormValid()) {
      const title = "Registro exitoso";
      const message = "El registro se ha realizado exitosamente"
      this.Message.showModal(title,message);
    }
    this.router.navigate(['/diagnosticoDoc'])
  }

  goBack() {
    this.router.navigate(['/dashboard'])
  }

}
