import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPuntoycomaRestringido]'
})
export class PuntoycomaRestringidoDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;
    
    if (inputValue.includes(';')) {
      const newValue = inputValue.replace(';', '');
      inputElement.value = newValue;
      inputElement.dispatchEvent(new Event('input')); // Emitir evento de entrada nuevamente
    }
  }

}
