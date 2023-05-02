import { Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appLetras]'
})
export class LetrasDirective {
  constructor() { }  @HostListener('keypress', ['$event']) 
  //  onKeyPress(event: any) 
  //  {    const e = <KeyboardEvent>event;    
  //   let charCode = (e.which) ? e.which : e.keyCode;  
  //     if ( (charCode >= 48 && charCode <= 57) )      e.preventDefault();  
  // }
  onKeyPress(event: any) {
    const e = <KeyboardEvent>event;
    const charCode = (e.which) ? e.which : e.keyCode;
    if (!(charCode >= 65 && charCode <= 90) && // letras mayúsculas
        !(charCode >= 97 && charCode <= 122) // letras minúsculas
        ) { // números
      e.preventDefault();
    }
  }
}



 