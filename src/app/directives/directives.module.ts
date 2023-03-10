
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
//import { DynamicHostDirective } from './dynamic-host.directive';
import { TrueFalseValueDirective } from './true-false-value.directive';
import { MayusculasDirective } from './mayusculas.directive';


@NgModule({
    declarations:[
  
       // DynamicHostDirective,
        TrueFalseValueDirective,
       MayusculasDirective,
    ],
    imports:[
        CommonModule
    ],
    exports:[

        //DynamicHostDirective,
        TrueFalseValueDirective,
        MayusculasDirective,
       
    ]
})

export class DirectivesModule { }