import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Input() index: number | undefined;
  @Output() eliminarTarjeta = new EventEmitter<number>();
  @Output() tarjetaClicada = new EventEmitter<number>();

  showOtro: boolean = false;
  addInput: boolean =  false;
  selectedOption: Option = { label: 'Seleccione una opción', value: '', icon: '' };
  showOptions = false;
  inputs: boolean[] = [];
  isOn: boolean = false;
  options: Option[] = [
    { label: 'Respuesta corta', value: 'respuestaCorta', icon: 'fa-solid fa-minus' },
    { label: 'Respuesta larga', value: 'respuestaLarga', icon: 'fa-solid fa-grip-lines' },
    { label: 'Varias opciones', value: 'radioButton', icon: 'fa-regular fa-circle-dot' },
    { label: 'Casillas', value: 'checkbox', icon: 'fa-regular fa-square-check' },
    { label: 'Desplegable', value: 'desplegable', icon: 'fa-solid fa-circle-arrow-down' }

  ];
  
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  agregarTarjeta() {
    // Solo emitir el evento tarjetaClicada si no estás en el modo de opciones
    if (!this.showOptions) {
      this.tarjetaClicada.emit(this.index);
    }
  }

  eliminarEstaTarjeta() {
    this.eliminarTarjeta.emit(this.index);
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
