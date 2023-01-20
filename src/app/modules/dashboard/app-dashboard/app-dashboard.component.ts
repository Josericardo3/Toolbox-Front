import { Component, Injectable, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { selectFeatureCount } from '../../../state/selectors/items.selectors'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromRoot from 'src/app/state/reducer/example.reducer'
import { AppState } from 'src/app/state/selectors/app.state'
import { initialState } from '../../../state/reducer/example.reducer'

//@Injectable()

@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css'],
})
export class AppDashboardComponent implements OnInit {
  //PG counter$: Observable<any>;
  userRol = localStorage.getItem('rol')
  rolList = [
    {
      // colaborador
      rol: '1',
      view: ['caracterizacion'],
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

  menuFilter(evt: any) {
    console.log(evt.target.alt, 'e')
    const menuResult = this.rolList.map(
      (menuItem) =>
        menuItem.rol === this.userRol && menuItem.view.includes(evt.target.alt),
    )
    console.log(menuResult, 'menuResul')
    if (menuResult[0]) {
      this.router.navigate(['/' + evt.target.alt])
      console.log('aqui esta la prueba', evt.target.alt)
    }
  }

  Logo(){
   const url = 'https://www.gov.co/home'
   window.location.href=url;
  }
}
