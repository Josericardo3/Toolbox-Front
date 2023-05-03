import { Component, Injectable, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { selectFeatureCount } from '../../../state/selectors/items.selectors'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromRoot from 'src/app/state/reducer/example.reducer'
import { AppState } from 'src/app/state/selectors/app.state'
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service' 
import { ApiService } from 'src/app/servicios/api/api.service';

//@Injectable()

@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css'],
})
export class AppDashboardComponent implements OnInit {
  //PG counter$: Observable<any>;
  arrNormas = JSON.parse(localStorage.getItem('norma')||'[]');
  normaSelected = localStorage.getItem("normaSelected");
  userRol = localStorage.getItem('rol');
  newUser= localStorage.getItem("newUser");
  idUser = localStorage.getItem("Id");
  validateCaracterizacion = this.ApiService.validateCaracterizacion(this.idUser);
  validateDiagnostico = this.ApiService.validateDiagnostico(this.idUser);
  rolList = [
    {
      // colaborador
      rol: '1',
      view: ['caracterizacion','diagnostico', 'documentacion','noticias'],
    },
    {
      rol: 'ADMIN',
      view: ['planificacion'],
    },
  ]
  constructor(
    //PG private store: Store<{ initialState:any }>,
    private router: Router,
    private Message: ModalService,
    private ApiService: ApiService,
  ) {
 
    //PG this.counter$= store.select('initialState')
  }
  
  ngOnInit(): void {
    //borrar
    let arrNormas = JSON.parse(localStorage.getItem('norma')||'[]');
    let normaSelected = localStorage.getItem("normaSelected");
    //prueba global selectFeatureCount
  }

  validateRol(evt: any){
    const menuResult = this.rolList.map(
      (menuItem) =>
        menuItem.rol === this.userRol && menuItem.view.includes(evt.target.alt),
    )
    return menuResult[0];
  }
  changeSelected(evt: any){
    localStorage.setItem("idNormaSelected",evt.target.options[evt.target.selectedIndex].id);
    localStorage.setItem("normaSelected",evt.target.value);
    this.normaSelected = evt.target.value;
  }
  menuFilter(evt: any) { //redireccionar
    debugger
      if (this.validateRol(evt)) {// condicional cuando sí tiene acceso
        evt.target.src='../../../../assets/img-dashboard/'+evt.target.alt+'-3.svg';
        switch(evt.target.alt){
          case 'caracterizacion':
            this.validateCaracterizacion.subscribe((data)=>{
              if (data){
                const title = "Aviso";
                const message = "Usted ya ha realizado el proceso de caracterización, si desea modificarlo, por favor comuníquese con el administrador del sistema."
                this.Message.showModal(title,message);
                return
              }else{
                this.router.navigate(['/'+evt.target.alt]);
              }
            });
            break;
          case 'diagnostico':
            this.validateCaracterizacion.subscribe((data)=>{
              if (!data){
                const title = "Aviso";
                const message = "Debe realizar el proceso de caracterización antes de continuar con el proceso de diagnostico"
                this.Message.showModal(title,message);
                return
              }else{
                this.validateDiagnostico.subscribe((data)=>{
                  if (data){
                    this.router.navigate(['/diagnosticoDoc']);
                    return
                  }else{
                    this.router.navigate(['/'+evt.target.alt]);
                  }
                });
              }
            });
            
            
            break;
          default: this.router.navigate(['/'+evt.target.alt]);
          break;
      }  
    }
  }

  mouseOver(evt: any){
    if (this.validateRol(evt)) {
      evt.target.src='../../../../assets/img-dashboard/'+evt.target.alt+'-3.svg'; 
      const p = document.getElementById('p-'+ evt.target.alt);
      if (p){
        p.style.color="#068460";
      }
    }
  }

  mouseOut(evt: any){
    if (this.validateRol(evt)) {
      evt.target.src='../../../../assets/img-dashboard/'+evt.target.alt+'.svg'; 
      const p = document.getElementById('p-'+ evt.target.alt);
      if (p){
        p.style.color="#999999";
      }
    }
  }
  Logo(){
   const url = 'https://www.gov.co/home'
   window.location.href=url;
  }

 
  //prueba para auditoria
  redirigirAuditoria(){
    window.location.href = '/auditoria';
}
}
