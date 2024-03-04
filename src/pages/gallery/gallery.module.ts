import { GalleryPage } from './gallery.page';
import { DirectivesModule } from 'src/directives/directives.module';
import { NgxMaskModule } from 'ngx-mask';
import { PipesModule } from './../../pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/components/components.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

const routes: Routes = [{
	path: "",
	component: GalleryPage,
	children: [
	]
}];

@NgModule({
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
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
	declarations: [GalleryPage]
})
export class GalleryPageModule { }
