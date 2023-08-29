import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';
//import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css']
})
export class AppMenuComponent {
  
  constructor(
    private router: Router,
    private ApiService: ApiService,
    ) {}

  ngOnInit(): void {}

  openComponent(event: any) {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "auditoria"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe(); 
    this.router.navigate(['/auditoria']); 
       
    console.log('Abrir Plan de auditoria');
    // Agrega aquí el código para abrir el componente Plan de auditoria
  }

  openComponentLista(event: any) {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "listaDeVerificacion"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe(); 
    this.router.navigate(['/listaDeVerificacion']); 
   
    // Agrega aquí el código para abrir el componente Lista de Verificación auditoria interna
  }

  openComponentInforme(event: any) {
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "informeAuditoria"
    };
    this.ApiService.postMonitorizacionUsuario(request).subscribe(); 
    this.router.navigate(['/informeAuditoria']); 
   
    // Agrega aquí el código para abrir el componente Informe de auditoria
  }
}



