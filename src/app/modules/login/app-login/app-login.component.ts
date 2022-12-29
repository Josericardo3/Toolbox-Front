import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms'
// import custom validator  class
import { CustomValidators } from '../../../models/customeValidator';


@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {

  public loginForm!: FormGroup;  
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
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

  onLogin(form: any){
    console.log(form)
  }
}
