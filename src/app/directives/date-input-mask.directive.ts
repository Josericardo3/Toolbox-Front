import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateInputMask]'
})
export class DateInputMaskDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    const e = <KeyboardEvent>event;
    const key = e.key;

    // Permitir solo los siguientes caracteres especiales
    const allowedSpecialCharacters = ['-'];

    // Permitir solo las teclas de navegación y los caracteres especiales
    const allowedKeys = [
      'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete',
      ...allowedSpecialCharacters
    ];

    // Permitir solo los caracteres especiales si ya se han ingresado
    const value = event.target.value;
    const hasSpecialCharacter = value.includes('-');
    const allowedKeysWhenSpecialCharacterPresent = [
      ...allowedSpecialCharacters,
      'Backspace', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'
    ];

    if (
      !allowedKeys.includes(key) ||
      (hasSpecialCharacter && !allowedKeysWhenSpecialCharacterPresent.includes(key))
    ) {
      e.preventDefault();
    }
  }
}