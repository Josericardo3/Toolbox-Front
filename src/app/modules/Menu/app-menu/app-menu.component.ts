import { Component } from '@angular/core';
import { Router } from '@angular/router';
//import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css']
})
export class AppMenuComponent {
  
  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {

  }

  openComponent(event: any) {
    this.router.navigate(['/auditoria']); 
       
    console.log('Abrir Plan de auditoria');
    // Agrega aquí el código para abrir el componente Plan de auditoria
  }

  openComponentLista(event: any) {
    this.router.navigate(['/listaDeVerificacion']); 
    console.log('Abrir Lista de Verificación auditoria interna');
    // Agrega aquí el código para abrir el componente Lista de Verificación auditoria interna
  }

  openComponentInforme(event: any) {
    this.router.navigate(['/informeAuditoria']); 
    console.log('Abrir Informe de auditoria');
    // Agrega aquí el código para abrir el componente Informe de auditoria
  }
}



