import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-app-nuevo-plan-de-auditoria',
  templateUrl: './app-nuevo-plan-de-auditoria.component.html',
  styleUrls: ['./app-nuevo-plan-de-auditoria.component.css']
})
export class AppNuevoPlanDeAuditoriaComponent {

  constructor(
    private router: Router,
  ) 
  { }

  ngOnInit(): void {
    if(window.location.search.includes('item')){
      let id = window.location.search.slice(-1);
      console.log(id,"id",`#${id}`);
      let getElement = document.querySelector( `#item-${id}`)
      
     return getElement.classList.add('selected')
    }else{
      document.getElementById('formAuditoria').style.display = 'none' 
    }
}

openComponentPlan(){
  this.router.navigate(['/auditoria'], { queryParams: { form: 'show' } });
  // this.router.navigate(['/auditoria'])
}

openComponentLista(evt:any){
  this.router.navigate(['/listaDeVerificacion'], { queryParams: { item: evt.target?.i
   } 
  }
  );
}

generarPdf(){
  this.router.navigate(['/auditoriaDoc']);
  // this.router.navigate(['/auditoria'])
}
}