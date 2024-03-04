import { Pipe, PipeTransform } from '@angular/core';
import { numberText } from 'src/utils/functions';

@Pipe({
    name: "numberBR",
})
export class NumberBrPipe implements PipeTransform {

    transform(value: string | number, ...args: string[]) {

        return numberText(String(value));
    }
}

