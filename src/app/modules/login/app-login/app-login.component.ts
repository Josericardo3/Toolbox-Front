import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  NgModel,
} from "@angular/forms";
import { ApiService } from "src/app/servicios/api/api.service";
import { LoginI } from "../../../models/loginInterface";
import { Router } from "@angular/router";
// import custom validator  class
import { CustomValidators } from "../../../models/customeValidator";
import { ResponseI } from "src/app/models/responseInterface";
import { Store } from "@ngrx/store";
import { saveDataLogin } from "src/app/state/action/example.action";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ModalService } from "src/app/messagemodal/messagemodal.component.service";
//PG import { TokenStorageService } from '../../../servicios/token/token-storage.service';

@Component({
  selector: "app-app-login",
  templateUrl: "./app-login.component.html",
  styleUrls: ["./app-login.component.css"],
})
export class AppLoginComponent implements OnInit {
  arrResult: any;
  arrNormas: any;
  usuario = { registroNacionalDeTurismo: "", pass: "", correo: "" };
  public loginForm!: FormGroup;
  errorMessage!: string;
  private emailPattern: any =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private Message: ModalService,
    private store: Store<{ dataLogin: any }>
  ) //   {
  //  }
  {}

  ngOnInit(): void {
    
    localStorage.clear();
    //limpia el storage
    localStorage.removeItem("normaSelected");
    this.loginForm = this.formBuilder.group({
      correo: [
        "",
        Validators.compose([
          Validators.pattern(this.emailPattern),
          Validators.required,
        ]),
      ],
      registroNacionalDeTurismo: ["", Validators.required],
      pass: [
        "",
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          //CustomValidators.patternValidator(/(?=.*?[#?!@$%^&*-])/, {
          CustomValidators.patternValidator(/(?=.*[!@#$%^&*()\-_=+{};:,<.>])/, {
            hasSpecialCharacters: true,
          }),
          Validators.minLength(8),
          Validators.maxLength(12),
        ]),
      ],
    });
  }
  seePassword() {
    const passLogin = document.querySelector("#passLogin") as HTMLInputElement;
    const icon = document.querySelector("i") as HTMLElement;
    if (passLogin.type === "password") {
      passLogin.type = "text";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    } else {
      passLogin.type = "password";
      icon.classList.add("fa-eye-slash");
      icon.classList.remove("fa-eye");
    }
  }

  onLogin() {
    this.usuario.correo = this.loginForm.get("correo")?.value;
    this.usuario.registroNacionalDeTurismo = this.loginForm.get(
      "registroNacionalDeTurismo"
    )?.value;
    this.usuario.correo = this.loginForm.get("correo")?.value;
    this.usuario.pass = this.loginForm.get("pass")?.value;
    this.usuario.pass = reemplazarCaracteresEspeciales(this.usuario.pass);
    //jalar el valor del correo
    this.ApiService.login(this.usuario).subscribe(
      (data: any) => {

       //PARA TOMAR TIPO_USUARIO
        localStorage.setItem("TIPO_USUARIO", data.Grupo[0].TIPO_USUARIO);
        if (data.Grupo[0].TIPO_USUARIO === 2 || data.Grupo[0].TIPO_USUARIO === 8) {
          this.router.navigate(["/gestionUsuario"]);
        } 

        this.store.dispatch(saveDataLogin({ request: data }));
        localStorage.setItem("rol", data.permisoUsuario[0]?.item || 1);
        localStorage.setItem("access", data.TokenAcceso);
        localStorage.setItem("refresh", data.TokenRefresco);
        localStorage.setItem("idGrupo", data.Grupo[0].ITEM);
        localStorage.setItem("Id", data.ID_USUARIO);
        localStorage.setItem("rnt",this.usuario.registroNacionalDeTurismo);
        this.ApiService.getNorma(data.ID_USUARIO).subscribe(
          (categ: any) => {
            this.arrNormas = categ;
            localStorage.setItem(
              "idCategoria",
              JSON.stringify(this.arrNormas[0].FK_ID_CATEGORIA_RNT));
        });
        if (data.Grupo[0].ITEM === 1 || data.Grupo[0].ITEM === 6 || data.Grupo[0].ITEM === 7) {
          this.ApiService.validateCaracterizacion(data.ID_USUARIO).subscribe(
            (response) => {
              if (response) {
                this.ApiService.getNorma(data.ID_USUARIO).subscribe(
                  (data: any) => {

                    if (
                      data[0].FK_ID_CATEGORIA_RNT === 5 ||
                      data[0].FK_ID_CATEGORIA_RNT === 2
                    ) {
                      this.arrResult = data;

                      localStorage.setItem(
                        "norma",
                        JSON.stringify(this.arrResult)
                      );
                      //No funciona
                      /*
                      const modalInicial = document.querySelector(
                        "#modal-inicial"
                      ) as HTMLElement;
                      modalInicial.style.display = "block";*/
                    } else {
                      this.arrResult = data;
                      localStorage.setItem(
                        "norma",
                        JSON.stringify(this.arrResult)
                      );
                      localStorage.setItem("normaSelected", data[0].NORMA);
                      localStorage.setItem("idNormaSelected", data[0].ID_NORMA);
                      //modified by mel
                      if( data[0].ID_NORMA === 1){
                      this.router.navigate(["/dashboard"]);
                      }else{
                        this.router.navigate(["/dashboard"]);
                      }
                     
                    }
                  }
                );
              } else {
                this.router.navigate(["/dashboard"]);
              }
            }
          );
        } else {
          // cuando el item es != de 1 es un asesor
          this.router.navigate(["/gestionUsuario"]);
        }
      },
      (e: HttpErrorResponse) => {
        e.status;
        this.errorMessage = "Correo o contraseña inválidos";
      }
    );
  }
}

function reemplazarCaracteresEspeciales(str) {
  let nuevoStr = "";

  for (let i = 0; i < str.length; i++) {
    let asciiCode = str.charCodeAt(i);

    if (asciiCode < 48 || asciiCode > 126) {
      nuevoStr += encodeURIComponent(str[i]);
    } else {
      nuevoStr += str[i];
    }
  }
  return nuevoStr;
}
