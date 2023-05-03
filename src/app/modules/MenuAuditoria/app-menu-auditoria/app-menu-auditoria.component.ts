import { Component } from '@angular/core';
import { Router } from '@angular/router'
@Component({
  selector: 'app-app-menu-auditoria',
  templateUrl: './app-menu-auditoria.component.html',
  styleUrls: ['./app-menu-auditoria.component.css']
})

export class AppMenuAuditoriaComponent {
  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {

  }

  openComponent(event: any) {
    this.router.navigate(['/nuevoPlanDeAuditoria']); 
       
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









