import { DirectivesModule } from 'src/directives/directives.module';
import { PipesModule } from './../../pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/components/components.module';
import { SelectModalPage } from './select-modal.page';
import { NgxMaskModule } from 'ngx-mask';
import { AngularSvgIconModule } from 'angular-svg-icon';

const routes: Routes = [{
	path: "",
	component: SelectModalPage,
	children: [
	]
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		FormsModule,
		IonicModule,
		AngularSvgIconModule,
		ReactiveFormsModule,
		ComponentsModule,
		PipesModule,
		FormsModule,
		NgxMaskModule,
		DirectivesModule
	],
	declarations: [SelectModalPage]
})
export class SelectModalPageModule { }
