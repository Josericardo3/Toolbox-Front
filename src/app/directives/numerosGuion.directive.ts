import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumerosGuion]'
})
export class NumerosGuionDirective {
  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [8, 9, 37, 39]; // Permitir teclas de retroceso, tabulación, flecha izquierda y flecha derecha
    const input = event.target as HTMLInputElement;
    const char = String.fromCharCode(event.keyCode);

    // Permitir números (del 0 al 9), guiones (-) y teclas especiales permitidas
    if (!/[\d-]/.test(char) || (event.shiftKey && event.keyCode === 189) || !allowedKeys.includes(event.keyCode)) {
      event.preventDefault();
    }
  }
}
