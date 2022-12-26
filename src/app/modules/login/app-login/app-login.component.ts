import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms'
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {

  // tslint:disable-next-line: max-line-length
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                              
  loginForm = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    registroNacionalDeTurismo: new FormControl('', Validators.required),
    pass: new FormControl('', [Validators.required, Validators.pattern('^(?=(?:.*\d){1})(?=(?:.*[A-Z]){1})(?=(?:.*[a-z]){1})\S{8,}$')])
  });

  constructor(
  ) { }

  ngOnInit(): void {
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
