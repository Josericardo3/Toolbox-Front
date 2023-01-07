import {
    AbstractControl,
    ValidatorFn,
    FormControl,
    FormGroup,
    ValidationErrors
  } from '@angular/forms';
  
  export class CustomValidators {
    constructor() {}
  
    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } => {
        if (!control.value) {
          // if control is empty return no error
          return null as any;
        }
    
        // test the value of the control against the regexp supplied
        const valid = regex.test(control.value);
    
        // if true, return no error (no error), else return error passed in the second parameter
        return valid ? null : error as any;
      };
    };
    
    static comparePassword(control:AbstractControl,error: ValidationErrors): ValidatorFn {
      const password: string = control.get('password1')?.value; // get password from our password form control
      const confirmPassword: string = control.get('confirmPassword')?.value; // get password from our confirmPassword form control
      // compare is the password math
      console.log(password,confirmPassword,'comparación');
      if (password !== confirmPassword) {
        // if they don't match, set an error in our confirmPassword form control
       control.get('confirmPassword')?.setErrors({ NoPassswordMatch: true });
      }
    return password !== confirmPassword? null: error as any;
    }
  
  }