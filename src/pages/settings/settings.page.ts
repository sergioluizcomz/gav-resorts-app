import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ActionSheetService } from 'src/services/action-sheet/action-sheet.service';
import { AlertService } from 'src/services/alert/alert.service';
import { AuthService } from 'src/services/auth/auth.service';
import { NavigationService } from 'src/services/navigation/navigation.service';
import { StorageService } from 'src/services/storage/storage.service';
import { ToastService } from 'src/services/toast/toast.service';
import { VersionService } from 'src/services/version/version.service';
import { httpErrMessage } from 'src/utils/functions';

@Component({
	selector: 'settings-page',
	templateUrl: 'settings.page.html',
})

export class SettingsPage {

	public user:any = null;
	public errorMessage:string|null = null;

	public menuItems:any[] = [
		{
			name: "Versão do APP", 
			desc: "Verifique se este aplicativo está atualizado.",
			url: null,
			handler:() => this.checkAppVersion(),
			icon: "device",
			is_visible: true,
			is_active: true,
			class: "outline"
		},
		{
			name: "Limpar Dados", 
			desc: "Limpe os dados de armazenamento off-line do aplicativo.",
			url: null,
			handler:() => this.openClearStorageOptions(),
			icon: "database-close",
			is_visible: true,
			is_active: true,
			class: "danger"
		},
		{
			name: "Sair do APP", 
			desc: "Realize o logout do aplicativo.",
			url: null,
			handler:() => this.logout(),
			icon: "logout",
			is_visible: true,
			is_active: true,
			class: "danger"
		},
	];

	constructor(
		private authService: AuthService,
		private loadingCtrl: LoadingController,
		private navigationService: NavigationService,
		private alertService: AlertService,
		public versionService: VersionService,
		private actionSheetService: ActionSheetService,
		private storageService: StorageService,
		private toastService: ToastService
	) {

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
			this.alertService.create({type: "warning", message: "Esta funcionalidade não está disponível neste momento."});
		}

	}

	/**
	 * Realiza o logout do aplicativo
	 */
	private logout() {

		this.authService.logout()
		.then(res => {
			//

		}).catch(err => {
			//
		});

	}

	/**
	 * Abre um actionsheet com a confirmação de limpar dados do storage
	 */
	private openClearStorageOptions() {
		
		let buttons:any[] = [
			{text: "Sim", role: "selected", handler: () => {
				this.clearStorage();
				return true;
			}},
			{text: "Não", handler: () => {
				return true;
			}}
		];

		this.actionSheetService.create({
			title: "Limpar Dados",
			subtitle: "Tem certeza de que deseja limpar os dados de armazenamento off-line do seu aplicativo?",
			buttons: buttons
		});
		
	}

	/**
	 * Limpa todos os dados do storage e memória (exceto informações de autenticação e usuário)
	 */
	private async clearStorage() {

		let loading = await this.loadingCtrl.create({
			message: "Atualizando informações..."
		});
		
		loading.present()
		.then(() => {

			this.storageService.clearData()
			.then(res => {

				this.toastService.show("Dados de armazenamento removidos com sucesso!");
				loading.dismiss();

			}).catch(err => {
				this.errorMessage = httpErrMessage(err);
				loading.dismiss();
			})

		});

	}

	/**
	 * Verifica se existe uma nova versão do APP
	 */
	private checkAppVersion() {
		this.toastService.show("Seu aplicativo já está em sua versão mais recente disponível!");
	}

}
