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
    let direccion = `${this.apiURL}/api/Validaciones/EnviarEmail?correo=${request}`
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
    let norma = `${this.apiURL}/api/Caracterizacion/SelectorDeNorma?id=${idCategoria}`
    return this.http.get<any>(norma, idCategoria)
  }

  validateCaracterizacion(idUsuario:any): Observable<string> {
    let validate = `${this.apiURL}/api/Validaciones/UsuarioCaracterizacion/${idUsuario}`
    let response = this.http.get<string>(validate);
    return response;
  }

  //para obtener la data de caracterizacion
  getData(): Observable<any> {
    const id = localStorage.getItem('Id');
    let caracterizacion = `${this.apiURL}/api/Caracterizacion/caracterizacion/${id}`
    return this.http.get<any>(caracterizacion)
  }

  //para guardar caracterizacion en la BD
  saveData(request: any): Observable<any[]> {
    const caracterizacion = `${this.apiURL}/api/Caracterizacion/caracterizacion/respuesta`;
    const categoriarnt = localStorage.getItem('norma');
    const observables = [];
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

  assignAdvisor(id: any): Observable<any> {
    let assign = `${this.apiURL}/api/Asesor/usuarioPstxAsesor/${id}`
    return this.http.get<any>(assign,id)
  }

  getDiagnostico(): Observable<any> {
    const idNorma = JSON.parse(window.localStorage.getItem('idNormaSelected')|| '[]');
    let diagnostico = `${this.apiURL}/api/Diagnostico/Diagnostico/${idNorma}`
    return this.http.get<any>(diagnostico)
  }

  saveDataDiagnostico(request: any): Observable<any[]> {
    const diagnostico = `${this.apiURL}/api/Diagnostico/Diagnosticorespuesta`;
    const observables = [];
  
    for (let i = 0; i < request.length; i++) {
      const respuesta = {
        valor: request[i].observacion.toString() + " - " + request[i].valor.toString(),
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

  saveModalDiagnostico(request: any): Observable<any[]> {
    debugger
    const modalDiagnostico = `${this.apiURL}/api/Asesor/RespuestaAsesor`;
    const observables = [];
  
    for (let i = 0; i < request.length; i++) {
      const respuesta = {
        fK_ID_NORMA: request[i].fK_ID_NORMA,
        fK_ID_USUARIO: request[i].fK_ID_USUARIO,
        fK_ID_ASESOR: request[i].fK_ID_ASESOR,
        respuestA_ANALISIS: request[i].respuestA_ANALISIS
      };
      const observable = this.http.post<any>(modalDiagnostico, respuesta);
      observables.push(observable);
    }
    return of(observables).pipe(mergeMap(responses => forkJoin(responses)));
  }

  //enlista el asesor
  addAsesor(): Observable<any> {
    let assign = `${this.apiURL}/api/Asesor/ListarAsesor`
    return this.http.get<any>(assign)
  }
 
  updateAsesor(resquest): Observable<any> {
    let assign = `${this.apiURL}/api/Asesor/registrarPSTxAsesor`
    return this.http.post<any>(assign,resquest)
  }

  //crea un nuevo asesor
  createNewAsesor(request): Observable<any> {
    let assign = `${this.apiURL}/api/Asesor/Asesor`
    return this.http.post<any>(assign,request)
  }

  getListaChequeoApi(){
    const normaValue = window.localStorage.getItem('idNormaSelected');
    const idUsuario = window.localStorage.getItem('Id');
    
    // const id = localStorage.getItem('Id');
    // const normaValue = JSON.parse(window.localStorage.getItem('norma'));
    // const idn = normaValue[0].id;
    let lista = `${this.apiURL}/api/ListaChequeo/ListaChequeo?idnorma=${normaValue}&idusuariopst=${idUsuario}` 
    return this.http.get<any>(lista)
  }

  getListaDiagnosticoApi(){
    const normaValue = window.localStorage.getItem('idNormaSelected');
    const idUsuario = window.localStorage.getItem('Id');
    // const id = localStorage.getItem('Id');
    // const normaValue = JSON.parse(window.localStorage.getItem('norma'));
    // const idn = normaValue[0].id;
    let lista = `${this.apiURL}/api/ListaChequeo/ListaDiagnostico?idnorma=${normaValue}&idusuariopst=${idUsuario}` 
    return this.http.get<any>(lista)
  }

  getPlanMejoraApi(){
    const normaValue = window.localStorage.getItem('idNormaSelected');
    const idUsuario = window.localStorage.getItem('Id');
    // const id = localStorage.getItem('Id');
    // const normaValue = JSON.parse(window.localStorage.getItem('norma'));
    // const idn = normaValue[0].id;
    let lista = `${this.apiURL}/api/PlanMejora/PlanMejora?idnorma=${normaValue}&idusuariopst=${idUsuario}` 
    return this.http.get<any>(lista)
  }

  getOrdenCaracterizacion(){
    // const normaValue = JSON.parse(window.localStorage.getItem('idCategoria'));
    const normaValue = localStorage.getItem('idCategoria');
    let lista = `${this.apiURL}/api/Caracterizacion/OrdenCaracterizacion?id=${normaValue}`
    return this.http.get<any>(lista)
  }

  //Matriz de Requisitos Legales
  getLeyes(){
    let lista = `${this.apiURL}/api/MatrizLegal/MatrizLegal?IdDoc=1`
    return this.http.get<any>(lista)
  }

}