import { Component } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/services/storage/storage.service';
import { StatusbarService } from 'src/services/statusbar/statusbar.service';
import { AuthService } from 'src/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/services/navigation/navigation.service';
import { register } from 'swiper/element/bundle';
import { VersionService } from 'src/services/version/version.service';

register();

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
})
export class AppComponent {

	public user:any = null;
	public isKeyboardOpened:boolean = false;
	private ns:Subscription;

	constructor(
		private platform: Platform,
		private loadingCtrl: LoadingController,
		private authService: AuthService,
		private navigationService: NavigationService,
		private versionService: VersionService

	) {
	
		this.loadFakeStatusbar();
		this.initializeApp();
			
	}

	/**
	 * Executa procedimentos assim que o APP for iniciado
	 */
	private async initializeApp() {

		//Executa procedimentos assim que o APP tiver carregado no dispositivo
		this.platform.ready()
		.then(async () => {

			await this.versionService.init();

			this.initLoginEvents();
			this.initLogoutEvents();

			//Esconde a splash screen
			document.getElementById("splash")?.classList.add("hide");

			setTimeout(() => {
				document.getElementById("splash")?.classList.add("d-none");
			}, 500);
            
		});

	}

	/**
	 * Inicializa evento de login do usuário no APP
	 */
	private initLoginEvents() {

		this.authService.loginEvent
		.subscribe(async (user:any) => {

			//Não insere registro de acesso após o login (servidor já faz), apenas quando o usuário já estava autenticado
			if (user.already_logged) {

			}

			let loading = await this.loadingCtrl.create({
				message: "Obtendo informações..."
			});

			loading.present()
			.then(async () => {

				this.user = user;
				
				this.navigationService.sendUrl("home");
				loading.dismiss();

			}).catch(err => {
				this.navigationService.sendUrl("home");
				loading.dismiss();
			});

		});

		if (this.authService.user) {
			this.authService.loginEvent.emit(this.authService.user);
		}

	}

	/**
	 * Inicializa evento de logout do usuário no APP
	 */
	private initLogoutEvents() {

		//Ao deslogar
		this.authService.logoutEvent
		.subscribe(() => {

			if (this.ns) {
				this.ns.unsubscribe();
			}

			this.user = null;

			this.navigationService.sendUrl("auth/login");
		});

	}

	/**
	 * Cria uma status-bar fake para auxiliar no desenvolvimento enquanto estiver rodando o APP na web
	 */
	private loadFakeStatusbar() {

		if (environment.debug && this.platform.is("mobileweb")) {

			let fakeStatusbarElm = document.createElement("div");
			fakeStatusbarElm.classList.add("fake-status-bar");
			fakeStatusbarElm.innerHTML = `
			<span>9:41</span>
			<div>
				<img src='assets/imgs/icons/network-signal.svg'></img>
				<img src='assets/imgs/icons/wifi-signal.svg'></img>
				<img src='assets/imgs/icons/battery-signal.svg'></img>
			</div>`;
	
			document.querySelector("body")?.prepend(fakeStatusbarElm);

		}

	}

}

/**
 * Verificar autenticação no storage antes de iniciar a aplicação
 * @param authService 
 * @param storageService 
 * @returns 
 */
export function checkStorageAuthentication(
	storageService: StorageService,
	statusbarService: StatusbarService,
	authService: AuthService
) {

    return async () => {

		//OBS: Não remover try catch pois pode congelar a aplicação caso um erro aconteça nessa rotina
		try {

			console.info("Definindo status-bar...")
	
			await statusbarService.updateOptions();
	
			console.info("Iniciando storage...");
	
			//Inicializa o Storage
			await storageService.init();
	
			console.info("Checando autenticação no storage...");
	
			//Verificar se o usuário está conectado
			await authService.init();
			
			console.info("Finalizando checagem inicial...");

		} catch (err) {
			console.error("Falha na rotina de verificações antes da inicialização do app.", err);
		}

		//Libera a aplicação
		return Promise.resolve();

    }

}