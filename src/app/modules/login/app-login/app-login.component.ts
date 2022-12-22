import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {

  constructor() { }

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
}
