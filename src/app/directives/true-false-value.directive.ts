import { Directive,
    Input,
    forwardRef,
    HostListener,
    ElementRef,
    Renderer2,
    OnInit
  } from '@angular/core';
  import {
   
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
    
  } from '@angular/forms';
  @Directive({
    selector: 'input[type=checkbox][trueFalseValue]',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TrueFalseValueDirective),
        multi: true
      }
    ]
  
  
  })
  export class TrueFalseValueDirective implements ControlValueAccessor {
    @Input() trueValue : any = true;
    @Input() falseValue: any= false;
    private propagateChange = (_: any) => { };
  
    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }
    ngOnInit() {}
  
  
    @HostListener('change', ['$event'])
    onHostChange(ev: any) {
      this.propagateChange(ev.target.checked ? this.trueValue : this.falseValue);
    }
  
    writeValue(obj: any): void {
      if (obj === this.trueValue) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', true);
      } else {
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', false);
      }
    }
  
    registerOnChange(fn: any): void {
      this.propagateChange = fn;
    }
  
    registerOnTouched(fn: any): void { }
  
    setDisabledState(isDisabled: any): void {
      if (isDisabled == true) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', true);
      } else {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', false);
      }
  
    }
  
   
   
   
  
  
  }
  