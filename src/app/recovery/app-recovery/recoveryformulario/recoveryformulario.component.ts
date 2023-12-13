import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/servicios/api/api.service';
import {FormGroup, FormControl, Validators, FormBuilder, NgModel} from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service' 
import { environment } from 'src/environments/environment.prod';
import { CustomValidators } from "../../../models/customeValidator";

declare var $: any;
@Component({
  selector: 'app-recoveryformulario',
  templateUrl: './recoveryformulario.component.html',
  styleUrls: ['./recoveryformulario.component.css']
})
export class RecoveryFormularioComponent implements OnInit {
  public recoveryForm!: FormGroup;  
  error: string;
  mostrarFormulario2: boolean = false;
  passwordHidden = true;
  apiURLNuevo = environment.apiURLNuevo
  //password: string;
  //confirmPassword: string;
  //error: string;
  id: string;
  correo: string;
  showError=false;
  errorMessage!: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private Message: ModalService,
    private ApiService: ApiService,
    private renderer: Renderer2,
    private formBuilder: FormBuilder
    ) {}
  togglePasswordVisibility() {
    this.passwordHidden = !this.passwordHidden;
  }
  ngOnInit():void {
    this.id = this.route.snapshot.paramMap.get('id');
    //const title = "Aviso";
    //const message = "Se le ha enviado un correo con su codigo de recuperación"
    //this.Message.showModal(title,message);
    this.recoveryForm = this.formBuilder.group({
      pass: [
        "",
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          //CustomValidators.patternValidator(/(?=.*?[#?!@$%^&*-])/, {
            CustomValidators.patternValidator(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9 ]).{8,12}$/,{
              hasSpecialCharacters: true,
            }),
            CustomValidators.patternValidator(/^[^\s]*$/, {
              noSpaces: true,
            }),
          Validators.minLength(8),
          Validators.maxLength(12),
        ]),
      ],
      pass2: [
        "",
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          //CustomValidators.patternValidator(/(?=.*?[#?!@$%^&*-])/, {
            CustomValidators.patternValidator(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9 ]).{8,12}$/,{
              hasSpecialCharacters: true,
            }),
            CustomValidators.patternValidator(/^[^\s]*$/, {
              noSpaces: true,
            }),
          Validators.minLength(8),
          Validators.maxLength(12),
        ]),
      ]
    }); 
  }
  seePassword() {
    const passLogin = document.querySelector("#passLogin") as HTMLInputElement;
    const icon = document.querySelector("#icon") as HTMLElement;
    if (passLogin.type === "password") {
      passLogin.type = "text";
      this.renderer.setStyle(icon, 'color', '#068460');
    } else {
      passLogin.type = "password";
      this.renderer.setStyle(icon, 'color', 'black');
    }
  }
  seePassword2() {
    const passLogin2 = document.querySelector("#passLogin2") as HTMLInputElement;
    const icon2 = document.querySelector("#icon2") as HTMLElement;
    if (passLogin2.type === "password") {
      passLogin2.type = "text";
      this.renderer.setStyle(icon2, 'color', '#068460');
    } else {
      passLogin2.type = "password";
      this.renderer.setStyle(icon2, 'color', 'black');
    }
  }
  resetPassword() {
    const passwordInput = document.querySelector('#passLogin') as HTMLInputElement;
    const password = passwordInput.value;
    const confirmPasswordInput = document.querySelector('#passLogin2') as HTMLInputElement;
    const confirmPassword = confirmPasswordInput.value;
    const code = document.querySelector('#code') as HTMLInputElement;
    const userCode = code.value;
    if (password !== confirmPassword) {
      this.error = "Las contraseñas no coinciden";
      return;
    }
    //const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/; // 8 caracteres, 1 mayuscula, 1 numero, 1 caracter especial, no espacios
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/; // 8 caracteres, 1 mayuscula, 1 numero, 1 caracter especial, no espacios
    if (!password.match(passwordRegex)) {
    this.error = "La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 número y 1 caracter especial.";

    return;
    }

    this.http.post(`${this.apiURLNuevo}/api/Validaciones/CambioContraseña?password=${password}&id=${userCode}`, { id: this.id })

      .subscribe(
       
        (response: any) => {
          if(response.Valor == "Contraseña cambiada satisfactoriamente"){
            const title = "Exito";
            const message = "Contraseña cambiada con exito"
            this.Message.showModal(title,message);
            this.router.navigate(['/']);
          }else{
            this.error = "El codigo ingresado es incorrecto"
          }
        },
        (error: string) => console.log(error)
      );
  }
  onPasswordInput() {
    this.error = '';
  }
}
