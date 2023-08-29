import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api/api.service';

@Component({
  selector: 'app-app-tabla-encuestas',
  templateUrl: './app-tabla-encuestas.component.html',
  styleUrls: ['./app-tabla-encuestas.component.css']
})
export class AppTablaEncuestasComponent implements OnInit{
  showModal: boolean = false;
  mostrarBuscador: boolean = false;
  busqueda: string = '';

  constructor(
    public api: ApiService
  ) {}

  ngOnInit(){}

  filtrarDatos() {

  }
}
