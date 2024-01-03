import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoCaracterOperador]'
})
export class NoCaracterOperador {
  private prohibitedChars: string[] = ['(', ')', '+', '-', '*', '/'];

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    const inputValue: string = this.el.nativeElement.value;

    for (const char of this.prohibitedChars) {
      if (inputValue.includes(char)) {
        this.el.nativeElement.value = inputValue.replace(char, '');
        break;
      }
    }
  }
}