import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http'
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
    const { registroNacionalDeTurismo, pass, correo } = form
    const refresh = localStorage.getItem('refresh');
    const headers = { 'Content-Type': 'application/json', 'tokenAccess': refresh || 'falta token' };
    let direccion = `${this.apiURL}/api/Usuario/LoginUsuario?usuario=${registroNacionalDeTurismo}&Password=${pass}&correo=${correo}`
    return this.http.post<any>(
      direccion, 
      {observe: "response"}
      // { registroNacionalDeTurismo, pass },
      // {headers}
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

  getUser(idUsuario: any): Observable<any> {
    let direccion = `${this.apiURL}/api/Usuario/${idUsuario}`
    return this.http.get<any>(direccion, idUsuario)
  }

  getNorma(idCategoria:any){
    let norma = `${this.apiURL}/api/Usuario/SelectorDeNorma?id=${idCategoria}`
    return this.http.get<any>(norma, idCategoria)
  }

  //para obtener la data de caracterizacion
  getData(id: any): Observable<any> {
   
    let caracterizacion = `${this.apiURL}/api/Usuario/caracterizacion/${id}`
    return this.http.get<any>(caracterizacion, id)
  }

  //para guardar caracterizacion en la BD
  saveData(request: any): Observable<any> {
    let caracterizacion = `${this.apiURL}/api/Usuario/caracterizacion/respuesta`
    return this.http.post<any>(caracterizacion, request)
  }
  
}
  

