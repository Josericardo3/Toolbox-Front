import { Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms'
import { ApiService } from 'src/app/servicios/api/api.service';
import { LoginI } from '../../../models/loginInterface';
import { Router } from '@angular/router';
// import custom validator  class
import { CustomValidators } from '../../../models/customeValidator';
import { ResponseI } from 'src/app/models/responseInterface';
import { Store } from '@ngrx/store';
import { saveDataLogin } from 'src/app/state/action/example.action';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
//PG import { TokenStorageService } from '../../../servicios/token/token-storage.service';


@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {
  arrResult:any;
  usuario = { registroNacionalDeTurismo: '', pass: '',correo:'' };
  public loginForm!: FormGroup;  
  errorMessage!: string;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private store: Store<{ dataLogin: any }>
  //   { 
  //     console.log(store.select('dataLogin'),'strore mensaje')
  //  }
  ) { }

  ngOnInit(): void {
    //limpia el storage
    localStorage.removeItem('normaSelected')
    this.loginForm = this.formBuilder.group({
      correo: ['', Validators.compose([
        Validators.pattern(this.emailPattern),
        Validators.required])
      ],
      registroNacionalDeTurismo: ['', Validators.required],
      pass: ['', Validators.compose([
      Validators.required,
      CustomValidators.patternValidator(/\d/, { hasNumber: true }),
      CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      CustomValidators.patternValidator(/(?=.*?[#?!@$%^&*-])/, { hasSpecialCharacters: true }),
      Validators.minLength(8),
      Validators.maxLength(12),
     ])
    ],
    });
  }
 
  seePassword(){
    const passLogin = document.querySelector('#passLogin') as HTMLInputElement
    const icon = document.querySelector('i') as HTMLElement
    if (passLogin.type === 'password') {
      passLogin.type = 'text';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
    else {
      passLogin.type = 'password';
      icon.classList.add('fa-eye-slash');
      icon.classList.remove('fa-eye');
    }
  }

  // --------NO BORRAR------
  // onLoginA(form: any | LoginI){
  //   console.log("entre", form)
  //     this.api.login(form)
  //     .subscribe(data => {
  //       console.log(data, 'DATA DE LA API')
  //       // let dataResponse: ResponseI = data
  //       // if (dataResponse.status == 'ok') {
  //       //   localStorage.setItem("token", dataResponse.result.token);
  //       //   this.router.navigate(['dashboard']);
  //       // }
  //     })
  //   }


  //Mel guardado en local storage localStorage.setItem('usuario',data)
 onLogin(){
  debugger
  console.log('onLogin')
  this.usuario.correo = this.loginForm.get('correo')?.value;
  this.usuario.registroNacionalDeTurismo = this.loginForm.get('registroNacionalDeTurismo')?.value;
  this.usuario.pass = this.loginForm.get('pass')?.value;
  console.log(this.usuario.registroNacionalDeTurismo, this.usuario.pass)
  //jalar el valor del correo
  this.ApiService.login(this.usuario)
  .subscribe((data: any) => {
    console.log(data)   
      this.store.dispatch(saveDataLogin({request:data}));
      localStorage.setItem('rol',data.permisoUsuario[0]?.item || 1)
      localStorage.setItem('access',data.TokenAcceso)
      localStorage.setItem('refresh',data.TokenRefresco)
      localStorage.setItem('Id',data.IdUsuarioPst)
     
      // Login successful, redirect to homepage
      this.router.navigate(['/dashboard']);
      console.log('ingresó al dash')

    this.ApiService.getNorma(data.IdUsuarioPst)
    .subscribe((data:any)=>{
        if(data[0].idCategoriarnt === 5 ||data[0].idCategoriarnt === 2){
          this.arrResult = data;//remplazar arriba
          localStorage.setItem('norma',JSON.stringify(this.arrResult))
          const modalInicial = document.querySelector("#modal-inicial") as HTMLElement;
          modalInicial.style.display = "block";
        }else{
          this.arrResult = data;
          localStorage.setItem('norma',JSON.stringify(this.arrResult))
          localStorage.setItem("normaSelected",data[0].norma);
          this.router.navigate(['/dashboard']);
        }
    
    //   //data.idCategoriaRnt=5;//prueba
      
    })
  }, 
  (e: HttpErrorResponse) => {
    e.status
    console.log('no hay correo o pass')
    this.errorMessage = "Correo o contraseña inválidos";
  }
  )
}
  
}
