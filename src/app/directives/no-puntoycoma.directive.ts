import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoPuntoycoma]'
})
export class NoPuntoycomaDirective {

  constructor(private el: ElementRef) { }
  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    if (inputValue.includes(';')) {
      input.value = inputValue.replace(';', '');
    }
  }

}
