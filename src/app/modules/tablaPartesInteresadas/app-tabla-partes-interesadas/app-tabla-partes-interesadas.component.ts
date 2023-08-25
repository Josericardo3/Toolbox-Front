import { Component } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
ApiService

@Component({
  selector: 'app-app-tabla-partes-interesadas',
  templateUrl: './app-tabla-partes-interesadas.component.html',
  styleUrls: ['./app-tabla-partes-interesadas.component.css']
})
export class AppTablaPartesInteresadasComponent {
  datos: any = [];

  constructor(
    public api: ApiService
  ){}

  ngOnInit(){
    this.getTable();
  }

  getTable(){
    this.api.getFormsParteInteresada()
    .subscribe(data => {
      this.datos = data.RESPUESTA_GRILLA;
      const imprimirRespuesta = {
        'necesidades' : 'proveedores-necesidades',
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
