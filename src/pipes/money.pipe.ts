import { Pipe, PipeTransform } from '@angular/core';
import { moneyText } from 'src/utils/functions';

@Pipe({
	name: "money",
})
export class MoneyPipe implements PipeTransform {
	
	transform(value:string|number, ...args: string[]) {

		return moneyText(String(value));
    }

}
