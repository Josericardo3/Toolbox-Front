import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumeros]'
})
export class NumerosDirective {

  constructor() { }

  @HostListener('keypress', ['$event'])

  onKeyPress(event: any) {
    const e = <KeyboardEvent>event;
    let charCode = (e.which) ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57 || charCode == 47))
      e.preventDefault();
  }
}
