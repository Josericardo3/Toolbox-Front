import { Component, Input } from '@angular/core';

interface Option {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-app-tarjetas',
  templateUrl: './app-tarjetas.component.html',
  styleUrls: ['./app-tarjetas.component.css']
})
export class AppTarjetasComponent {
  @Input() pregunta: string;
  showOtro: boolean = false;
  addInput: boolean =  false;
  selectedOption: Option = { label: 'Seleccione una opción', value: '', icon: '' };
  showOptions = false;
  inputs: boolean[] = [];
  isOn: boolean = false;
  options: Option[] = [
    { label: 'Respuesta corta', value: 'respuestaCorta', icon: 'fas fa-minus' },
    { label: 'Respuesta larga', value: 'respuestaLarga', icon: 'fa-solid fa-grip-lines' },
    { label: 'Varias opciones', value: 'radioButton', icon: 'fa-regular fa-circle-dot' },
    { label: 'Casillas', value: 'checkbox', icon: 'fa-regular fa-square-check' },
    { label: 'Desplegable', value: 'desplegable', icon: 'fa-solid fa-circle-arrow-down' }
  ];

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  selectOption(option: Option) {
    this.selectedOption = option;
    this.showOptions = false;
  }

  agregarOtro(){
    this.showOtro = !this.showOtro;
  }

  agregarInput(){
    this.inputs.push(true);
  }

}
