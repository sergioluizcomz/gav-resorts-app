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
import { AuthGuard } from 'src/guards/auth.guard';
import { ContactListPage } from './contact-list/contact-list.page';
import { ContactFormPage } from './contact-form/contact-form.page';
import { ContactFiltersPage } from './contact-filters/contact-filters.page';
import { ContactInfoPage } from './contact-info/contact-info.page';

const routes: Routes = [{
	path: "",
	canActivate: [AuthGuard],
	children: [
		{ path: "", redirectTo: "list", pathMatch: "full" },
		{ path: "list", component: ContactListPage, pathMatch: "full" },
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
		ContactListPage,
		ContactFormPage,
		ContactFiltersPage,
		ContactInfoPage
	],
	exports: [
		ContactListPage,
		ContactFormPage,
		ContactFiltersPage,
		ContactInfoPage
	]
})
export class ContactPageModule { }
