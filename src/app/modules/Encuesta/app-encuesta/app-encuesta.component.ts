import { Component } from '@angular/core';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'

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

  tarjetas: any[] = [];
  tarjetaActivaIndex: number | null = null;
  encuestaId: string;
  encuestaUrl: string;

  constructor(private Message: ModalService) {}

  agregarTarjeta(index?: number){
    this.tarjetas.splice(index + 1, 0, {});

  }

  eliminarTarjeta(index?: number) {
    this.tarjetas.splice(index, 1);
  }
  
  compartirEncuesta(){
    const encuestaId = '1';
    this.encuestaUrl = window.location.origin + `/encuestaCreada/${encuestaId}`;
    this.copyToClipboard(this.encuestaUrl);
  }

  copyToClipboard(text: string) {
    const inputElement = document.createElement('input');
    inputElement.value = text;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);

    const title = "URL PÚBLICA";
    const message = "Enlace de la encuesta copiado"
    this.Message.showModal(title, message);

    // alert('Enlace de la encuesta copiado');
  }
}
