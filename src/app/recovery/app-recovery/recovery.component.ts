import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  password: string;
  confirmPassword: string;
  error: string;
  id: string;

  constructor(private http: HttpClient, private route: ActivatedRoute,private router: Router, private Message: ModalService,) { }

  ngOnInit() {
    //this.id = this.route.snapshot.paramMap.get('id');
    const title = "Aviso";
    const message = "Se le ha enviado un correo con su codigo de recuperación"
    this.Message.showModal(title,message);
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
    this.http.post(`https://www.toolbox.somee.com/api/Validaciones/CambioContraseña?password=${password}&id=${userCode}`, { id: this.id })
      .subscribe(
        (response) => {
          const title = "Exito";
          const message = "Contraseña cambiada con exito"
          this.Message.showModal(title,message);
          this.router.navigate(['/']);
          
          
        },
        (error: string) => console.log(error)
      );
  }
  onPasswordInput() {
    this.error = '';
  }
}
