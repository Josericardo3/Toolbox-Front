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
  datos: any = [];
  orden: string;
  necesidades: string;
  expectativa: string;
  estadoC: string;
  observacion: string;
  accion: string;
  colorWallpaper: ColorLista;
  colorTitle: ColorLista;
  isCollapsed = false;
  mostrarNotificacion: boolean = false;

  constructor(
    public api: ApiService
  ) { }

  ngOnInit() {
    this.api.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;

    this.getTable();

    this.api.getFormsParteInteresada()
      .subscribe((data: any) => {
        this.datos = data.RESPUESTA_GRILLA;
        if (this.datos.length != 0) {
          const obj = this.datos.filter((item) => item.PREGUNTA === "interesada");
          this.orden = obj[0].RESPUESTA;
          const necesidad = this.datos.filter((item) => item.PREGUNTA === "necesidades");
          this.necesidades = necesidad[0].RESPUESTA;
          const expectativa = this.datos.filter((item) => item.PREGUNTA === "expectativas");
          this.expectativa = expectativa[0].RESPUESTA;
          const estadoC = this.datos.filter((item) => item.PREGUNTA === "estadoCumplimiento");
          this.estadoC = estadoC[0].RESPUESTA;
          const observacion = this.datos.filter((item) => item.PREGUNTA === "observaciones");
          this.observacion = observacion[0].RESPUESTA;
          const accion = this.datos.filter((item) => item.PREGUNTA === "acciones");
          this.accion = accion[0].RESPUESTA;
        }
      })


  }

  getTable() {
    this.api.getFormsParteInteresada()
      .subscribe(data => {
        this.datos = data.RESPUESTA_GRILLA;
        const imprimirRespuesta = {
          'necesidades': 'proveedores-necesidades',
          'expectativas': 'proveedores-expectativas',
          'estadoCumplimiento': 'proveedores-requisitos',
          'observaciones': 'proveedores-observaciones',
          'acciones': 'proveedores-acciones'
        }
        this.datos.forEach((item: any) => {
          if (item.ORDEN === 1 && imprimirRespuesta[item.PREGUNTA]) {
            const respuesta = imprimirRespuesta[item.PREGUNTA];
            const element = document.getElementById(respuesta);
            if (element) {
              element.textContent = item.RESPUESTA;
            }
            // if (item.PREGUNTA === 'necesidades') {
            //   document.getElementById('proveedores-necesidades').textContent = item.RESPUESTA;
            // }
            // if (item.PREGUNTA === 'expectativas') {
            //   document.getElementById('proveedores-expectativas').textContent = item.RESPUESTA;
            // }
            // if (item.PREGUNTA === 'estadoCumplimiento') {
            //   document.getElementById('proveedores-requisitos').textContent = item.RESPUESTA;
            // }
            // if (item.PREGUNTA === 'observaciones') {
            //   document.getElementById('proveedores-observaciones').textContent = item.RESPUESTA;
            // }
            // if (item.PREGUNTA === 'acciones') {
            //   document.getElementById('proveedores-acciones').textContent = item.RESPUESTA;
            // }
          }
        });
      })
  }
}
