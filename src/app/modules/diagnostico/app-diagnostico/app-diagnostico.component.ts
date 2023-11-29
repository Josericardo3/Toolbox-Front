import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { BtnEmpezarContinuarService } from 'src/app/servicios/btn-empezar-continuar/btn-empezar-continuar.service';

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
  numeralespecificoStringArray: string[] = [];
  numeralprincipalString: string;
  numeralespecificoString: string;
  public opcionSeleccionada: boolean = false;
  valoresObservaciones: string[] = [];
  valoresRadios: string[] = [];
  valoresForm: any = [];
  v: any = [];
  valor: any;
  valorObs: any;
  public isDataLoaded: boolean = false;
  numeralPrincipal: any;
  bloquearGuardar:boolean = false;
  bloquearRadio:boolean = false;
  bloquearTextarea: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ApiService: ApiService,
    private Message: ModalService,
    private activatedRoute: ActivatedRoute,
    public btnEmpezarContinuarService: BtnEmpezarContinuarService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.numeralPrincipal = params['id'];
        console.log(params['id'])
      }
    });

    this.formParent = this.fb.group({});

    this.ApiService.getDiagnostico()
      .subscribe((data: any) => {
        this.datos = data;
        this.isDataLoaded = true;
        console.log(this.datos)

        if (this.datos && this.datos.campos) {
          console.log('Datos filtrados:', this.datos.campos);
          this.datos.campos = this.datos.campos.filter(campo =>
            campo.NUMERAL_PRINCIPAL === this.numeralPrincipal ||
            campo.NUMERAL_PRINCIPAL === this.numeralPrincipal.toUpperCase()
          );
        }

        //Validar Radios para habilitar el formulario
        const formControls = {};
        this.datos.campos.forEach((campo, j) => {
          campo.listacampos.forEach((subcampo, i) => {
            formControls[`radio${j}-${i}`] = new FormControl(null);
          });
        });
        this.formParent = new FormGroup(formControls);

        // Recorremos el objeto y guardamos los valores en las variables correspondientes      
        this.datos.campos.forEach((campo: any, j) => {
          this.numeralprincipalArray.push(String(campo.numeralprincipal));
          this.numeralprincipalString = this.numeralprincipalArray.join(',');
          campo.listacampos.forEach((listacampo: any, i) => {
            this.numeralespecificoArray.push(String(listacampo.numeralespecifico));
            this.numeralespecificoString = this.numeralespecificoArray.join(',');

            // Procesar VALOR_RESPUESTA
            if (listacampo.VALOR_RESPUESTA) {
              const radioValue = this.getRadioValue(listacampo.VALOR_RESPUESTA);
              console.log(radioValue)
              this.formParent.get(`radio${j}-${i}`).setValue(radioValue);
            }

            // Procesar OBSERVACION_RESPUESTA
            // if (listacampo.NUMERAL_ESPECIFICO && listacampo.OBSERVACION_RESPUESTA) {
            //   this.formParent.get(`observacion-${listacampo.NUMERAL_ESPECIFICO}`).setValue(listacampo.OBSERVACION_RESPUESTA);
            // }
          });
        });

        // Agregar propiedad bloquearGuardar a cada objeto en datos.campos
        this.datos.campos.forEach(campo => {
          campo.listacampos.forEach(subcampo => {
            subcampo.bloquearGuardar = false;
          });
        });
      });
  }

  getRadioValue(valorRespuesta: string): any {
    switch (valorRespuesta) {
      case '1':
        return 1;
      case '2':
        return 2;
      case '3':
        return 3;
      case '4':
        return 4;
      default:
        return ''; // o cualquier otro valor predeterminado
    }
  }

  isButtonDisabled(j: number, i: number): boolean {
    if (!this.isDataLoaded) {
      return true;
    }

    const listacampo = this.datos.campos[j].listacampos[i];

    return listacampo.VALOR_RESPUESTA !== null || listacampo.OBSERVACION_RESPUESTA !== null;
  }

  public isFormValid(j: number, i: number): boolean {
    if (!this.isDataLoaded) {
      return false;
    }

    const formControls = Object.keys(this.formParent.controls)
      .filter(key => key.startsWith(`radio${j}-${i}`));

    return formControls.every(controlKey => {
      const control = this.formParent.get(controlKey);
      return control !== null && control.value !== null;
    });
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

  capturarValor(event: any, value: any, numeralprincipal: any, numeralEspecifico: any) {
    const normaValue = localStorage.getItem('idNormaSelected');
    const result = this.valoresForm.find((o: any) => o.numeralespecifico === numeralEspecifico);
    if (result) {
      result.valor = value;
    } else {
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

  capturarValorObs(event: Event, numeralprincipal: any, numeralEspecifico: any) {
    this.valorObs = (event.target as HTMLInputElement).value;
    const normaValue = localStorage.getItem('idNormaSelected');
    const result = this.valoresForm.find((o: any) => o.numeralespecifico === numeralEspecifico);
    if (result) {
      result.observacion = this.valorObs;
    } else {
      this.valoresForm.push({
        "valor": "",
        "idnormatecnica": normaValue,
        "idusuario": localStorage.getItem('Id'),
        "numeralprincipal": numeralprincipal,
        "numeralespecifico": numeralEspecifico,
        "observacion": this.valorObs,
      });
    }
  }
  
  saveForm(j: number, i: number) {
    if (this.isFormValid(j, i)) {

      const formularioActual = this.datos.campos[j].listacampos[i];
      const valoresFormulario = this.valoresForm.filter(item =>
        item.numeralprincipal === formularioActual.NUMERAL_PRINCIPAL &&
        item.numeralespecifico === formularioActual.NUMERAL_ESPECIFICO
      );
      console.log(valoresFormulario)

      this.ApiService.saveDataDiagnostico(valoresFormulario)
        .subscribe((data: any) => {
          const request = {
            FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
            TIPO: "Modulo",
            MODULO: "diagnosticoDoc"
          };
          console.log(request)
          this.ApiService.postMonitorizacionUsuario(request).subscribe();
          const title = "Registro exitoso";
          const message = "Se guardaron los campos correctamente";
          this.Message.showModal(title, message);
          // this.bloquearGuardar = true;
          formularioActual.bloquearGuardar = true;
    //           formularioActual.listacampos.forEach((subcampo: any) => {
    //   subcampo.bloquearGuardar = true;
    // });
          // this.router.navigate(['/diagnosticoDoc']) 

          // Incrementar el progreso actual y obtener el nuevo valor
          // const progresoActual = this.btnEmpezarContinuarService.obtenerProgreso(formularioActual.NUMERAL_PRINCIPAL) + 1;

          // Actualizar el progreso en el servicio
          // this.btnEmpezarContinuarService.actualizarProgreso(formularioActual.NUMERAL_PRINCIPAL, progresoActual);

          // Notificar al servicio que se ha guardado el formulario
          // this.btnEmpezarContinuarService.actualizarGuardado(formularioActual.NUMERAL_PRINCIPAL, true);

        });
    }
  }
  
  isLetra(numeral: string): boolean {
    return /^[A-Za-z]$/.test(numeral);
  }

}