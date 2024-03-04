import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';
import { NavigationService } from 'src/services/navigation/navigation.service';
import { ToastService } from 'src/services/toast/toast.service';
import { VersionService } from 'src/services/version/version.service';

@Component({
	selector: 'home-page',
	templateUrl: 'home.page.html',
})

export class HomePage {

	public user:any = null;

	public menuItems:any[] = [
		{
			name: "Contatos", 
			desc: "Gerencie os contatos cadastrados no sistema.",
			url: "contacts",
			handler: null,
			icon: "people",
			is_visible: true,
			is_active: true,
			class: "primary"
		},
	];

	constructor(
		private authService: AuthService,
		private navigationService: NavigationService,
		private toastService: ToastService,
		public versionService: VersionService
	) {

		//Define os eventos de mudança do usuário
		this.user = this.authService.getUser();
		this.authService.userChanged.subscribe(res => {
			this.user = this.authService.getUser();
		});

	}
	
	// Ao carregar a página
	ngOnInit() {
		
	}
	
	// Ao sair da página
	ngOnDestroy() {
		
	}

	/**
	 * Abre a página de acordo com o menu selecionado
	 * @param menuItem 
	 */
	public openPage(menuItem:any) {

		if (menuItem.is_active && (menuItem.url || menuItem.handler)) {

			if (menuItem.url) {
				this.navigationService.sendUrl(menuItem.url);
				return;
			}

			return menuItem.handler();

		} else {
			this.toastService.show("Esta funcionalidade não está disponível neste momento.");
		}

	}

}
