import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment.prod'
import { LoginI } from '../../models/loginInterface'
import { ResponseI } from '../../models/responseInterface'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  // apiURL = environment.apiURL;

  // constructor(
  //   private http: HttpClient
  // ) { }

  // login(form: LoginI): Observable<ResponseI>{
  //   const {registroNacionalDeTurismo,pass} = form;
  //   let direccion = `${this.apiURL}/api/Usuario/LoginUsuario?usuario=${registroNacionalDeTurismo}&Password=${pass}`;
   
  //   return this.http.post<any>(direccion, {})

  apiURL = environment.apiURL
  constructor(private http: HttpClient) {}
  login(form: LoginI): Observable<ResponseI> {
    const { registroNacionalDeTurismo, pass } = form
    const refresh = localStorage.getItem('refresh');
    const headers = { 'Content-Type': 'application/json', 'tokenAccess': refresh || 'falta token' };
    let direccion = `${this.apiURL}/api/Usuario/LoginUsuario?usuario=${registroNacionalDeTurismo}&Password=${pass}`

    return this.http.post<any>(
      direccion, 
      { registroNacionalDeTurismo, pass },
      {headers}
      )
  }
  createUser(request: any): Observable<any> {

    let direccion = `${this.apiURL}/api/Usuario`
    return this.http.post<any>(direccion, request)
  }

  refreshToken(token:string){
    return this.http.post(this.apiURL + 'refreshtoken', {
      refreshToken: token
    }, httpOptions);
  }
}
  

