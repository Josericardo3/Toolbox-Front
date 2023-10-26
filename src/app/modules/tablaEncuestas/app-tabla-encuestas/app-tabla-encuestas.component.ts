import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api/api.service';
import { ColorLista } from 'src/app/servicios/api/models/color';

@Component({
  selector: 'app-app-tabla-encuestas',
  templateUrl: './app-tabla-encuestas.component.html',
  styleUrls: ['./app-tabla-encuestas.component.css']
})
export class AppTablaEncuestasComponent implements OnInit{
  showModal: boolean = false;
  mostrarBuscador: boolean = false;
  busqueda: string = '';
  arrayEncuestas = [];
  colorWallpaper: ColorLista;
  colorTitle: ColorLista;
  isCollapsed = true;
  mostrarNotificacion: boolean = false;

  indiceAEliminar: number = -1;
  valorRecibido = 0;
  caracteristicaIndiceEliminar: number = -1;

  constructor(
    public api: ApiService
  ) {}

  ngOnInit(){
    this.api.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;

    this.fnListEncuestas();
  }

  filtrarDatos() {
  }

  fnListEncuestas() {
    this.api.getEncuestas().subscribe((data) => {
      this.arrayEncuestas = data;
    })
  }

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }

  eliminarEncuesta(id: any) {
    this.indiceAEliminar = id;
  }

  recibirValor(valor: number) {
    this.valorRecibido = valor;
    this.caracteristicaIndiceEliminar = this.valorRecibido;
    if (valor == -2) this.fnListEncuestas();
  }

}
