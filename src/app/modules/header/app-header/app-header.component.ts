import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ColorLista } from 'src/app//servicios/api/models/color';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  @Input() esVisible=false;
  datos: any = [];
  nombre: any;
  colorHeader: ColorLista;

  constructor(private ApiService: ApiService,) { }

  ngOnInit() {
    this.ApiService.colorTempo();
    this.colorHeader = JSON.parse(localStorage.getItem("color")).header;
    const id = localStorage.getItem('Id');
    if (id != null || undefined) this.getNombreUsuario();
  }

  Logo() {
    const url = 'https://www.gov.co/home'
    window.location.href = url;
  }

  getNombreUsuario() {
    this.ApiService.getUsuario()
      .subscribe(data => {
        this.datos = data
        this.nombre = this.datos.NOMBRE_PST
      })
  }
}
