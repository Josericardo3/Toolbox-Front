import { Component, Injectable, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { selectFeatureCount } from '../../../state/selectors/items.selectors'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromRoot from 'src/app/state/reducer/example.reducer'
import { AppState } from 'src/app/state/selectors/app.state'


//@Injectable()

@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css'],
})
export class AppDashboardComponent implements OnInit {
  //PG counter$: Observable<any>;
  arrNormas = JSON.parse(localStorage.getItem('norma')||'');
  normaSelected = localStorage.getItem("normaSelected");
  userRol = localStorage.getItem('rol');
  newUser= localStorage.getItem("newUser");
  rolList = [
    {
      // colaborador
      rol: '1',
      view: ['caracterizacion','diagnostico'],
    },
    {
      rol: 'ADMIN',
      view: ['planificacion'],
    },
  ]
  constructor(
    //PG private store: Store<{ initialState:any }>,
    private router: Router,
  ) {
 
    //PG this.counter$= store.select('initialState')
    // console.log(this.counter$,'counter')
  }

  ngOnInit(): void {
    //prueba global selectFeatureCount
  }

  validateRol(evt: any){
    const menuResult = this.rolList.map(
      (menuItem) =>
        menuItem.rol === this.userRol && menuItem.view.includes(evt.target.alt),
    )
    //console.log(menuResult[0],"MENU")
    return menuResult[0];
  }

  menuFilter(evt: any) { //redireccionar
      if (this.validateRol(evt)) {// condicional cuando sí tiene acceso
        evt.target.src='../../../../assets/img-dashboard/'+evt.target.alt+'-3.svg'; 
        this.router.navigate(['/' + evt.target.alt])
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
}
