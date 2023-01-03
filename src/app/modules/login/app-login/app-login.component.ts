import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms'
import { ApiService } from 'src/app/servicios/api/api.service';
import { LoginI } from '../../../models/loginInterface';
// import custom validator  class
import { CustomValidators } from '../../../models/customeValidator';
import { Store } from '@ngrx/store';
import { saveDataLogin } from 'src/app/state/action/example.action';



@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {
  usuario = { registroNacionalDeTurismo: '', pass: '',correo:'' };
  public loginForm!: FormGroup;  
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    //private fb: FormBuilder,modificado M
    private api: ApiService,
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private store: Store<{ dataLogin: any }>
    
  ) { 
   console.log(store.select('dataLogin'),'strore mensaje')
}

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      correo: ['', Validators.compose([
        Validators.pattern(this.emailPattern),
        Validators.required])
      ],
      registroNacionalDeTurismo: ['', Validators.required],
      // pass: ['']


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

  //Karen onLogin(form: any){
  //    console.log(form)
  // }

  //Mel
 onLogin(){
  this.usuario.registroNacionalDeTurismo = this.loginForm.get('registroNacionalDeTurismo')?.value;
  this.usuario.pass = this.loginForm.get('pass')?.value;
  this.ApiService.login(this.usuario)
  .subscribe((data: any) => {
 console.log('mensaje', data)
 //this.store.dispatch(saveDataLogin({request:'este es el valor nuevo'}));
  })

  this.store.dispatch(saveDataLogin({request:'este es el valor nuevo'}));

}
   





  loginApi(form: LoginI){
    this.api.login(form)
    .subscribe(data => {
      console.log(data)
    })
  }
}
