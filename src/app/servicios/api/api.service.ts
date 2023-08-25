import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import  {of, forkJoin, Observable } from 'rxjs'
import { environment } from 'src/environments/environment.prod'
import { LoginI } from '../../models/loginInterface'
import { ResponseI } from '../../models/responseInterface'
import { mergeMap } from 'rxjs/operators';
import { debug } from 'console'
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
  apiURLNuevo = environment.apiURLNuevo
  apiCHART = environment.apiChart
  constructor(private http: HttpClient) {}

  login(form: LoginI): Observable<ResponseI> {
    const { registroNacionalDeTurismo, pass, correo } = form
    const refresh = localStorage.getItem('refresh');
    const headers = { 'Content-Type': 'application/json', 'tokenAccess': refresh || 'falta token' };
    let direccion = `${this.apiURLNuevo}/api/Usuario/LoginUsuario?usuario=${registroNacionalDeTurismo}&Password=${pass}&Correo=${correo}`
    return this.http.post<any>(
      direccion, 
      {observe: "response"}
      // { registroNacionalDeTurismo, pass },
      // {headers}
      )
  }
  
  createUser(request: any): Observable<any> {
    let direccion = `${this.apiURLNuevo}/api/Usuario`
    return this.http.post<any>(direccion, request)
  }

  sendEmailRecovery(request: any): Observable<any> {
    let direccion = `${this.apiURLNuevo}/api/Validaciones/EnviarEmail?correo=${request}`
    return this.http.post<any>(direccion, request)
  }

  refreshToken(token:string){
    return this.http.post(this.apiURLNuevo + 'refreshtoken', {
      refreshToken: token
    }, httpOptions);
  }

  getUser(idUsuario: any): Observable<any> {
    let direccion = `${this.apiURLNuevo}/api/Usuario/${idUsuario}`
    return this.http.get<any>(direccion, idUsuario)
  }
  getUserAvatar(idUsuario: any): Observable<any> {
    let direccion = `${this.apiURLNuevo}/api/Usuario/${idUsuario}`
    return this.http.get<any>(direccion, idUsuario)
  }

  getNorma(idCategoria:any){
    let norma = `${this.apiURLNuevo}/api/Caracterizacion/SelectorDeNorma?id=${idCategoria}`
    return this.http.get<any>(norma, idCategoria)
  }

  validateCaracterizacion(idUsuario:any): Observable<string> {
    let validate = `${this.apiURLNuevo}/api/Validaciones/UsuarioCaracterizacion/${idUsuario}`
    let response = this.http.get<string>(validate);
    return response;
  }
  validateRnt(rnt: string): Observable<string> {
    let validate = `${this.apiURLNuevo}/api/Validaciones/UsuarioRnt/${rnt}`
    let response = this.http.get<string>(validate);
    return response;
  }
  validateEmail(correo: string): Observable<string> {
    let validate = `${this.apiURLNuevo}/api/Validaciones/Correo/${correo}`
    let response = this.http.get<string>(validate);
    return response;
  }
  validatePhone(phone: string): Observable<string> {
    let validate = `${this.apiURLNuevo}/api/Validaciones/Telefono/${phone}`
    let response = this.http.get<string>(validate);
    return response;
  }

  validateDiagnostico(idNorma:any): Observable<string> {
    const idUsuario = localStorage.getItem("Id");
    let validate = `${this.apiURLNuevo}/api/Validaciones/UsuarioDiagnostico?idUsuario=${idUsuario}&idNorma=${idNorma}`
    let response = this.http.get<string>(validate);
    return response;
  }


  //para obtener la data de caracterizacion
  getData(): Observable<any> {
    const id = localStorage.getItem('Id');
    let caracterizacion = `${this.apiURLNuevo}/api/Caracterizacion/caracterizacion/${id}`
    return this.http.get<any>(caracterizacion)
  }

  //para guardar caracterizacion en la BD
  saveData(request: any): Observable<any[]> {
    const caracterizacion = `${this.apiURLNuevo}/api/Caracterizacion/caracterizacion/respuesta`;
    const categoriarnt = localStorage.getItem('norma');
    const observables = [];
    for (let i = 0; i < request.length; i++) {
      const respuesta = {
        VALOR: request[i].valor.toString(),
        FK_ID_USUARIO: request[i].idUsuarioPst,
        FK_ID_CATEGORIA_RNT: request[i].idCategoriaRnt,
        FK_ID_CARACTERIZACION_DINAMICA: request[i].idCaracterizacion
      };
      observables.push(respuesta);
    }  
    return this.http.post<any>(caracterizacion,observables)
  }

  assignAdvisor(id: any): Observable<any> {
    let assign = `${this.apiURLNuevo}/api/Asesor/usuarioPstxAsesor/${id}`
    return this.http.get<any>(assign,id)
  }

  getDiagnostico(): Observable<any> {
    const idNorma = JSON.parse(window.localStorage.getItem('idNormaSelected') || '[]');
    let diagnostico = `${this.apiURLNuevo}/api/Diagnostico/Diagnostico/${idNorma}`
    return this.http.get<any>(diagnostico)
  }

  saveDataDiagnostico(request: any): Observable<any[]> {
    const diagnostico = `${this.apiURLNuevo}/api/Diagnostico/Diagnosticorespuesta`;
    const observables = [];
  
    for (let i = 0; i < request.length; i++) {
      const respuesta = {
        VALOR: request[i].observacion.toString() + " - " + request[i].valor.toString(),
        FK_ID_NORMA: request[i].idnormatecnica,
        FK_ID_USUARIO: request[i].idusuario,
        NUMERAL_PRINCIPAL: request[i].numeralprincipal.toString(),
        NUMERAL_ESPECIFICO: request[i].numeralespecifico.toString()
      };
      observables.push(respuesta);
    }
    return this.http.post<any>(diagnostico,observables)
  }

  //enlista el asesor
  addAsesor(): Observable<any> {
    let assign = `${this.apiURLNuevo}/api/Asesor/ListarAsesor`
    return this.http.get<any>(assign)
  }
 
  updateAsesor(resquest): Observable<any> {
    let assign = `${this.apiURLNuevo}/api/Asesor/registrarPSTxAsesor`
    return this.http.post<any>(assign,resquest)
  }

  //crea un nuevo asesor
  createNewAsesor(request): Observable<any> {
    let assign = `${this.apiURLNuevo}/api/Asesor/Asesor`
    return this.http.post<any>(assign,request)
  }
  getGrafico(request) {
    const apiUrl = `${this.apiCHART}`;
    return this.http.post(apiUrl, {
      backgroundColor: "#fff",
      width: 500,
      height: 300,
      devicePixelRatio: 1.0,
      chart: request
    }, {
      responseType: 'blob'
    });
  }
  
  getListaChequeoApi(){
    const normaValue = window.localStorage.getItem('idNormaSelected');
    const idUsuario = window.localStorage.getItem('Id');
    const etapa = Number(window.localStorage.getItem('etapa'));
 
    let lista = `${this.apiURLNuevo}/api/ListaChequeo/ListaChequeo?idnorma=${normaValue}&idusuariopst=${idUsuario}&etapa=${etapa}` 
    return this.http.get<any>(lista)
  }

  getListaDiagnosticoApi(){
  
    const normaValue = Number(window.localStorage.getItem('idNormaSelected'));
    const idUsuario = Number(window.localStorage.getItem('Id'));
    const etapa = Number(window.localStorage.getItem('etapa'));
  
    let lista = `${this.apiURLNuevo}/api/ListaChequeo/ListaDiagnostico?idnorma=${normaValue}&idusuariopst=${idUsuario}&etapa=${etapa}`
    return this.http.get<any>(lista)
  }

  getPlanMejoraApi(){
    var normaValue = window.localStorage.getItem('idNormaSelected');
    var idUsuario = window.localStorage.getItem('Id');
    const etapa = Number(window.localStorage.getItem('etapa'));
    // const id = localStorage.getItem('Id');
    // const normaValue = JSON.parse(window.localStorage.getItem('norma'));
    // const idn = normaValue[0].id;
    let lista = `${this.apiURLNuevo}/api/PlanMejora/PlanMejora?idnorma=${normaValue}&idusuariopst=${idUsuario}&etapa=${etapa}` 
    return this.http.get<any>(lista)
  }

  getOrdenCaracterizacion(){
    // const normaValue = JSON.parse(window.localStorage.getItem('idCategoria'));
    const normaValue = localStorage.getItem('idCategoria');
    let lista = `${this.apiURLNuevo}/api/Caracterizacion/OrdenCaracterizacion?id=${normaValue}`
    return this.http.get<any>(lista)
  }

  //Matriz de Requisitos Legales
  getLeyes(){
    const id = localStorage.getItem('Id');
    let lista = `${this.apiURLNuevo}/api/MatrizLegal/MatrizLegal?IdDoc=1&IdUsuario=${id}`
    return this.http.get<any>(lista)
  }

  saveLey(request: any){
    const ley = `${this.apiURLNuevo}/api/MatrizLegal/RespuestaMatrizLegal`;
    return this.http.post<any>(ley, request)
  }

  gertArchivoMatriz(){
    const id = localStorage.getItem('Id');
    let lista = `${this.apiURLNuevo}/api/MatrizLegal/ArchivoMatrizLegal?IdDocumento=1&idUsuario=${id}`
    return this.http.get<any>(lista)
  }

  getUsuario(){
    const id = localStorage.getItem('Id');
    let direccion = `${this.apiURLNuevo}/api/Usuario/${id}`
    return this.http.get<any>(direccion)
  }

  //PARA LAS NOTICIAS
  getNotifications(){
    const id = localStorage.getItem("Id");
    let lista = `${this.apiURLNuevo}/api/Noticia/notificacionesusuario/${id}`
    return this.http.get<any>(lista)
  }
  
  getTablaNoticias() {
    const rnt = localStorage.getItem('rnt');
    let direccion = `${this.apiURLNuevo}/api/Noticia/noticia?Rnt=${rnt}`
    return this.http.get<any>(direccion)
  }

  saveNoticia(request: any) {
    const modalNoticia= `${this.apiURLNuevo}/api/Noticia/noticia`;
    return this.http.post<any>(modalNoticia, request)
  }

  saveNoticiaEditar(request: any) {
    const modalNoticiaEditar = `${this.apiURLNuevo}/api/Noticia/noticia`;
    return this.http.put<any>(modalNoticiaEditar, request)
  }

  deleteNoticia(id: any) {
    const assign = `${this.apiURLNuevo}/api/Noticia/noticia?id=${id}`
    return this.http.delete<any>(assign)
  }

  getPSTSelect(){
    let direccion = `${this.apiURLNuevo}/api/General/ListarPst`
    return this.http.get<any>(direccion)
  }

  getNormaSelect(){
    let direccion = `${this.apiURLNuevo}/api/General/GetNormas`
    return this.http.get<any>(direccion)
  }

  getCategoriaSelect(){
    let direccion = `${this.apiURLNuevo}/api/General/ListarCategorias`
    return this.http.get<any>(direccion)
  }

  getNoticiaCompleta(idNoticia: any){
    let direccion = `${this.apiURLNuevo}/api/Noticia/noticia/${idNoticia}`
    return this.http.get<any>(direccion)
  }
  
  getHistorial(){
    const id = localStorage.getItem('Id');
    let direccion = `${this.apiURLNuevo}/api/Noticia/historialnotificaciones/${id}`
    return this.http.get<any>(direccion)
  }

  //NOTIFICACIONES
  getTarjeta(){
    const id = localStorage.getItem('Id');
    let direccion = `${this.apiURLNuevo}/api/Noticia/notificacionesusuario/${id}`
    return this.http.get<any>(direccion)
  }
  // obtener el listado de asesores
  getAuditorListService(){
    const rnt = localStorage.getItem('rnt');
    let endpointListAuditor = `${this.apiURLNuevo}/api/Auditoria/ListarAuditor/${rnt}` 
    return this.http.get<any>(endpointListAuditor)
  }

  // para obtener el codigo de la auditoria a registrar

  // getCodeAuditorService(request){
  //   let endpointCode =`${this.apiURL}/api/Auditoria/InsertAuditoria` ;
  //   return this.http.post<any>(endpointCode,request)
  // }

  //insertar Auditoria
  // insertAuditoria(resquest){
  //   let assign = `${this.apiURL}/api/Auditoria/InsertAuditoria`
  //   return this.http.post<any>(assign,resquest)
  // }
   insertAuditoria(resquest){
    let assign = `${this.apiURLNuevo}/api/Auditoria/InsertPlanAuditoria`
    return this.http.post<any>(assign,resquest)
  }
  getListarAuditorias(id: any){
    let endpointListAuditor = `${this.apiURLNuevo}/api/Auditoria/ListarAuditorias/${id}` 
    return this.http.get<any>(endpointListAuditor,id)
  }

  getAuditor(id: any){
    let endpointListAuditor = `${this.apiURLNuevo}/api/Auditoria/Auditoria/${id}` 
    return this.http.get<any>(endpointListAuditor)
  }

  //obtener el usuario 15; para segunda tabla y 3ra
  getAuditorias(id: any){
    let endpointListAuditor = `${this.apiURLNuevo}/api/Auditoria/Auditoria/${id}` 
    return this.http.get<any>(endpointListAuditor,id)
  }

  updateAuditoria(resquest){
    let assign = `${this.apiURLNuevo}/api/Auditoria/UpdateVerificacionAuditoria`
    return this.http.put<any>(assign,resquest)
  }

  updateInformeAuditoria(resquest){
    let assign = `${this.apiURLNuevo}/api/Auditoria/UpdateInformeAuditoria`
    return this.http.put<any>(assign,resquest)
  }
  deleteRequisitoAuditoria(id: any){
    let assign = `${this.apiURLNuevo}/api/Auditoria/RequisitoAuditoria?idrequisito=${id}`
    return this.http.delete<any>(assign)
  }
   ///ACTIVIDADES (VISTA DE PLANIFICACIÓN)
   getActivities(){
    const id = localStorage.getItem("Id");
    let lista = `${this.apiURLNuevo}/api/Actividad/actividades?idUsuarioPst=${id}`
    return this.http.get<any>(lista)
  }
  getActivitiesCompleta(idActividad: any){
    let direccion = `${this.apiURLNuevo}/api/Actividad/actividades/${idActividad}`
    return this.http.get<any>(direccion)
  }
  getListResponsible(){
    const rnt = localStorage.getItem('rnt');
    let lista = `${this.apiURLNuevo}/api/Actividad/ListarResponsables/${rnt}`
    return this.http.get<any>(lista)
  }
  getTypeList(idtabla :any){
    let lista = `${this.apiURLNuevo}/api/General/ListarMaestros/${idtabla}`
    return this.http.get<any>(lista)
  }
  postNewRecord(request: any){
    let assign = `${this.apiURLNuevo}/api/Actividad/actividades`
    return this.http.post<any>(assign,request)
  }
 
  deleteActivities(id: any){
    let assign = `${this.apiURLNuevo}/api/Actividad/actividades?id=${id}`
    return this.http.delete<any>(assign)
  }
  putActivities(request: any){
    let assign = `${this.apiURLNuevo}/api/Actividad/actividades`
    return this.http.put<any>(assign,request)
  }
  getUsersRoles(request: any){
    let assign = `${this.apiURLNuevo}/api/Usuario/usuarioRoles`
    return this.http.post<any>(assign,request)
  }
  postRegisterColaborador(request: any){
    let assign = `${this.apiURLNuevo}/api/Usuario/registrarEmpleadoPst?id=${request.idUsuario}&nombre=${request.nombre}&idcargo=${request.idcargo}&correo=${request.correo}`
    return this.http.post<any>(assign,null)
  }
  putAvatar(request: any){
    const idUsuarioPst = window.localStorage.getItem('Id');
    let lista = `${this.apiURLNuevo}/api/Actividad/Avatar?idusuariopst=${idUsuarioPst}&idavatar=${request}`
    return this.http.put<any>(lista,request)
  }
  putLogo(request: any){
    const send = {
      ID_USUARIO: window.localStorage.getItem('Id'),
      LOGO: request
    }
    let lista = `${this.apiURLNuevo}/api/Actividad/Logo`
    return this.http.put<any>(lista,send)
  }

  //FORMULARIOS DE EVIDENCIA
  saveForms(request: any){
    const form = `${this.apiURLNuevo}/api/Formulario`;
    return this.http.post<any>(form, request)
  }
  getDataForm(idFormulario: number){
    const rnt = localStorage.getItem('rnt');
    const idUsuarioPst = window.localStorage.getItem('Id');
    let direccion = `${this.apiURLNuevo}/api/Formulario?ID_FORMULARIO=${idFormulario}&RNT=${rnt}&ID_USUARIO=${idUsuarioPst}`
    return this.http.get<any>(direccion)
  }
  
  getForms(){
    const rnt = localStorage.getItem('rnt');
    const idUsuarioPst = window.localStorage.getItem('Id');
    let direccion = `${this.apiURLNuevo}/api/Formulario?ID_FORMULARIO=1&RNT=${rnt}&ID_USUARIO=${idUsuarioPst}`
    return this.http.get<any>(direccion)
  }
  deleteForm(idRespuestaformulario){ 
      let assign = `${this.apiURLNuevo}/api/Formulario?idRespuestaformulario=${idRespuestaformulario}`
      return this.http.delete<any>(assign)
  }
  
  //actualizar formulario
  getFormsParteInteresada(){
    const rnt = localStorage.getItem('rnt');
    const idUsuarioPst = window.localStorage.getItem('Id');
    let direccion = `${this.apiURLNuevo}/api/Formulario?ID_FORMULARIO=2&RNT=${rnt}&ID_USUARIO=${idUsuarioPst}`
    return this.http.get<any>(direccion)
  }
  postMonitorizacionUsuario(request: any){
    const direccion = `${this.apiURLNuevo}/api/General/MonitorizacionUsuario`;
    return this.http.post<any>(direccion, request)
  }

  //MONITORIZACIÓN

  getMonitorizacion( ){
    let lista = `${this.apiURLNuevo}/api/Monitorizacion/MonitorizacionIndicador`
    return this.http.get<any>(lista)
  }

    UpdateAuditoriaEstadoTerminado(id: any){
    let assign = `${this.apiURLNuevo}/api/Auditoria/UpdateEstadoTerminadoAuditoria?idAuditoria=${id}`
    return this.http.put<any>(assign,id)
  }
  ValidateRntMincit(rnt:any): Observable<string> {
    let validate = `${this.apiURLNuevo}/api/Validaciones/ObtenerDataMincit?RNT=${rnt}`
    let response = this.http.get<string>(validate);
    return response;
  }
}
