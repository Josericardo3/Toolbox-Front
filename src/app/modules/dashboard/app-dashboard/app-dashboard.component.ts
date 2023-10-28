import { Component, Injectable, NgModule, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { selectFeatureCount } from '../../../state/selectors/items.selectors'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromRoot from 'src/app/state/reducer/example.reducer'
import { AppState } from 'src/app/state/selectors/app.state'
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { ApiService } from 'src/app/servicios/api/api.service';
import { debounce } from 'lodash'
import { IndicadorService } from '../../../servicios/kpis/indicador.service';
import { ColorLista } from 'src/app/servicios/api/models/color'


@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css'],
})
export class AppDashboardComponent implements OnInit {
  //PG counter$: Observable<any>;
  public showModal: boolean = false;
  datos: any = [];
  datosTarjeta: any = [];
  nombre: any;
  arrNormas = JSON.parse(localStorage.getItem('norma') || '[]');
  normaSelected = localStorage.getItem("normaSelected");
  userRol = localStorage.getItem('rol');
  newUser = localStorage.getItem("newUser");
  idUser = localStorage.getItem("Id");
  normaValue = Number(window.localStorage.getItem('idNormaSelected'));
  //idNorma = this.arrNormas[0].ID_NORMA;
  validateCaracterizacion = this.ApiService.validateCaracterizacion(this.idUser);
  validateDiagnostico = this.ApiService.validateDiagnostico(this.normaValue);
  rolList = [
    {
      // colaborador
      rol: '1',
      view: ['caracterizacion', 'diagnostico', 'documentacion', 'noticias', 'planificacion', 'formacion'],
    },
    {
      rol: 'ADMIN',
      view: ['planificacion'],
    },
  ]
  idNoticia!: number;
  idActividad!: number;
  dato!: string;
  existingRoutes: string[] = [];
  dataReminder: any = [];
  showActividad: boolean = false;
  datosTarjetaActividad: any[] = [];
  datosTarjetaNoticia: any[] = [];
  showimagen: any;
  colorWallpaper:ColorLista;
  result: boolean = false;
  resultNoticia: boolean = false;
  
  //Permisos
  AccesoCaracterizacion : boolean = true; 
  AccesoDiagnostico : boolean = true; 
  AccesoPlanificacion: boolean = true; 
  AccesoDocumentacion : boolean = true; 
  AccesoELearning: boolean = true; 
  AccesoNoticias : boolean = true; 
  AccesoAuditoria: boolean = true; 
  AccesoEvidencia : boolean = true; 
  AccesoGerencia : boolean = true; 
  AccesoKpi : boolean = true; 
  AccesoMejora : boolean = true; 
  AccesoMonitorizacion : boolean = true;
//indicadores
filter:any={ID_USUARIO:localStorage.getItem('Id')}
resultInicadores: boolean = false;
listaIndicadores:any=[];
  constructor(
    //PG private store: Store<{ initialState:any }>,
    private router: Router,
    private Message: ModalService,
    private ApiService: ApiService,
    private IndicadorService:IndicadorService,
  ) {//PG this.counter$= store.select('initialState')
  }
  normaDiadnostico: any = {};
  applyStyle: boolean = false;
  adminTes: boolean = false;
  pst:boolean=false; 
  ngOnInit(): void {
    if (localStorage.getItem('rol') == "4" || 4 ||"3"|| 3) {
      this.applyStyle = true;
      this.adminTes  = true; 

      }
      
    this.ApiService.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.ApiService.getUsuarioPermisoPerfil(this.userRol).subscribe(dataPermiso => {

      if(dataPermiso[0].PLANIFICACION_DIAGNOSTICO === "x"){
        this.AccesoPlanificacion = false;
      }
      if(dataPermiso[0].EVIDENCIA_IMPLEMENTACION === "x"){
        this.AccesoEvidencia = false;
      }
      if(dataPermiso[0].FORMACION_ELEARNING === "x"){
        this.AccesoELearning = false;
      }
      if(dataPermiso[0].NOTICIAS === "x"){
        this.AccesoNoticias = false;
      }
      if(dataPermiso[0].DOCUMENTACION === "x"){
        this.AccesoDocumentacion = false;
      }
      if(dataPermiso[0].ALTA_GERENCIA === "x"){
        this.AccesoGerencia = false;
      }
      if(dataPermiso[0].MEDICION_KPIS === "x"){
        this.AccesoKpi = false;
      }
      if(dataPermiso[0].AUDITORIA_INTERNA === "x"){
        this.AccesoAuditoria = false;
      }
      if(dataPermiso[0].MEJORA_CONTINUA === "x"){
        this.AccesoMejora = false;
      }
      if(dataPermiso[0].MONITORIZACION === "x"){
        this.AccesoMonitorizacion = false;
      }
      if(dataPermiso[0].CARACTERIZACION === "x"){
        this.AccesoCaracterizacion = false;
      }
      if(dataPermiso[0].DIAGNOSTICO === "x"){
        this.AccesoDiagnostico = false;
      }
    });
    this.showModal = false;
    this.existingRoutes = this.router.config.map(route => route.path);
    //borrar
    let arrNormas = JSON.parse(localStorage.getItem('norma') || '[]');
    this.validateDiagnostico.subscribe((data: any) =>
      this.normaDiadnostico = data);

 
    let normaSelected = localStorage.getItem("normaSelected");
    //prueba global selectFeatureCount
    // this.getNombreUsuario();
    this.getContenidoTarjeta();
    this.getRecordatorioIndicador();
  }

  mostrarNotificacion : boolean = false;
  isCollapsed = true;

  etapaShowInicio: boolean = false;
  etapaShowIntermedio: boolean = false;
  etapaShowFinal: boolean = false;
  disabledBtn: boolean = false;
  bloquearIntermedio: boolean =false;
  bloquearFinal: boolean =false;
  fnShowModal() {
    this.validateCaracterizacion.subscribe((data) => {
      if (!data) {
        const title = "Aviso";
        const message = "Debe realizar el proceso de caracterización antes de continuar con el proceso de diagnostico"
        this.Message.showModal(title, message);
        return
      }else{
        this.showModal = true;
        if (this.normaDiadnostico.ETAPA_INICIO == false) {
          this.bloquearIntermedio = true;
          this.bloquearFinal = true;
        }
        if (this.normaDiadnostico.ETAPA_INICIO == true) {
          this.etapaShowInicio = true;
          this.bloquearIntermedio = false;
          this.bloquearFinal = true;
        }
        if (this.normaDiadnostico.ETAPA_INTERMEDIO == true) {
          this.etapaShowIntermedio = true;
          this.bloquearIntermedio = false;
          this.bloquearFinal = false;
        }
        if (this.normaDiadnostico.ETAPA_FINAL == true) {
          this.etapaShowFinal = true;
          this.bloquearIntermedio = false;
          this.bloquearFinal = false;
        }
      }
    });
 
  }

  fnEtapa(etapa: string) {
    if (etapa === "inicial") {
      localStorage.setItem("etapa", '1');
    }
    else if (etapa === "intermedia") {
      localStorage.setItem("etapa", '2');
    }
    else if (etapa === "final") {
      localStorage.setItem("etapa", '3');
    }
  
  }
  
  buscarRuta(ruta: string) {
    if (!this.existingRoutes.includes(ruta)) {
      return; // La ventana no existe en el enrutamiento, salir del método
    }
    this.router.navigate([ruta]);
  }

  getContenidoTarjeta() {
    this.ApiService.getTarjeta().subscribe(data => {
      this.datosTarjeta = data;

      for (let i = 0; i < this.datosTarjeta.length; i++) {
        if (this.datosTarjeta[i].Notificacion.TIPO == "Actividad") {
          this.showActividad = true;
          this.datosTarjetaActividad.push({
            descripcion: this.datosTarjeta[i].Notificacion.DESCRIPCION_ACTIVIDAD,
            fkIdActividad: this.datosTarjeta[i].Notificacion.FK_ID_ACTIVIDAD,
            dato: this.datosTarjeta[i].Notificacion.TIPO
          });
        }

        if (this.datosTarjeta[i].Notificacion.TIPO == "Noticia") {
          if (this.datosTarjeta[i].Notificacion.COD_IMAGEN != null || this.datosTarjeta[i].Notificacion.COD_IMAGEN != undefined) {
            this.showimagen = 'data:image/png;base64,' + this.datosTarjeta[i].Notificacion.COD_IMAGEN
          } else {
            this.showimagen = null
          }
          this.datosTarjetaNoticia.push({
            COD_IMAGEN: this.showimagen,
            DESCRIPCION_NOTICIA: this.datosTarjeta[i].Notificacion.DESCRIPCION_NOTICIA,
            TITULO_NOTICIA: this.datosTarjeta[i].Notificacion.TITULO_NOTICIA,
            NOMBRE_FIRMA: this.datosTarjeta[i].Notificacion.NOMBRE_FIRMA,
            FK_ID_NOTICIA: this.datosTarjeta[i].Notificacion.FK_ID_NOTICIA,
            dato: this.datosTarjeta[i].Notificacion.TIPO
          })
        }
      }

      if (this.datosTarjetaNoticia.length == 0 || this.datosTarjetaNoticia.length <= 0) {
        this.resultNoticia = true;
      }
      if (this.datosTarjetaActividad.length == 0 || this.datosTarjetaActividad.length <= 0) {
        this.result = true;
      }
    });

  }
  getRecordatorioIndicador(){
    this.IndicadorService.obtnerRecordatorioNoticia(this.filter).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.listaIndicadores=x.Data;
          if(x.Total>0){
            this.resultInicadores=true;
          }else{
            this.resultInicadores=false;
          }
        } else {
          this.resultInicadores=false;
        }
      },
      error: (e) => {
        this.resultInicadores=false;
      },
    });
  }

  validateRol(evt: any) {
    const menuResult = this.rolList.map(
      (menuItem) =>
        menuItem.rol === this.userRol && menuItem.view.includes(evt.target.id),
    )
    return menuResult[0];
  }

  changeSelected(evt: any) {
    localStorage.setItem("idNormaSelected", evt.target.options[evt.target.selectedIndex].id);
    localStorage.setItem("normaSelected", evt.target.value);
    this.normaSelected = evt.target.value;
  }

  menuFilter(evt: any) { //redireccionar
    if (this.validateRol(evt)) {// condicional cuando sí tiene acceso
      evt.target.src = '../../../../assets/img-dashboard/' + evt.target.id + '-3.svg';
      switch (evt.target.id) {
        case 'caracterizacion':
          this.validateCaracterizacion.subscribe((data) => {
            if (data) {
              this.router.navigate(['/dashboard']);
              const title = "Aviso";
              const message = "Usted ya ha realizado el proceso de caracterización, si desea modificarlo, por favor comuníquese con el administrador del sistema."
              this.Message.showModal(title, message);
              return
            } else {
              const request = {
                FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
                TIPO: "Modulo",
                MODULO: evt.target.id
              };
              this.ApiService.postMonitorizacionUsuario(request).subscribe();

              this.router.navigate(['/' + evt.target.id]);
            }
          });
          break;
        case 'diagnostico':
          this.validateCaracterizacion.subscribe((data) => {
            if (!data) {
              const title = "Aviso";
              const message = "Debe realizar el proceso de caracterización antes de continuar con el proceso de diagnostico"
              this.Message.showModal(title, message);
              return
            } else {
              this.validateDiagnostico.subscribe((data) => {
                if (data) {
                  const request = {
                    FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
                    TIPO: "Modulo",
                    MODULO: "diagnosticoDoc"
                  };
                  this.ApiService.postMonitorizacionUsuario(request).subscribe();

                  this.router.navigate(['/diagnosticoDoc']);
                  return
                } else {
                  const request = {
                    FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
                    TIPO: "Modulo",
                    MODULO: evt.target.id
                  };
                  this.ApiService.postMonitorizacionUsuario(request).subscribe();
                  this.router.navigate(['/' + evt.target.id]);
                }
              });
            }
          });


          break;
        default: const request = {
          FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
          TIPO: "Modulo",
          MODULO: evt.target.id
        };
          this.ApiService.postMonitorizacionUsuario(request).subscribe();
          this.router.navigate(['/' + evt.target.id]);
          break;
      }
    }
  }

  mouseOver(evt: any) {
    if (this.validateRol(evt)) {
      evt.target.src = '../../../../assets/img-dashboard/' + evt.target.id + '-3.svg';
      const p = document.getElementById('p-' + evt.target.id);
      if (p) {
        p.style.color = "#068460";
      }
    }
  }

  mouseOut(evt: any) {
    if (this.validateRol(evt)) {
      evt.target.src = '../../../../assets/img-dashboard/' + evt.target.id + '.svg';
      const p = document.getElementById('p-' + evt.target.id);
      if (p) {
        p.style.color = "#999999";
      }
    }
  }

  Logo() {
    const url = 'https://www.gov.co/home'
    window.location.href = url;
  }

  //prueba para auditoria
  redirigirAuditoria() {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "listaDeVerificacion"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe();
    this.router.navigate(['/listaDeVerificacion']);
  }

  indexCard(index: any, dato: string) {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "noticia"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe();
    this.idNoticia = index;
    this.dato = dato;
    this.router.navigate(['/noticia'], { state: { idNoticia: this.idNoticia, dato: dato } });
  }

  getActivities() {
    this.ApiService.getActivities()
      .subscribe(data => {
        this.dataReminder = data;
      })
  }

  indexReminder(index: number, dato: string) {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "planificacion"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe();
    this.router.navigate(['/planificacion'], { state: { idActividad: index, dato: dato } });
  }
  indexReminderIndicador() {
    
    this.router.navigate(['/evaluaciones']);
  }
  getRolValue(): number {
    // Obtener el valor del rol almacenado en el Local Storage
    const rol = localStorage.getItem('rol');

    // Verificar si el rol existe y es un número válido
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }

    // Valor predeterminado si no se encuentra el rol o no es un número válido
    return 0;
  }
  redirigirAUrlExterna() {
    const urlExterna = 'https://starlit-lollipop-776b18.netlify.app';
    window.location.href = urlExterna;
  }
}
