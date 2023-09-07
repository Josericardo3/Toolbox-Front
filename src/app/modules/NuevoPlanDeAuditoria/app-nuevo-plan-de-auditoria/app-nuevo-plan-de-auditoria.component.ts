import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-nuevo-plan-de-auditoria',
  templateUrl: './app-nuevo-plan-de-auditoria.component.html',
  styleUrls: ['./app-nuevo-plan-de-auditoria.component.css']
})
export class AppNuevoPlanDeAuditoriaComponent {

  constructor(
    private router: Router,
    private ApiService: ApiService
  ) 
  { }

  ngOnInit(): void {
    if(window.location.search.includes('item')){
      let id = window.location.search.slice(-1);
    //  console.log(id,"id",`#${id}`);
      let getElement = document.querySelector( `#item-${id}`)
      
     return getElement.classList.add('selected')
    }else{
      document.getElementById('formAuditoria').style.display = 'none' 
    }
}

openComponentPlan(){
  const request = {
    FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
    TIPO: "Modulo",
    MODULO: "diagnosticoDoc"
  };
  this.ApiService.postMonitorizacionUsuario(request).subscribe();  
  this.router.navigate(['/auditoria'], { queryParams: { form: 'show' } });
  // this.router.navigate(['/auditoria'])
}

openComponentLista(evt:any){
  const request = {
    FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
    TIPO: "Modulo",
    MODULO: "listaDeVerificacion"
  };
  this.ApiService.postMonitorizacionUsuario(request).subscribe();  
  this.router.navigate(['/listaDeVerificacion'], { queryParams: { item: evt.target?.i
   } 
  }
  );
}

generarPdf(){
  const request = {
    FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
    TIPO: "Modulo",
    MODULO: "auditoriaDoc"
  };
  this.ApiService.postMonitorizacionUsuario(request).subscribe();  
  this.router.navigate(['/auditoriaDoc']);
  // this.router.navigate(['/auditoria'])
}
}