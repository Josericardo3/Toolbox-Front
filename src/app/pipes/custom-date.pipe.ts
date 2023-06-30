
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customDate',
    pure: true
})
export class CustomDatePipe implements PipeTransform {

    transform(value: any): Date | any {
        const customDate = value? new Date(value.toString().match(/\d+/)[0] * 1) : '';
        return customDate;
    }
}
