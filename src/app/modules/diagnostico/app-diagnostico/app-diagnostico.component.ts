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
        });
      });
    });
  }

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

  capturarValor(event: any, value: any ,numeralprincipal: any , numeralEspecifico: any) {
    const normaValue = localStorage.getItem('idNormaSelected');
    const result = this.valoresForm.find((o: any) => o.numeralespecifico === numeralEspecifico);
    if (result) {
      result.valor = value;
    }else{
      this.valoresForm.push({
        "valor": value,
        "idnormatecnica": normaValue,
        "idusuario": localStorage.getItem('Id'),
        "numeralprincipal": numeralprincipal,
        "numeralespecifico": numeralEspecifico,
        "observacion": "",
      });
    }
  }

  capturarValorObs(event: Event,numeralprincipal: any , numeralEspecifico: any){
    this.valorObs = (event.target as HTMLInputElement).value;
    const normaValue = localStorage.getItem('idNormaSelected');
    const result = this.valoresForm.find((o: any) => o.numeralespecifico === numeralEspecifico);
    if (result) {
      result.observacion = this.valorObs;
    }else{
      this.valoresForm.push({
        "valor": "",
        "idnormatecnica": normaValue,
        "idusuario": localStorage.getItem('Id'),
        "numeralprincipal": numeralprincipal,
        "numeralespecifico": numeralEspecifico,
        "observacion": this.valorObs,
      });
      // capturarObservacion();
    }
  }

  saveForm(){
    if (this.isFormValid()) {   
      this.ApiService.saveDataDiagnostico(this.valoresForm)
      .subscribe((data: any) => {   
        const request = {
          FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
          TIPO: "Modulo",
          MODULO: "diagnosticoDoc"
        };
        this.ApiService.postMonitorizacionUsuario(request).subscribe();  
        const title = "Registro exitoso";
        const message = "Se guardaron los campos correctamente";
        this.Message.showModal(title, message);
        this.router.navigate(['/diagnosticoDoc']) 
      });
    }
  }
}
