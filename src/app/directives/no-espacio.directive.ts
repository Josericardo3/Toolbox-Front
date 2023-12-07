import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNoEspacio]'
})
export class NoEspacioDirective {

  constructor(private el: ElementRef, private ngControl: NgControl) { }
  
  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputValue = this.ngControl.value;
    if (inputValue && inputValue.charAt(0) === ' ') {
      this.ngControl.control.setValue(inputValue.trim(), { emitEvent: false });
    }
  }
}