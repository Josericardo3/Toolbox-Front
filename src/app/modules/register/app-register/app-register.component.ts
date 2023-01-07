import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn} from '@angular/forms'
import { CustomValidators } from '../../../models/customeValidator'
import { ApiService } from '../../../servicios/api/api.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-app-register',
  templateUrl: './app-register.component.html',
  styleUrls: ['./app-register.component.css']
})
export class AppRegisterComponent implements OnInit {
  public registerForm!: FormGroup; 
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      numeroDeIdentificacionTributaria:['', Validators.required],
      registroNacionalDeTurismo: ['', Validators.required],
      categoriaRnt:['', Validators.required],
      subcategoriaRnt:['', Validators.required],
      nombreDelPst:['', Validators.required],
      razonSocialDelPst:['', Validators.required],
      correo: ['', Validators.compose([
        Validators.pattern(this.emailPattern),
        Validators.required])
      ],
      telefonoDelPst:['', Validators.required],
      nombreDelRepresenteLegal:['', Validators.required],
      correoRepresentanteLegal:['', Validators.compose([
        Validators.pattern(this.emailPattern),
        Validators.required])
      ],
      telefonoDelRepresentanteLegal:['', Validators.required],
      tipoDeIdentificacionDelRepresentanteLegal:['', Validators.required],
      identificacionDelRepresentanteLegal:['', Validators.required],
      municipio:['', Validators.required],
      correoDelResponsableDeSostenibilidad:['', Validators.compose([
        Validators.pattern(this.emailPattern),
        Validators.required])
      ],
      telefonoDelResponsableDeSostenibilidad:['', Validators.required],
      nombreDelResponsableDeSostenibilidad:['', Validators.required], 
      password1: ['', Validators.compose([
      Validators.required,
      CustomValidators.patternValidator(/\d/, { hasNumber: true }),
      CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      CustomValidators.patternValidator(/(?=.*?[#?!@$%^&*-])/, { hasSpecialCharacters: true }),
      Validators.minLength(8),
      Validators.maxLength(12),
     ]),
    ],
    confirmPassword: [null, Validators.compose([Validators.required])]
    },
    {
      // check whether our password and confirm password match
      validator: CustomValidators.comparePassword,
   })
  }

  seePasswordRegister(){
    const passRegister = document.querySelector('#passRegister') as HTMLInputElement
    const icon = document.querySelector('i') as HTMLElement
    if (passRegister.type === 'password') {
      passRegister.type = 'text';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
    else {
      passRegister.type = 'password';
      icon.classList.add('fa-eye-slash');
      icon.classList.remove('fa-eye');
    }
  }
  
  seePasswordRegister2(){
    const passRegister2 = document.querySelector('#passRegister2') as HTMLInputElement
    const icon = document.querySelector('#i') as HTMLElement
    if (passRegister2.type === 'password') {
      passRegister2.type = 'text';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
    else {
      passRegister2.type = 'password';
      icon.classList.add('fa-eye-slash');
      icon.classList.remove('fa-eye');
    }
  }

  openModal(){
    const modal = document.querySelector('#modalTerminos') as HTMLInputElement
    modal.classList.add('active');
  }
  closeModal(){
    const modal = document.querySelector('#modalTerminos') as HTMLInputElement
    modal.classList.remove('active');
  }

  saveUser(){
    // queda pendiente sólo reemplazar los valores reales 
   //"idUsuarioPst": this.registerForm.get('registroNacionalDeTurismo')?.value,
   console.log(this.registerForm.controls,'valores');
      const request = {
        "idUsuarioPst": 0,
        "nit": "string",
        "rnt": "string",
        "idCategoriaRnt": 0,
        "idSubCategoriaRnt": 0,
        "nombrePst": "string",
        "razonSocialPst": "string",
        "correoPst": "string",
        "telefonoPst": "string",
        "nombreRepresentanteLegal": "string",
        "correoRepresentanteLegal": "string",
        "telefonoRepresentanteLegal": "string",
        "idTipoIdentificacion": 0,
        "identificacionRepresentanteLegal": "string",
        "idDepartamento": 0,
        "idMunicipio": 0,
        "nombreResponsableSostenibilidad": "string",
        "correoResponsableSostenibilidad": "string",
        "telefonoResponsableSostenibilidad": "string",
        "idTipoAvatar": 0
      }
    return this.ApiService.createUser(request)
    .subscribe((data:any)=>{
      // el servicio responde con 200 que todo se guardó 
      console.log(data,'respuesta');

    })

  }
  // onRegister(){
  //   this.usuario.registroNacionalDeTurismo = this.registerForm.get('registroNacionalDeTurismo')?.value;
  //   this.usuario.pass = this.loginForm.get('pass')?.value;
  //   this.ApiService.login(this.usuario)
  //   .subscribe((data: any) => {
  //   console.log('mensaje', data)
  //   this.store.dispatch(saveDataLogin({request:data}));
    //Mel guardado en local storage localStorage.setItem('usuario',data)
    // })

}
