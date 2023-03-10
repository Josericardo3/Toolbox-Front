import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appMayusculas]'
})
export class MayusculasDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;
  lastValue: string;

  constructor(public ref: ElementRef) { }

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