import { NumerosDirective } from '../directives/numeros.directive'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { DynamicHostDirective } from './dynamic-host.directive';

@NgModule({
    declarations:[
        NumerosDirective,
        DynamicHostDirective
    ],
    imports:[
        CommonModule
    ],
    exports:[
        NumerosDirective,
        DynamicHostDirective
    ]
})

export class DirectivesModule { }