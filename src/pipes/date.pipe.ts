import { Pipe, PipeTransform } from '@angular/core';
import { invertDate } from 'src/utils/functions';
import * as moment from 'moment';

@Pipe({
	name: "dateBr",
})
export class DatePipe implements PipeTransform {
	
	transform(value:string|Date, ...args: string[]) {

        try {

			moment.locale("pt-br");

			if (value && typeof value === "string" && value.indexOf("-") == -1) {
				value = invertDate(String(value), "br", null, "-");
			}

			let format: string = args && args[0] ? args[0] : "DD/MM/YY HH:mm";
			let date = moment(value);

			let dateFormatted = date.format(format);
			
			return dateFormatted;

		} catch (exception) {
			console.error("Não foi possível aplicar o pipe 'dateBr'.", exception);
			return value;
		}

    }

}
