import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms'

@Component({
  selector: 'app-app-register',
  templateUrl: './app-register.component.html',
  styleUrls: ['./app-register.component.css']
})
export class AppRegisterComponent implements OnInit {
  public registerForm!: FormGroup;  
  constructor() { }

  ngOnInit(): void {
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
