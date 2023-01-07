import { NumerosDirective } from '../directives/numeros.directive'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'

@NgModule({
    declarations:[
        NumerosDirective
    ],
    imports:[
        CommonModule
    ],
    exports:[
        NumerosDirective
    ]
})

export class DirectivesModule { }