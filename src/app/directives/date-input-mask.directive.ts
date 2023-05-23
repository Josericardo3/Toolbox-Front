import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateInputMask]'
})
export class DateInputMaskDirective {

  constructor() { }

  @HostListener('keypress', ['$event'])

  onKeyPress(event: any) {
    const e = <KeyboardEvent>event;
    let len = event.target.value.length;

    if(e.keyCode < 47 || e.keyCode > 57) e.preventDefault()

    // Caso 1: El usuario escribe el guión "-"
    if(len !== 1 || len !== 3) if(e.keyCode == 47) e.preventDefault();

    // Caso 2: El usuario no escribe el guión "-"
    if(len === 4) event.target.value += '-';
    if(len === 7) event.target.value += '-';
  }

}
