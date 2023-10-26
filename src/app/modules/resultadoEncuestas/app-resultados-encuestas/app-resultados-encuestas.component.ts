import { Component } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ColorLista } from 'src/app/servicios/api/models/color';

@Component({
  selector: 'app-app-resultados-encuestas',
  templateUrl: './app-resultados-encuestas.component.html',
  styleUrls: ['./app-resultados-encuestas.component.css']
})
export class AppResultadosEncuestasComponent {
  showModal: boolean = false;
  arrayEncuestas = [];
  colorWallpaper:ColorLista;
  colorTitle:ColorLista;
  isCollapsed = true;
  mostrarNotificacion : boolean = false;


  constructor(
    public ApiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.ApiService.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;

   this.fnListEncuestas();
  }

  fnListEncuestas() {
    this.ApiService.getEncuestas().subscribe((data) => {
      this.arrayEncuestas = data;
    })
  }
}


