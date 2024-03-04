import { GuestGuard } from './../../guards/guest.guard';
import { DirectivesModule } from 'src/directives/directives.module';
import { PipesModule } from './../../pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/components/components.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxMaskModule } from 'ngx-mask';

const routes: Routes = [{
	path: "",
	canActivate: [GuestGuard],
	children: [
		{ path: "", redirectTo: "login", pathMatch: "full" },
		{ path: "login", loadChildren: () => import("./login/login.module").then(m => m.LoginPageModule) },
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
	]
})
export class AuthPageModule { }
