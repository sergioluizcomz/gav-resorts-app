import { ChangeDetectorRef, Component } from '@angular/core';
import { LoadingController, ModalController, RefresherCustomEvent } from '@ionic/angular';
import { AuthService } from 'src/services/auth/auth.service';
import { EventsService } from 'src/services/events/events.service';
import { NavigationService } from 'src/services/navigation/navigation.service';
import { httpErrMessage, mask, onlyNumbers } from 'src/utils/functions';
import { ActionSheetService } from 'src/services/action-sheet/action-sheet.service';
import { ToastService } from 'src/services/toast/toast.service';
import { ContactFiltersPage } from '../contact-filters/contact-filters.page';
import { ContactService } from 'src/services/contact/contact.service';
import { ContactFormPage } from '../contact-form/contact-form.page';
import { ContactInfoPage } from '../contact-info/contact-info.page';
import * as moment from "moment";

@Component({
	selector: 'contact-list-page',
	templateUrl: 'contact-list.page.html',
})

export class ContactListPage {

	public user:any = null;

	public contacts:any[] = [];
	public filteredList:any[] = [];

	public filters: any = {};
	public isLoading:boolean = true;
	public searchText:string = "";
	public errorMessage:string|null = null;

	constructor(
		private authService: AuthService,
		private navigationService: NavigationService,
		private loadingCtrl: LoadingController,
		private eventsService: EventsService,
		private modalCtrl: ModalController,
		private contactService: ContactService,
		private actionSheetService: ActionSheetService,
		private toastService: ToastService,
		private changeRef: ChangeDetectorRef
	) {

		moment.locale("pt-br");

		this.user = this.authService.getUser();
		this.authService.userChanged.subscribe(res => {
			this.user = this.authService.getUser();
		});

		this.contactService.contactUpdated.subscribe((loading?:any) => {
			this.refresh(null, loading);
		});
		
	}
	
	//Ao carregar a página
	ngOnInit() {

		//Ouve a mudança do campo de busca
		this.eventsService.unsubscribe("input-value-changed");
		this.eventsService.subscribe("input-value-changed", (data:any) => {

			//Filtra a lista
			if (data?.formControlName == "search") {
				this.searchText = data?.value;
				this.updateFilteredList();
			}

		});

		//Ouve o click no botão de filtro
		this.eventsService.unsubscribe("input-outside-callback");
		this.eventsService.subscribe("input-outside-callback", (data:any) => {

			//Abre a tela com mais filtros para a lista
			if (data?.formControlName == "search") {
				this.openFilters();
			}

		});

		//Ouve o click no botão lateral do header
		this.eventsService.unsubscribe("header-right-callback");
		this.eventsService.subscribe("header-right-callback", res => {
			this.openContactForm();
		});

		this.loadContacts();

	}
	
	//Ao sair da página
	ngOnDestroy() {
		this.eventsService.unsubscribe("input-value-changed");
		this.eventsService.unsubscribe("input-outside-callback");
	}

	/**
	 * Fecha a página atual
	 */
	public dismiss() {
		this.navigationService.previousUrl();
	}

	/**
	 * Abre o formulário de criação e edição de um contato
	 * @param item 
	 */
	public async openContactForm(item?:any) {

		let modal = await this.modalCtrl.create({
			component: ContactFormPage,
			backdropDismiss: false,
			showBackdrop: true,
			cssClass: "fullscreen",
			componentProps: {
				contact: item
			}
		});

		modal.present();

		modal.onDidDismiss()
		.then((response:any) => {

			if (response && response.data) {
				//
			};

		});

	}

	/**
	 * Retorna o número de telefone formatado
	 * @param phone 
	 * @returns 
	  */
	public getPhoneFormatted(phone: string) {
		return mask(onlyNumbers(phone), "phone");
	}

	/**
	 * Abre a tela com os filtros
	 */
	public async openFilters() {

		let params:any = {
			filters: this.filters
		};

		let modal = await this.modalCtrl.create({
			component: ContactFiltersPage,
			backdropDismiss: false,
			showBackdrop: true,
			componentProps: {
				params: params
			}
		});

		modal.present();

		modal.onDidDismiss()
		.then((response:any) => {

			if (response && response.data && response.data.filters) {
				this.filters = response.data.filters;

				this.updateFilteredList();
			};

		});

	}

	/**
	 * Apresenta as opções de gerenciamento de contato disponíveis
	 * @param item 
	 */
	public async openContactActions(item:any) {

		let buttons:any[] = [
			{text: "Visualizar", role: "selected", icon: "eye-outline", handler: () => {
				this.openContactInfo(item);
				return true;
			}},
			{text: "Editar dados", icon: "create-outline", handler: () => {
				this.openContactForm(item);
			}},
			{text: "Excluir contato", icon: "trash-outline", handler: () => {
				this.removeContact(item);
			}}
		];

		this.actionSheetService.create({
			title: "Ações disponíveis",
			buttons: buttons
		});

	}

	/**
	 * Inicia o processo de remover um contato
	 * @param item 
	 * @param force 
	 */
	public async removeContact(item:any, force:boolean = false) {

		if (!force) {

			let buttons:any[] = [
				{text: "Sim", role: "selected", handler: () => {
					this.removeContact(item, true);
					return true;
				}},
				{text: "Não", handler: () => {
					return true;
				}},
			];
	
			this.actionSheetService.create({
				title: "Atenção!",
				subtitle: "Tem certeza de que deseja excluir este contato? Esta ação pode ser irreversível!",
				buttons: buttons
			});

			return true;

		}

		let loading = await this.loadingCtrl.create({ message: "Realizando operação..." });
		loading.present()
		.then(res => {

			this.contactService.deleteContact({idContato: item.id})
			.then(res => {

				this.toastService.show("Contato removido com sucesso!");
				this.refresh(null, loading);

			}).catch(err => {
				this.toastService.show("Não foi possível remover este contato no momento. " + httpErrMessage(err));
				loading.dismiss();
			});

		});

	}

	/**
	 * Abre a tela de detalhes do contato
	 * @param item 
	 */
	public async openContactInfo(item:any) {

		let modal = await this.modalCtrl.create({
			component: ContactInfoPage,
			backdropDismiss: false,
			showBackdrop: true,
			cssClass: "fullscreen",
			componentProps: {
				contactId: item.id
			}
		});

		modal.present();

		modal.onDidDismiss()
		.then((response:any) => {

			let actionKey:string|null = response?.data || null;

			if (actionKey == "edit") {
				this.openContactForm(item);
				
			} else if (actionKey == "remove") {
				this.removeContact(item);
			}

		});

	}

	/**
	 * Carrega a lista de contatos cadastrados
	 * @param keepFilters 
	 * @param refresher 
	 * @param loading 
	 */
	public async loadContacts(keepFilters:boolean = false, refresher?:any, loading?:any) {

		if (!loading) {
			loading = await this.loadingCtrl.create({ message: "Obtendo informações..." });
			loading.present();
		}

		this.isLoading = true;

		if (!keepFilters) {
			this.searchText = "";
			this.filters = {};
		}
		
		this.contactService.getList()
		.then((result:any[]) => {

			this.contacts = result || [];
			this.errorMessage = null;

			//Garante a ordenação por contatos criados recentemente
			this.contacts.sort((a:any, b:any) => {
				return a.dataCadastro > b.dataCadastro ? -1 : 1;
			});

			this.updateFilteredList();
			this.refresherComplete(refresher);
			this.isLoading = false;
			loading.dismiss();
			this.changeRef.detectChanges();

		}).catch((err:any) => {
			this.contacts = [];
			this.filteredList = [];
			this.errorMessage = httpErrMessage(err);
			this.refresherComplete(refresher);
			this.isLoading = false;
			loading.dismiss();
			this.changeRef.detectChanges();
		});

	}

	/**
	 * Finaliza o refresher
	 * @param refresher 
	 */
	private refresherComplete(refresher?:any) {

		if (refresher) {
			(refresher as RefresherCustomEvent).target.complete();
		}
		
	}

	/**
	 * Recarrega a lista
	 * @param refresher 
	 * @param loading 
	 */
	public refresh(refresher:any = null, loading:any = null) {
		this.loadContacts(true, refresher, loading);
	}

	/**
	 * Atualiza a lista filtrada com base nos parâmetros especificados
	 */
	public updateFilteredList() {

		let search:string = this.searchText || "";
		let filter:any = this.filters || {};

		this.filteredList = this.contacts.filter((item:any) => {

			let consideredDate:string = item.dataCadastro ? moment(item.dataCadastro).format("YYYY-MM-DD") : "";
			let startedAt:boolean = !filter.start_date || consideredDate >= filter.start_date;
			let endedAt:boolean = !filter.end_date || consideredDate <= filter.end_date;

			return startedAt && endedAt;
		});

		if (search && search != "" && search.length > 1) {

			search = search.toLowerCase();

			this.filteredList = this.filteredList.filter((item:any) => {
	
				let code:boolean = item.id && item.id.toString().toLowerCase().indexOf(search) >= 0;
				let name:boolean = item.nome && item.nome.toString().toLowerCase().indexOf(search) >= 0;
				let email:boolean = item.email && item.email.toString().toLowerCase().indexOf(search) >= 0;
				let telefone:boolean = item.telefone && item.telefone.toString().toLowerCase().indexOf(search) >= 0;
	
				return code || name || email || telefone;
			});

		}

		if (filter.ordination) {

			this.filteredList.sort((a: any, b: any) => {

				if (filter.ordination == "oldest_contact") {
					return a.dataCadastro < b.dataCadastro ? -1 : 1;

				} else if (filter.ordination == "newest_contact") {
					return a.dataCadastro > b.dataCadastro ? -1 : 1;
				}
			
				return 0;

			});

		}

	}

}
