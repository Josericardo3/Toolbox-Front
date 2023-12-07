import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoEspacio]'
})
export class NoEspacioDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputValue: string = this.el.nativeElement.value;
    if (inputValue && inputValue.trim() !== inputValue) {
      this.el.nativeElement.value = inputValue.trim();
      event.preventDefault();
    }
  }

}
