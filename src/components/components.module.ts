import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl } from '@danielmoncada/angular-datetime-picker';
import { DirectivesModule } from 'src/directives/directives.module';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { CustomTabBarComponent } from './custom-tab-bar/custom-tab-bar.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PipesModule } from 'src/pipes/pipes.module';
import { CustomRadioComponent } from './custom-radio/custom-radio.component';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NgModule } from "@angular/core";
import { CustomInputComponent } from './custom-input/custom-input.component';
import { RouterModule } from '@angular/router';
import { CustomToggleboxComponent } from './custom-togglebox/custom-togglebox.component';
import { CustomListFilterComponent } from './custom-list-filter/custom-list-filter.component';
import { CustomMediaSelectComponent } from './custom-media-select/custom-media-select.component';
import { CustomImageComponent } from './custom-image/custom-image.component';

@Injectable({
	providedIn: "root"
})
export class DefaultIntl extends OwlDateTimeIntl {

	// A label for the up second button (used by screen readers). 
	override upSecondLabel:string = "Adicionar segundo";

	// A label for the down second button (used by screen readers). 
	override downSecondLabel:string = "Reduzir segundo";

	// A label for the up minute button (used by screen readers). 
	override upMinuteLabel:string = "Adicionar minuto";

	// A label for the down minute button (used by screen readers). 
	override downMinuteLabel:string = "Reduzir minuto";

	// A label for the up hour button (used by screen readers). 
	override upHourLabel:string = "Adicionar hora";

	// A label for the down hour button (used by screen readers). 
	override downHourLabel:string = "Reduzir hora";

	// A label for the previous month button (used by screen readers).
	override prevMonthLabel:string = "Mês anterior";

	// A label for the next month button (used by screen readers).
	override nextMonthLabel:string = "Próximo mês";

	// A label for the previous year button (used by screen readers).
	override prevYearLabel:string = "Ano anterior";

	// A label for the next year button (used by screen readers).
	override nextYearLabel:string = "Próximo ano";

	// A label for the previous multi-year button (used by screen readers).
	override prevMultiYearLabel:string = "Últimos 21 anos";

	// A label for the next multi-year button (used by screen readers).
	override nextMultiYearLabel:string = "Próximos 21 anos";

	// A label for the "switch to month view" button (used by screen readers).
	override switchToMonthViewLabel:string = "Visualização mensal";

	// A label for the "switch to year view" button (used by screen readers).
	override switchToMultiYearViewLabel:string = "Visualização anual";

	// A label for the cancel button
	override cancelBtnLabel:string = "Cancelar";

	// A label for the set button
	override setBtnLabel:string = "Salvar";

	// A label for the range "from" in picker info
	override rangeFromLabel:string = "De";

	// A label for the range "to" in picker info
	override rangeToLabel:string = "Até";

	// A label for the hour12 button (AM)
	override hour12AMLabel:string = "AM";

	// A label for the hour12 button (PM)
	override hour12PMLabel:string = "PM";
};

@NgModule({
    schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
    declarations: [
        CustomInputComponent,
        CustomCheckboxComponent,
        CustomToggleboxComponent,
        CustomRadioComponent,
        CustomTabBarComponent,
        CustomHeaderComponent,
        CustomListFilterComponent,
        CustomMediaSelectComponent,
		CustomImageComponent,
    ],
    imports: [
        CommonModule,
		IonicModule.forRoot({
			innerHTMLTemplatesEnabled: true
		}),
        ReactiveFormsModule,
        FormsModule,
        NgxMaskModule,
        RouterModule,
        PipesModule,
        AngularSvgIconModule,
        DirectivesModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],
    providers: [
        { provide: OWL_DATE_TIME_LOCALE, useValue: "pt-br" },
		{ provide: OwlDateTimeIntl, useClass: DefaultIntl },
    ],
    exports: [
        CustomInputComponent,
        CustomCheckboxComponent,
        CustomToggleboxComponent,
        CustomRadioComponent,
        CustomTabBarComponent,
        CustomHeaderComponent,
        CustomListFilterComponent,
        CustomMediaSelectComponent,
		CustomImageComponent,
    ]
})
export class ComponentsModule { }