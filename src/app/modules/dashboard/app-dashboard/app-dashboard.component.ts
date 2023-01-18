import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css'],
})
export class AppDashboardComponent implements OnInit {
  userRol = 'COLABORADOR'
  rolList = [
    {
      rol: 'COLABORADOR',
      view:['caracterizacion','diagnostico']
    },
    {
      rol:'ADMIN',
      view:['planificacion']
    }
    
  ]
  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {

  }

  menuFilter(evt: any) {
    console.log(evt.target.alt,'e')
     const menuResult = this.rolList.map(
      (menuItem) => menuItem.rol === this.userRol && menuItem.view.includes(evt.target.alt),
    )
    console.log(menuResult,'menuResul')
    if (menuResult[0] ){
      this.router.navigate(["/"+evt.target.alt]);
     console.log('aqui esta la prueba', evt.target.alt);
    }
   
   
    
  }
}
