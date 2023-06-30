
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
//import { DynamicHostDirective } from './dynamic-host.directive';
import { TrueFalseValueDirective } from './true-false-value.directive';
import { NumerosDirective } from './numeros.directive';
import { LetrasDirective } from './letras.directive';
import { DateInputMaskDirective } from './date-input-mask.directive';
import { MayusculasDirective } from './mayusculas.directive';



@NgModule({
    declarations:[
  
       // DynamicHostDirective,
        TrueFalseValueDirective,
       LetrasDirective,
       NumerosDirective,
       DateInputMaskDirective,
       MayusculasDirective,

    ],
    imports:[
        CommonModule
    ],
    exports:[

        //DynamicHostDirective,
        TrueFalseValueDirective,
        LetrasDirective,
        NumerosDirective,
        DateInputMaskDirective
    ]
})

export class DirectivesModule { }