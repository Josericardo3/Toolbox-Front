import { NumerosDirective } from '../directives/numeros.directive'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
//import { DynamicHostDirective } from './dynamic-host.directive';
import { TrueFalseValueDirective } from './true-false-value.directive';

@NgModule({
    declarations:[
        NumerosDirective,
       // DynamicHostDirective,
        TrueFalseValueDirective
    ],
    imports:[
        CommonModule
    ],
    exports:[
        NumerosDirective,
        //DynamicHostDirective,
        TrueFalseValueDirective
    ]
})

export class DirectivesModule { }