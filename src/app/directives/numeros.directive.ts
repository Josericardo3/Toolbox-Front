import { Directive, HostListener, ElementRef  } from '@angular/core';

@Directive({
  selector: '[appNumeros]'
})
export class NumerosDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event'])

  onKeyPress(event: any) {
    const e = <KeyboardEvent>event;
    let charCode = (e.which) ? e.which : e.keyCode;
    // if (charCode > 31 && (charCode < 46 || charCode > 57 || charCode == 47))
    //   e.preventDefault();
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const currentValue = this.el.nativeElement.value;
    const maxLength = 10;
    if (currentValue.length > maxLength) {
      this.el.nativeElement.value = currentValue.slice(0, maxLength);
    }
  }
}
