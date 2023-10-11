import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-mejoraa-continua',
  templateUrl: './mejoraa-continua.component.html',
  styleUrls: ['./mejoraa-continua.component.css']
})
export class MejoraaContinuaComponent {
  idrol:number;


  constructor(
    //PG private store: Store<{ initialState:any }>,
    private router: Router,
    private ApiService: ApiService,
  ) {}
  ngOnInit(): void {
      
    if(Number(localStorage.getItem('rol'))=== 7){
      this.router.navigate(['/tablaEncuestas']);
    }

  }  
  
  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      this.idrol = Number(rol);
      return Number(rol);
    }
    return 0;
  }


}
