import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {of, forkJoin, Observable } from 'rxjs'
import { environment } from 'src/environments/environment.prod'
import { LoginI } from '../../models/loginInterface'
import { ResponseI } from '../../models/responseInterface'
import { mergeMap } from 'rxjs/operators';
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
<<<<<<< HEAD
    const { registroNacionalDeTurismo, pass, correo } = form
=======
    const { registroNacionalDeTurismo, pass,correo } = form
>>>>>>> dev/ctb-110
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
  /*saveData(request: any): Observable<any> {
    debugger
    let caracterizacion = `${this.apiURL}/api/Usuario/caracterizacion/respuesta`
<<<<<<< HEAD
    let categoriarnt = localStorage.getItem('norma')
    let response;
    for (let i = 0; i < request.length; i++) {
      var respuesta = {
        "valor": request[i].valor,
        "idUsuarioPst": request[i].idUsuarioPst,
        "idCategoriaRnt": request[i].idCategoriaRnt,
        "idCaracterizacion": request[i].idCaracterizacion
      }
      response = this.http.post<any>(caracterizacion, respuesta)}
    
  return response;
  }*/
  saveData(request: any): Observable<any[]> {
    const caracterizacion = `${this.apiURL}/api/Usuario/caracterizacion/respuesta`;
    const categoriarnt = localStorage.getItem('norma');
    const observables = [];
=======
    return this.http.post<any>(caracterizacion, request)
  }

  assignAdvisor(id: any): Observable<any> {
    let assign = `${this.apiURL}/api/Usuario/usuarioPstxAsesor/${id}`
    return this.http.get<any>(assign,id)
  }
>>>>>>> dev/ctb-110
  
    for (let i = 0; i < request.length; i++) {
      const respuesta = {
        valor: request[i].valor.toString(),
        idUsuarioPst: request[i].idUsuarioPst,
        idCategoriaRnt: request[i].idCategoriaRnt,
        idCaracterizacion: request[i].idCaracterizacion
      };
      const observable = this.http.post<any>(caracterizacion, respuesta);
      observables.push(observable);
    }
  
    return of(observables).pipe(mergeMap(responses => forkJoin(responses)));
  }
}
  

