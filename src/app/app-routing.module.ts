import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },

	//Autenticação
	{ path: "auth", loadChildren: () => import("../pages/auth/auth.module").then(m => m.AuthPageModule) },

	//Tela inicial
	{ path: "home", loadChildren: () => import("../pages/home/home.module").then(m => m.HomePageModule) },

	//Tela Configurações
	{ path: "settings", loadChildren: () => import("../pages/settings/settings.module").then(m => m.SettingsPageModule) },

	//Tela Contatos
	{ path: "contacts", loadChildren: () => import("../pages/contact/contact.module").then(m => m.ContactPageModule) },

];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			onSameUrlNavigation: "reload",
			preloadingStrategy: PreloadAllModules
		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
