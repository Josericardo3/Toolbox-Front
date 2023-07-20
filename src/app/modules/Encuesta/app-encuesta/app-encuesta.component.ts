import { Component } from '@angular/core';

interface Option {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-app-encuesta',
  templateUrl: './app-encuesta.component.html',
  styleUrls: ['./app-encuesta.component.css']
})
export class AppEncuestaComponent {
  tarjetas: string[] = [];

  agregarTarjeta(){
    this.tarjetas.push('');
  }
  
  eliminarTarjeta(index: number){
    this.tarjetas.splice(index, 1);
  }

}
