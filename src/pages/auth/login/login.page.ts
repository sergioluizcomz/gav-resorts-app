import { AuthService } from 'src/services/auth/auth.service';
import { EventsService } from './../../../services/events/events.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NavigationService } from './../../../services/navigation/navigation.service';
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { StorageService } from 'src/services/storage/storage.service';
import { formValidator, httpErrMessage } from 'src/utils/functions';
import { ToastService } from 'src/services/toast/toast.service';

@Component({
	selector: 'login-page',
	templateUrl: 'login.page.html',
})

export class LoginPage {

	public form:FormGroup;
	public errorMessage:string|null = null;
	public isFormValid:boolean = false;

	public loginValueAux:any = null;
	public passwordValueAux:any = null;

	constructor(
		private navigationService: NavigationService,
		private formBuilder: FormBuilder,
		private eventsService: EventsService,
		private authService: AuthService,
		private loadingCtrl: LoadingController,
		private storageService: StorageService,
		private toastService: ToastService
	) {

		this.buildForm();

	}

	// Ao sair da página
	ngOnDestroy() {

	}

	// Ao iniciar a página
	ngOnInit() {

		//Ouve a mudança do campo de busca
		this.eventsService.unsubscribe("input-value-changed");
		this.eventsService.subscribe("input-value-changed", (data:any) => {
			
			if (data) {

				if (data.formControlName == "login") {
					this.loginValueAux = data.value;

				} else if (data.formControlName == "password") {
					this.passwordValueAux = data.value;
				}
				
				this.isFormValid = this.loginValueAux && this.passwordValueAux && this.form.valid;
				
			}

		});

	}

	/**
	 * Inicia o processo de recuperação de senha do usuário
	 */
	public openRecoverPasswordPage() {
		this.toastService.show("Funcionalidade indisponível neste momento.");
	}

	/**
	 * Realiza a tentativa de login
	 */
	public async submit() {

		if (this.isFormValid) {
			
			let loading = await this.loadingCtrl.create({
				message: "Realizando login..."
			});
			
			loading.present()
			.then(async () => {

				let formData:any = this.form.value;

				this.authService.login(formData)
				.then((res:any) => {

                    this.navigationService.sendUrl("home");
					this.form.get("password")?.setValue(null);

					loading.dismiss();

				}).catch((err:any) => {
					this.errorMessage = httpErrMessage(err);
					loading.dismiss();
				});

			});

		}

	}

	/**
	 * Fecha a página atual
	 */
	public dismiss() {
		this.navigationService.previousUrl();
	}

	/**
	 * Constrói o formulário de login
	 */
	private async buildForm() {

		let userLogged:any = await this.storageService.get("last-user-logged") || null;

		this.loginValueAux = userLogged;

		this.form = this.formBuilder.group({
			login: new FormControl({value: (userLogged || null), disabled: false}, [formValidator("email")]),
			password: new FormControl({value: null, disabled: false}, []),
			is_remember_me: new FormControl({value: null, disabled: false}, []),
		});

	}

}
