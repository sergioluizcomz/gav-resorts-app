import { DirectivesModule } from 'src/directives/directives.module';
import { PipesModule } from './../../pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/components/components.module';
import { SettingsPage } from './settings.page';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxMaskModule } from 'ngx-mask';
import { AuthGuard } from 'src/guards/auth.guard';

const routes: Routes = [{
	path: "",
	canActivate: [AuthGuard],
	children: [
		{ path: "", component: SettingsPage, pathMatch: "full" },
	]
}]

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
	declarations: [
		SettingsPage,
	],
	exports: [
		SettingsPage,
	]
})
export class SettingsPageModule { }
