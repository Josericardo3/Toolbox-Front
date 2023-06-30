import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ngModel][appMayusculas]'
})
export class MayusculasDirective {

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;
  lastValue: string;

  constructor(
    private ref: ElementRef, 
    private renderer: Renderer2
  ) {
    this.renderer.addClass(this.ref.nativeElement, "mayuscula");         
   }

   @HostListener('input', ['$event']) onInputChange($event: any) {
    var start = $event.target.selectionStart;
    var end = $event.target.selectionEnd;
    $event.target.value = $event.target.value.toUpperCase();
    $event.target.setSelectionRange(start, end);
    $event.preventDefault();

    this.value = $event.target.value.toUpperCase();
    this.ngModelChange.emit(this.value);
    if (!this.lastValue || (this.lastValue && $event.target.value.length > 0 && this.lastValue !== $event.target.value)) {
      this.lastValue = this.ref.nativeElement.value = $event.target.value;
    }
  }
}
