import { AuthService } from './../../services/auth/auth.service';
import { environment } from './../../environments/environment';
import { HttpService } from './../../services/http/http.service';
import { replaceAccents, httpErrMessage, filterObjectKeys, mask, onlyNumbers } from 'src/utils/functions';
import { EventsService } from './../../services/events/events.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { Component, Input } from '@angular/core';

/**
 * Esta página deve ser aberta como um modal
 */
@Component({
	selector: 'select-modal-page',
	templateUrl: 'select-modal.page.html',
})
export class SelectModalPage {

	@Input() formControlName:string;
	@Input() title:string;
	@Input() subtitle:string;
	@Input() keyName:string = "name";
	@Input() multiple:boolean = false;
	@Input() boldOptionLabel:boolean = false;
	@Input() items:any[] = [];
	@Input() searchPlaceholder:string = "Pesquise por uma opção...";
	
	@Input() selectedOptionsKeysList:number[] = [];
	@Input() ajaxRoute:string|null = null;
	@Input() ajaxParams:any = {};
	@Input() formControlValue:any = null;
	
	public filteredItems:any[] = [];
	public form:FormGroup;
	public ajaxAlreadyLoaded:boolean = false

	public ajaxError:string|null = null;

	public searchTimeout:any = {};
	public valueTimeout:number = 500;

	public someOptionVisible:boolean = false;
	public checkEventsActive:boolean = false;

	public user:any = null;

	public isLoadingOptions:boolean = false;

	public checkedAll:boolean = false;
	
	constructor(
		private formBuilder: FormBuilder,
		private modalCtrl: ModalController,
		private httpService: HttpService,
		private eventsService: EventsService,
		private authService: AuthService,
	) {

		this.buildForm();

	}

	//Ao carregar o componente
	ngOnInit() {

		this.user = this.authService.getUser();

		if (!this.ajaxRoute) {
			this.valueTimeout = 0;
		}
		
		if (this.items && this.items.length > 0) {

			if (this.ajaxRoute) {
				this.ajaxAlreadyLoaded = true;
			}

			//Inicia as opções
			this.filteredItems = this.items.map((elm:any) => {

				elm.is_option_visible = true;
				this.someOptionVisible = true;

				return elm;
			});

			if (this.filteredItems && this.filteredItems.length > 0) {

				if (!this.ajaxRoute && !this.checkEventsActive) {
					this.checkEventsActive = true;
				}

			}

			//Já preenche a opção atualmente selecionada
			if (this.formControlValue) {

				for (let i = 0; i < this.items?.length; i++) {
					let element:any = this.items[i];

                    if (this.multiple) {

                        var filteredElement = filterObjectKeys(element, ["is_option_visible", "is_option_checked"], true);

                        const objectFound = this.formControlValue.find((value:any) => {

                            var objectFound:boolean = true;
                            var filteredValue = filterObjectKeys(value, ["is_option_visible", "is_option_checked"], true);

                            for (var key of Object.keys(filteredElement)) {
                                objectFound = objectFound && filteredElement[key] === filteredValue?.[key];
                            }

                            return objectFound;

                        });

                        if (objectFound) {
                            this.selectedOptionsKeysList.push(i);
                        }

                    } else {

                        if (JSON.stringify(filterObjectKeys(element, ["is_option_visible", "is_option_checked"], true)) == 
						JSON.stringify(filterObjectKeys(this.formControlValue, ["is_option_visible", "is_option_checked"], true)) && 
						this.selectedOptionsKeysList.indexOf(i) == -1) {
						    this.selectedOptionsKeysList.push(i);
                        }

                    }
					
				}

			}

		}

		//Ouve a mudança do campo search
		this.eventsService.unsubscribe("input-value-changed");
		this.eventsService.subscribe("input-value-changed", (data:any) => {

			let formControlName:string|null = data?.formControlName || null;
			
			if (formControlName == "search") {

				if (this.ajaxRoute) {
					this.isLoadingOptions = true;
				}

				let search:string = String(data?.value || "").trim();
				
				if (this.searchTimeout) {
					clearTimeout(this.searchTimeout);
				}
		
				this.searchTimeout = setTimeout(() => {
	
					if (this.ajaxRoute && search.length > 1) {
	
						this.ajaxAlreadyLoaded = true;
	
						let url:string = environment.api.url + this.ajaxRoute;
						this.ajaxParams.search = search;
						
						let promise:Promise<any>|null = null;

						promise = this.httpService.get(url, this.ajaxParams);

						promise
						.then(res => {
				
							this.ajaxError = null;
	
							//Não substituir a lista, usar esse método com .push() para manter referência dos indices que já foram carregados
	
							if (this.items && this.items.length > 0) {
	
								if (res && res.length > 0) {
	
									let ignoredKeys:string[] = [
										"is_option_visible", "is_option_checked"
									];

									let mainKeys:string[] = [];
	
									for (let i = 0; i < res.length; i++) {
										let serverItem:any = res[i];
	
										let serverItemAlreadyInList:boolean = false;
										
										for (let j = 0; j < this.items.length; j++) {
											let itemAlreadyLoaded:any = this.items[j];
	
											let a:any = null;
											let b:any = null;

											a = filterObjectKeys(itemAlreadyLoaded, ignoredKeys, true);
											b = filterObjectKeys(serverItem, ignoredKeys, true);

											if (JSON.stringify(a) == JSON.stringify(b)) {
												serverItemAlreadyInList = true;
												break;
											}
											
										}
	
										if (!serverItemAlreadyInList) {
											this.items.push(serverItem);
										}
										
									}
	
									this.searchChanged(search);
	
								} else {
	
									this.items = [];
	
									this.filteredItems = this.filteredItems.map((elm:any) => {
										elm.is_option_visible = false;
										return elm;
									});
	
									this.searchChanged(search);
	
								}
	
							} else {
								this.items = res || [];
								this.searchChanged(search);
							}
	
							//this.ajaxIsLoading = false;
		
						}).catch(err => {
		
							this.items = [];
							this.selectedOptionsKeysList = [];
							//this.ajaxIsLoading = false;
							this.ajaxError = "Não foi possível obter as opções disponíveis.<br/>" + httpErrMessage(err);
	
							this.searchChanged(search);
						});
	
					} else {
						//this.ajaxIsLoading = false;
						this.ajaxAlreadyLoaded = true;
						this.searchChanged(search);
					}
	
					
				}, this.valueTimeout);

			}
	
		});

	}

	/**
	 * Ao clicar no botão a direita no header
	 */
	public rightButtonCallback() {
		//
	}

	/**
	 * Obtém o texto que deve ser apresentado em cada opção
	 * @param option 
	 * @returns 
	 */
	public getOptionLabel(option:any) {

		let value:string = option[this.keyName || "name"];

		return value;
	}

	/**
	 * Retorna o número de telefone formatado
	 * @param phone 
	 * @returns 
	 */
	public getPhoneFormatted(phone:string) {
		return mask(onlyNumbers(phone), "phone");
	}

	/**
	 * Retorna o documento formatado
	 * @param doc 
	 * @returns 
	 */
	public getDocFormatted(doc:string) {

		let docMask:string = mask(onlyNumbers(doc), "doc");

		if (onlyNumbers(doc).length > 11) {
			return "CNPJ: " + docMask;
		}

		return "CPF: " + docMask;
	}

	/**
	 * Atualiza a lista de opções com base no valor do campo de busca
	 * @param search 
	 */
	public searchChanged(search?:string) {

		this.someOptionVisible = false;

		this.filteredItems = this.items.map((elm:any) => {
				
			if (search && search.trim() != "" && search.length > 1) {

				let regex = new RegExp(replaceAccents(search), "gi");
				let pos = replaceAccents(this.getOptionLabel(elm) + (elm.plate ? (" " + elm.plate) : "")).search(regex);

				elm.is_option_visible = pos >= 0;

			} else {
				elm.is_option_visible = true;
			}

			if (!this.someOptionVisible && elm.is_option_visible) {
				this.someOptionVisible = true;
			}

			return elm;

		});

		if (!this.ajaxRoute && !this.checkEventsActive) {
			this.checkEventsActive = true;
		}

		this.isLoadingOptions = false;
	}


	/**
	 * Constrói o formulário
	 */
	public buildForm() {

		this.form = this.formBuilder.group({
			search: new FormControl({value: null, disabled: false}, []),
		});

	}

	/**
	 * Salva a opção selecionada
	 */
	public submit() {

		let valueRef:number[] = JSON.parse(JSON.stringify(this.selectedOptionsKeysList || []));
		
		this.modalCtrl.dismiss({selectedKey: valueRef, list: this.filteredItems})
		.then(res => {
	
			this.eventsService.publish("select-updated", {value: valueRef, formControlName: this.formControlName, items: this.items});
	
			this.selectedOptionsKeysList = [];

		});

	}

	/**
	 * Fecha a página atual
	 */
	public dismiss() {
		this.modalCtrl.dismiss();
	}

	/**
	 * Ao selecionar a opção
	 * @param option 
	 * @param index 
	 */
	public async onCheck(option:any, index:number) {
		
		option.is_option_checked = !option.is_option_checked;
		
		//Verifica se a multipla seleção é permitida
		if (this.multiple) {

			let activeKeys:number[] = [];

			for (let i = 0; i < this.filteredItems.length; i++) {
				let itemAux:any = this.filteredItems[i];
				
				if (itemAux.is_option_checked) {
					activeKeys.push(i);
				}

			}

			this.selectedOptionsKeysList = activeKeys;

		} else if (option.is_option_checked) {

			this.selectedOptionsKeysList = [index];

			for (let j = 0; j < this.filteredItems.length; j++) {
				
				this.filteredItems[j].is_option_checked = j == index;
			}

		} else {
			this.selectedOptionsKeysList = [];
		}

		// Verifica se todos os options estão checados
		if (this.filteredItems.length > 1 && this.filteredItems.every(v => v.is_option_checked === true)) {
			this.checkedAll = true;
		} else {
			this.checkedAll = false;
		};

	}	

	/**
	 * Seleciona todos os itens do seletor
	 */
	public async onCheckAll(){
		
		// Invert status geral de input checkAll
		this.checkedAll = !this.checkedAll;
		
		// Invert chechagem de todos os inputs para posterior seleção
		this.filteredItems.map((item:any, index:number) => {
			return item.is_option_checked = !this.checkedAll;
		})

		// seleiona inputs necessários
		this.filteredItems.map((item:any, index:number) => {
			this.onCheck(item, index);
			
		})

	}

}
