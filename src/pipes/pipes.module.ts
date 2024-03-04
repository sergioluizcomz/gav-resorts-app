import { NgModule } from '@angular/core';
import { DatePipe } from './date.pipe';
import { MoneyPipe } from './money.pipe';
import { NumberBrPipe } from './number.pipe';
import { DocPipe } from './doc.pipe';

@NgModule({
	declarations: [
		DatePipe,
		MoneyPipe,
        NumberBrPipe,
		DocPipe
	],
	exports: [
		DatePipe,
		MoneyPipe,
        NumberBrPipe,
		DocPipe
	]
})
export class PipesModule { }
