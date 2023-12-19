import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-page-error',
  templateUrl: './page-error.component.html',
  styleUrls: ['./page-error.component.css']
})
export class PageErrorComponent {
  constructor(private router: Router, private location:Location) {}
  regresar(){
    const tipo = JSON.parse(localStorage.getItem('TIPO_USUARIO'));
    if(tipo==2){
      this.router.navigate(['/gestionUsuario']);
    }else{
      this.router.navigate(['/dashboard']);
    }
    
  }
}
