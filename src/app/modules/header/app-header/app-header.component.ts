import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  datos: any = [];
  nombre: any;

  constructor(private ApiService: ApiService,) { }

  ngOnInit() {
    const id = localStorage.getItem('Id');
    if (id != null || undefined) this.getNombreUsuario();
  }

  Logo(){
    const url = 'https://www.gov.co/home'
    window.location.href=url;
   }

   getNombreUsuario(){
    this.ApiService.getUsuario()
    .subscribe(data =>{
      this.datos = data
      this.nombre = this.datos.NOMBRE_PST
    })
  }
}
