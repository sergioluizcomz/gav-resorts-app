import { PressDirective } from './custom-press/press-directive.directive';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { CustomFormDirective } from './custom-form/custom-form.directive';

@NgModule({
    declarations: [
		CustomFormDirective,
        PressDirective,
    ],
    imports: [
        CommonModule,
		IonicModule.forRoot({
			innerHTMLTemplatesEnabled: true
		}),
        ReactiveFormsModule,
        FormsModule,
        NgxMaskModule,
    ],
    exports: [
        CustomFormDirective,
        PressDirective,
    ]
})
export class DirectivesModule { }
