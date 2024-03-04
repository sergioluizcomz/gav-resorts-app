import { Pipe, PipeTransform } from '@angular/core';
import { mask, onlyNumbers } from 'src/utils/functions';

@Pipe({
	name: "doc",
})
export class DocPipe implements PipeTransform {
	
	transform(value:string|number, ...args: string[]) {

		return value ? mask(onlyNumbers(String(value || "")), "doc") : "";

    }

}
