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
  sendEmailRecovery(request: any): Observable<any> {
    debugger
    let direccion = `${this.apiURL}/api/Usuario/EnviarEmail?correo=${request}`
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
  getData(): Observable<any> {
    debugger
    const id = localStorage.getItem('Id');
    let caracterizacion = `${this.apiURL}/api/Usuario/caracterizacion/${id}`
    return this.http.get<any>(caracterizacion)
  }

  //para guardar caracterizacion en la BD
  /*saveData(request: any): Observable<any> {
    debugger
    let caracterizacion = `${this.apiURL}/api/Usuario/caracterizacion/respuesta`
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
  
    for (let i = 0; i < request.length; i++) {
      debugger
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

  assignAdvisor(id: any): Observable<any> {
    let assign = `${this.apiURL}/api/Usuario/usuarioPstxAsesor/${id}`
    return this.http.get<any>(assign,id)
  }

  getDiagnostico(): Observable<any> {
    const id = localStorage.getItem('id');
    let diagnostico = `${this.apiURL}/api/Usuario/Diagnostico/${id}`
    return this.http.get<any>(diagnostico)
  }

  saveDataDiagnostico(request: any): Observable<any[]> {
    const diagnostico = `${this.apiURL}/api/Usuario/Diagnosticorespuesta`;
    const categoriarnt = localStorage.getItem('id');
    const observables = [];
  
    for (let i = 0; i < request.length; i++) {
      const respuesta = {
        valor: request[i].valor.toString(),
        idnormatecnica: request[i].idnormatecnica,
        idusuario: request[i].idusuario,
        numeralprincipal: request[i].numeralprincipal.toString(),
        numeralespecifico: request[i].numeralespecifico.toString()
      };
      const observable = this.http.post<any>(diagnostico, respuesta);
      observables.push(observable);
    }
    return of(observables).pipe(mergeMap(responses => forkJoin(responses)));

  }

  addAsesor(): Observable<any> {
    //console.log("entro al add asesor")
    let assign = `${this.apiURL}/api/Usuario/ListarAsesor`
    return this.http.get<any>(assign)
  }
 
  updateAsesor(resquest): Observable<any> {
    //console.log("entro al add asesor")
    let assign = `${this.apiURL}/api/Usuario/registrarPSTxAsesor`
    return this.http.post<any>(assign,resquest)
  }
  getListaChequeoApi(){
    // const id = localStorage.getItem('id');
    // let diagnostico = `${this.apiURL}/api/Usuario/Diagnostico/${id}`
    // return this.http.get<any>(diagnostico)
  }
  getListaDiagnosticoApi(){
    const id = localStorage.getItem('id');
    const normaValue = JSON.parse(window.localStorage.getItem('norma'));
    const idn = normaValue[0].id;
    let ListaDiagnostico = `${this.apiURL}/api/Usuario/ListaDiagnostico?idnorma=${idn}&idusuariopst=${id}` 
    return this.http.get<any>(ListaDiagnostico)
  }
}

  

