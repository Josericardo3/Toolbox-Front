import { Component, Injectable, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { selectFeatureCount } from '../../../state/selectors/items.selectors'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromRoot from 'src/app/state/reducer/example.reducer'
import { AppState } from 'src/app/state/selectors/app.state'
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { ApiService } from 'src/app/servicios/api/api.service';
import { log } from 'console'

//@Injectable()

@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css'],
})
export class AppDashboardComponent implements OnInit {
  //PG counter$: Observable<any>;
  datos: any = [];
  datosTarjeta: any = [];
  nombre: any;
  arrNormas = JSON.parse(localStorage.getItem('norma') || '[]');
  normaSelected = localStorage.getItem("normaSelected");
  userRol = localStorage.getItem('rol');
  newUser = localStorage.getItem("newUser");
  idUser = localStorage.getItem("Id");
  validateCaracterizacion = this.ApiService.validateCaracterizacion(this.idUser);
  validateDiagnostico = this.ApiService.validateDiagnostico(this.idUser);
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
  dataReminder: any =[]; 
  showActividad: boolean = false;
  datosTarjetaActividad: any[] = [];
  datosTarjetaNoticia: any[] = [];
  showimagen: any; 

  constructor(
    //PG private store: Store<{ initialState:any }>,
    private router: Router,
    private Message: ModalService,
    private ApiService: ApiService,
  ) {//PG this.counter$= store.select('initialState')
  }

  ngOnInit(): void {
    this.existingRoutes = this.router.config.map(route => route.path);
    //borrar
    let arrNormas = JSON.parse(localStorage.getItem('norma') || '[]');
    let normaSelected = localStorage.getItem("normaSelected");
    //prueba global selectFeatureCount
    // this.getNombreUsuario();
    this.getContenidoTarjeta();
  }

  buscarRuta(ruta: string) {
    if (!this.existingRoutes.includes(ruta)) {
      return; // La ventana no existe en el enrutamiento, salir del método
    }
    this.router.navigate([ruta]);
  }

  result: boolean = false;
  resultNoticia: boolean = false;
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

      if(this.datosTarjetaNoticia.length == 0 ||this.datosTarjetaNoticia.length <= 0){
        this.resultNoticia= true; 
      }
      if(this.datosTarjetaActividad.length == 0 ||this.datosTarjetaActividad.length <= 0){
        this.result= true; 
      }
    });

  }

  validateRol(evt: any) {
    const menuResult = this.rolList.map(
      (menuItem) =>
        menuItem.rol === this.userRol && menuItem.view.includes(evt.target.alt),
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
      evt.target.src = '../../../../assets/img-dashboard/' + evt.target.alt + '-3.svg';
      switch (evt.target.alt) {
        case 'caracterizacion':
          this.validateCaracterizacion.subscribe((data) => {
            if (data) {
              const title = "Aviso";
              const message = "Usted ya ha realizado el proceso de caracterización, si desea modificarlo, por favor comuníquese con el administrador del sistema."
              this.Message.showModal(title, message);
              return
            } else {
              this.router.navigate(['/' + evt.target.alt]);
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
                  this.router.navigate(['/diagnosticoDoc']);
                  return
                } else {
                  this.router.navigate(['/' + evt.target.alt]);
                }
              });
            }
          });


          break;
        default: this.router.navigate(['/' + evt.target.alt]);
          break;
      }
    }
  }

  mouseOver(evt: any) {
    if (this.validateRol(evt)) {
      evt.target.src = '../../../../assets/img-dashboard/' + evt.target.alt + '-3.svg';
      const p = document.getElementById('p-' + evt.target.alt);
      if (p) {
        p.style.color = "#068460";
      }
    }
  }

  mouseOut(evt: any) {
    if (this.validateRol(evt)) {
      evt.target.src = '../../../../assets/img-dashboard/' + evt.target.alt + '.svg';
      const p = document.getElementById('p-' + evt.target.alt);
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
    this.router.navigate(['/listaDeVerificacion']);
  }

  indexCard(index: any, dato: string){
   this.idNoticia = index;
   this.dato= dato;
   this.router.navigate(['/noticia'],{ state: { idNoticia: this.idNoticia, dato: dato} });
  }

  getActivities(){
    this.ApiService.getActivities()
    .subscribe(data => {
      this.dataReminder = data;   
    }) 
  }

  indexReminder(index: number, dato: string) {
    this.router.navigate(['/planificacion'], { state: { idActividad: index, dato: dato } });
  }

}
