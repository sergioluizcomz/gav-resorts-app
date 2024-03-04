import { DirectivesModule } from 'src/directives/directives.module';
import { PipesModule } from './../../pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ComponentsModule } from 'src/components/components.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { NgxMaskModule } from 'ngx-mask';
import { AngularSvgIconModule } from 'angular-svg-icon';

const routes: Routes = [{
	path: "",
	canActivate: [AuthGuard],
	component: HomePage,
	children: [
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
		HomePage
	]
})
export class HomePageModule { }
