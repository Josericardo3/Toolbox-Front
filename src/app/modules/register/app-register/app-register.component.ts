import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { CustomValidators } from '../../../models/customeValidator'
import { ApiService } from '../../../servicios/api/api.service'
import { Store } from '@ngrx/store'
//import { AppModalRegisterComponent } from '../../modal/app-modal-register/app-modal-register.component';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/dialog.js';
import { DynamicHostDirective } from 'src/app/directives/dynamic-host.directive';

@Component({
  selector: 'app-app-register',
  templateUrl: './app-register.component.html',
  styleUrls: ['./app-register.component.css'],
})
export class AppRegisterComponent implements OnInit {
  //@ViewChild(DynamicHostDirective) 
  public registerForm!: FormGroup
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    //public dinamycHost: DynamicHostDirective,
    private ComponentFactoryResolver: ComponentFactoryResolver,
    private ApiService: ApiService,
    private store: Store<{ dataLogin: any }>,
  ) {}

  ngOnInit(): void {
    console.log(this.store.select('dataLogin'), 'strore mensaje')
    this.registerForm = this.formBuilder.group(
      {
        numeroDeIdentificacionTributaria: ['', Validators.required],
        registroNacionalDeTurismo: ['', Validators.required],
        categoriaRnt: ['', Validators.required],
        subcategoriaRnt: ['', Validators.required],
        nombreDelPst: ['', Validators.required],
        razonSocialDelPst: ['', Validators.required],
        correo: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],
        telefonoDelPst: ['', Validators.required],
        nombreDelRepresenteLegal: ['', Validators.required],
        correoRepresentanteLegal: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],
        telefonoDelRepresentanteLegal: ['', Validators.required],
        tipoDeIdentificacionDelRepresentanteLegal: ['', Validators.required],
        identificacionDelRepresentanteLegal: ['', Validators.required],
        departamento: ['', Validators.required],
        municipio: ['', Validators.required],
        correoDelResponsableDeSostenibilidad: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],
        telefonoDelResponsableDeSostenibilidad: ['', Validators.required],
        nombreDelResponsableDeSostenibilidad: ['', Validators.required],
        password1: [
          '',
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
            CustomValidators.patternValidator(/(?=.*?[#?!@$%^&*-])/, {
              hasSpecialCharacters: true,
            }),
            Validators.minLength(8),
            Validators.maxLength(12),
          ]),
        ],
        confirmPassword: [null, Validators.compose([Validators.required])],
        checkbox: ['', Validators.required],
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.comparePassword,
      },
    )
  }

  seePasswordRegister() {
    const passRegister = document.querySelector(
      '#passRegister',
    ) as HTMLInputElement
    const icon = document.querySelector('i') as HTMLElement
    if (passRegister.type === 'password') {
      passRegister.type = 'text'
      icon.classList.remove('fa-eye-slash')
      icon.classList.add('fa-eye')
    } else {
      passRegister.type = 'password'
      icon.classList.add('fa-eye-slash')
      icon.classList.remove('fa-eye')
    }
  }

  seePasswordRegister2() {
    const passRegister2 = document.querySelector(
      '#passRegister2',
    ) as HTMLInputElement
    const icon = document.querySelector('#i') as HTMLElement
    if (passRegister2.type === 'password') {
      passRegister2.type = 'text'
      icon.classList.remove('fa-eye-slash')
      icon.classList.add('fa-eye')
    } else {
      passRegister2.type = 'password'
      icon.classList.add('fa-eye-slash')
      icon.classList.remove('fa-eye')
    }
  }

    openModal() {
      // const componentListaArea = this.ComponentFactoryResolver.resolveComponentFactory(AppModalRegisterComponent);
      // this.dinamycHost.viewContainerRef.clear();
      // this.dinamycHost.viewContainerRef.createComponent(componentListaArea).instance
    const modal = document.querySelector('#modalTerminos') as HTMLInputElement
    modal.classList.add('active')
  }

  closeModal(evt: any) {
      evt.defaultPrevented;
      console.log(evt,"evt")
      const modal = document.querySelector('#modalTerminos') as HTMLInputElement
      modal.classList.remove('active')
     }
  saveUser() {
    console.log(this.registerForm.get('municipio'), 'valores')
    const request = {
      nit: this.registerForm.get('numeroDeIdentificacionTributaria')?.value,
      rnt: this.registerForm.get('registroNacionalDeTurismo')?.value,
      idCategoriaRnt: this.registerForm.get('categoriaRnt')?.value,
      idSubCategoriaRnt: this.registerForm.get('subcategoriaRnt')?.value,
      nombrePst: this.registerForm.get('nombreDelPst')?.value,
      razonSocialPst: this.registerForm.get('razonSocialDelPst')?.value,
      correoPst: this.registerForm.get('correo')?.value,
      telefonoPst: this.registerForm.get('telefonoDelPst')?.value,
      nombreRepresentanteLegal: this.registerForm.get(
        'nombreDelRepresenteLegal',
      )?.value,
      correoRepresentanteLegal: this.registerForm.get(
        'correoRepresentanteLegal',
      )?.value,
      telefonoRepresentanteLegal: this.registerForm.get(
        'telefonoDelRepresentanteLegal',
      )?.value,
      idTipoIdentificacion: 1,
      identificacionRepresentanteLegal: this.registerForm.get(
        'identificacionDelRepresentanteLegal',
      )?.value,
      idDepartamento: 1,
      idMunicipio: 1,
      nombreResponsableSostenibilidad: this.registerForm.get(
        'nombreDelResponsableDeSostenibilidad',
      )?.value,
      correoResponsableSostenibilidad: this.registerForm.get(
        'correoDelResponsableDeSostenibilidad',
      )?.value,
      telefonoResponsableSostenibilidad: this.registerForm.get(
        'telefonoDelResponsableDeSostenibilidad',
      )?.value,
      password: this.registerForm.get('password1')?.value,
      idTipoAvatar: 1,
    }
    //console.log(request, 'newrequest')
    return this.ApiService.createUser(request).subscribe((data: any) => {
      console.log(data,'new data')
      if(data.statusCode===201){
        this.router.navigate(["/dashboard"]);
      }
      // el servicio responde con 200 que todo se guardó
      //console.log(data, 'respuesta')
    })
  }
}
