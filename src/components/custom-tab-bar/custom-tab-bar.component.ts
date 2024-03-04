import { Component } from '@angular/core';
import { NavigationService } from './../../services/navigation/navigation.service';

@Component({
	selector: 'custom-tab-bar',
	templateUrl: 'custom-tab-bar.component.html'
})
export class CustomTabBarComponent {
	
	public menuItems:any[] = [
		{url: "home",		icon: "home",		is_visible: true,	is_active: false},
		{url: "settings",	icon: "settings",	is_visible: true,	is_active: false},
	];

	constructor(
		private navigationService: NavigationService,
	) {

	}

	//Ao carregar o componente
	ngOnInit() {
		//
	}

	//Ao fechar o componente
	ngOnDestroy() {
		//
	}

	/**
	 * Abre a página de acordo com o menu selecionado
	 * @param index 
	 */
	public openPage(index:number) {

		for (let i = 0; i < this.menuItems.length; i++) {
			let element:any = this.menuItems[i];
			
			if (index == i) {
				element.is_active = true;

				if (!this.navigationService.currentUrlStr || this.navigationService.currentUrlStr.indexOf(element.url) == -1) {
					this.navigationService.sendUrl(element.url);
				}

			} else {
				element.is_active = false;
			}

		}

	}

	/**
	 * Verifica se o item está ativo
	 */
	public checkItemActive(item:any) {

		return item && item.url && this.navigationService.currentUrlStr && (this.navigationService.currentUrlStr.indexOf(item.url) != -1 || (item.url == "home" && this.navigationService.currentUrlStr == "/"));
	}

}
