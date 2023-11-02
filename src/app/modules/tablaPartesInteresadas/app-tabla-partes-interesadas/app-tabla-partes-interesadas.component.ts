import { Component } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ColorLista } from 'src/app/servicios/api/models/color';
ApiService

@Component({
  selector: 'app-app-tabla-partes-interesadas',
  templateUrl: './app-tabla-partes-interesadas.component.html',
  styleUrls: ['./app-tabla-partes-interesadas.component.css']
})
export class AppTablaPartesInteresadasComponent {
  colorWallpaper: ColorLista;
  colorTitle: ColorLista;
  isCollapsed = false;
  mostrarNotificacion: boolean = false;
  //
  rolessArray: any = [];

  constructor(
    public api: ApiService
  ) { }

  ngOnInit() {
    this.api.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;
    this.fnConsultMatrizPartesInteresadas();
  }

  fnConsultMatrizPartesInteresadas() {
    this.api.getDataParteInteresada().subscribe((data) => {
      this.rolessArray = data;
      function compararPorIDInteresada(a: any, b: any) {
        const idA = a.ID_INTERESADA;
        const idB = b.ID_INTERESADA;

        if (idA < idB) {
          return -1;
        } else if (idA > idB) {
          return 1;
        } else {
          return 0;
        }
      }
      this.rolessArray.sort(compararPorIDInteresada);
      //
      this.rolessArray.forEach(val => {
        switch (val.ID_INTERESADA) {
          case 1:
            val.TITULO = 'PROVEEDOR(ES)';
            break;
          case 2:
            val.TITULO = 'ORGANIZACIONES GUBERNAMENTALES';
            break;
          case 3:
            val.TITULO = 'ORGANIZACIONES NO GUBERNAMENTALES';
            break;
          case 4:
            val.TITULO = 'CLIENTE(S)';
            break;
          case 5:
            val.TITULO = 'HUÉSPEDES';
            break;
          case 6:
            val.TITULO = 'COLABORADORES (Personal directo y/o indirecto)';
            break;
          case 7:
            val.TITULO = 'ACCIONISTAS O PROPIETARIOS';
            break;
          case 8:
            val.TITULO = 'COMUNIDAD';
            break;
          case 9:
            val.TITULO = 'COMUNIDAD VULNERABLE';
            break;
          case 10:
            val.TITULO = 'ATRACTIVOS TURÍSTICOS';
            break;
          case 11:
            val.TITULO = 'OTRA, ¿CUÁL?';
            break;
          default:
        }
        })
    })
  }
}
