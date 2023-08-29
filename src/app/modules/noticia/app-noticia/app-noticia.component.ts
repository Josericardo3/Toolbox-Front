import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-app-noticia',
  templateUrl: './app-noticia.component.html',
  styleUrls: ['./app-noticia.component.css']
})
export class AppNoticiaComponent implements OnInit {
  
  dato!: string; 
  datosNoticia: any;
  idActividad: number; 
  idNoticia: number;
  imagen: any;
  
  constructor(
    private api: ApiService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.dato = history.state.dato;
    this.idNoticia = history.state.idNoticia;
    this.idActividad = history.state.idActividad;
    if (this.dato == 'Noticia' && this.idNoticia != undefined ) {
      this.getDataNoticia();
    }
    if (this.dato == 'Actividad' && this.idActividad != undefined ) {
      this.getDataActividad();
    }
  }

  getDataNoticia(){
    this.api.getNoticiaCompleta(this.idNoticia)
      .subscribe(data => {
       
        this.datosNoticia = data;
        this.imagen = this.datosNoticia.COD_IMAGEN ? 'data:image/png;base64,' + this.datosNoticia.COD_IMAGEN : '';
      })
  }

  getDataActividad() {
    this.api.getActivitiesCompleta(this.idActividad)
      .subscribe(data => {
        console.log(data)
      })
  }
}