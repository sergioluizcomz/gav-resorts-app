import { LoginPage } from './login.page';
import { DirectivesModule } from './../../../directives/directives.module';
import { PipesModule } from './../../../pipes/pipes.module';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from './../../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxMaskModule } from 'ngx-mask';

const routes: Routes = [{
	path: "",
	component: LoginPage,
	children: [
		{ path: "", redirectTo: "login", pathMatch: "full" },
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
	declarations: [LoginPage]
})
export class LoginPageModule { }
