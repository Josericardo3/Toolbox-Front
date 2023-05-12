import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/servicios/api/api.service';
import {FormGroup, FormControl, Validators, FormBuilder, NgModel} from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service' 

declare var $: any;
@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {
  recoveryForm: FormGroup;  
  error: string;
  mostrarFormulario2: boolean = false;
  passwordHidden = true;
  //password: string;
  //confirmPassword: string;
  //error: string;
  id: string;
  correo: string;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private Message: ModalService,
    private ApiService: ApiService,
    private formBuilder: FormBuilder
    ) {
      this.recoveryForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      codigo: ['', Validators.required],
      password: ['', Validators.required],
      confirmarPassword: ['', Validators.required]
    }); }
  togglePasswordVisibility() {
    this.passwordHidden = !this.passwordHidden;
  }
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    //const title = "Aviso";
    //const message = "Se le ha enviado un correo con su codigo de recuperación"
    //this.Message.showModal(title,message);
  }
  sendEmail(){
    this.correo = this.recoveryForm.get('correo')?.value;
    if(!!this.correo){
      this.ApiService.sendEmailRecovery(this.correo).subscribe(
        (data: any) => {
          this.mostrarFormulario2 = true;
        }
      )
    }else{
      const title = "Error";
      const message = "Debe ingresar un correo"
      this.Message.showModal(title,message);
    }
  }
  resetPassword() {
    const passwordInput = document.querySelector('#password') as HTMLInputElement;
    const password = passwordInput.value;
    const confirmPasswordInput = document.querySelector('#confirm-password') as HTMLInputElement;
    const confirmPassword = confirmPasswordInput.value;
    const code = document.querySelector('#code') as HTMLInputElement;
    const userCode = code.value;
    if (password !== confirmPassword) {
      this.error = "Las contraseñas no coinciden";
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,8}$/; // 8 caracteres, 1 mayuscula, 1 numero, 1 caracter especial, no espacios
    if (!password.match(passwordRegex)) {
    this.error = "La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 número y 1 caracter especial.";

    return;
    }
    this.http.post(`https://ec2-18-206-91-231.compute-1.amazonaws.com:8051/api/Validaciones/CambioContraseña?password=${password}&id=${userCode}`, { id: this.id })
      .subscribe(
        (response: any) => {
          if(response.valor == "Contraseña cambiada satisfactoriamente"){
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
