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
          CustomValidators.patternValidator(/(?=.*?[#?!@$%^&*-])/, {
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
        this.store.dispatch(saveDataLogin({ request: data }));
        localStorage.setItem("rol", data.permisoUsuario[0]?.item || 1);
        localStorage.setItem("access", data.TokenAcceso);
        localStorage.setItem("refresh", data.TokenRefresco);
        localStorage.setItem("idGrupo", data.Grupo[0].item);
        localStorage.setItem("Id", data.IdUsuarioPst);
        debugger
        if (data.Grupo[0].item === 1) {
          this.ApiService.validateCaracterizacion(data.IdUsuarioPst).subscribe(
            (response) => {
              if (response) {
                this.ApiService.getNorma(data.IdUsuarioPst).subscribe(
                  (data: any) => {
                    if (
                      data[0].idCategoriarnt === 5 ||
                      data[0].idCategoriarnt === 2
                    ) {
                      this.arrResult = data;

                      localStorage.setItem(
                        "norma",
                        JSON.stringify(this.arrResult)
                      );
                      const modalInicial = document.querySelector(
                        "#modal-inicial"
                      ) as HTMLElement;
                      modalInicial.style.display = "block";
                    } else {
                      this.arrResult = data;
                      localStorage.setItem(
                        "norma",
                        JSON.stringify(this.arrResult)
                      );
                      localStorage.setItem("normaSelected", data[0].norma);
                      this.router.navigate(["/dashboard"]);
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
