import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { LoginI } from '../../models/loginInterface';
import { ResponseI } from '../../models/responseInterface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //url: string = 'http://10.4.3.140:8050/swagger/index.html';
  apiURL = environment.apiURL;

  constructor(
    private http: HttpClient
  ) { }

  // login(form: LoginI): Observable<ResponseI>{
  //   let direccion = this.url;
  //   // return this.http.post<ResponseI>(direccion, form)
  //   return this.http.get(`http://10.4.3.140:8050/swagger/index.html`);
  // }

  // login(){
  //   let direccion = this.url;
  //   // return this.http.post<ResponseI>(direccion, form)
  //   return this.http.get(`http://10.4.3.140:8050/swagger/index.html`);
  // }

  login(form: LoginI): Observable<ResponseI>{
    const {registroNacionalDeTurismo, pass} = form
      let direccion = `${this.apiURL}/api/Usuario/LoginUsuario?usuario=${registroNacionalDeTurismo}&Password=${pass}`;
      // return this.http.post<ResponseI>(direccion, form)
      return this.http.post<ResponseI>(direccion, form);
    }

}
