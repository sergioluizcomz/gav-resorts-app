import { EventsService } from 'src/services/events/events.service';
import { AlertController, AlertButton } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {

	public selectedOptionsKeysList:number[] = [];

	constructor(
		private alertCtrl: AlertController,
		private events: EventsService
	) {

	}

	/**
	 * Abre um alerta customizado
	 * @param params 
	 */
	public async create(params:any) {

		let type:string = params.type || "warning";
		let title:string = params.title || (type == "success" ? "Sucesso!" : "Atenção!");
		let message:string = params.message || "";
		let icon:string = "fal fa-circle-exclamation";
		let cssClass:string = "custom-alert " + type;
		let buttons:AlertButton[] = params.buttons || null;

		this.selectedOptionsKeysList = JSON.parse(JSON.stringify(params.activeKeys || []));

		if (type == "success") {
			icon = "fal fa-circle-check";

		} else if (type == "error") {
			icon = "fal fa-circle-xmark";
		}

		icon = `<i class="${icon}"></i>`;

		let htmlMessage:string = 
		`<div class="custom-alert-content">
			<div class="custom-alert-icon">
				${ icon }
			</div>
			<div class="custom-alert-title">
				${ title }
			</div>
			<div class="custom-alert-message">
				${ message }
			</div>
		</div>`;

		if (!buttons || buttons.length == 0) {

			buttons = [
				// { text: "Voltar", cssClass: "btn-outline", handler: () => { return true; } },
				{ text: "OK", cssClass: "btn-primary", handler: () => { return true; } }
			];

		}

		if (type == "select") {

			let options:any[] = params.items || [];

			message = "";

			for (let i = 0; i < options.length; i++) {
				let item:any = options[i];

				let valueText:string = item[params.keyName || "name"];
		
				if (params.citySelect && item.state_abbrev) {
					valueText += " (" + item.state_abbrev + ")";
				}
		
				message += `
				<div class="custom-select-option ${this.selectedOptionsKeysList.indexOf(i) != -1 ? 'checked' : ''}">
					<div class="custom-select-option-checkbox"></div>
					<span class="custom-select-option-label">${ valueText }</span>
				</div>`
				
			}

			htmlMessage = 
			`<div class="custom-alert-content">
				<div class="custom-alert-title">
					Selecione<br/>
					<small>${params?.multiple ? '(Múltipla escolha)' : '(Escolha única)' }</small>
				</div>

				<div class="custom-alert-message select-content">
					<div class="custom-select-wrapper ${params?.multiple ? 'multiple-select' : ''}">
						${ message }
					</div>
				</div>
			</div>`;

			buttons =[
				{ text: "Cancelar", cssClass: "btn-outline", handler: () => {
					this.selectedOptionsKeysList = params.activeKeys;
				}},
				{ text: "Confirmar", cssClass: "btn-primary", handler: () => {
					return true;
				}}
			]
		}

		let options:any = {
			cssClass: cssClass,
			message: htmlMessage,
			backdropDismiss: params.backdropDismiss || false,
			buttons: buttons
		}

		let alert = await this.alertCtrl.create(options);

		//Ao abrir o alerta
		alert.present()
		.then(res => {

			//Caso o alerta seja um seletor
			if (type == "select") {
				this.initSelectEvents(params);

				//Ao fechar o seletor, envia as opções selecionadas para o componente
				alert.onDidDismiss()
				.then(res => {

					let valueRef:number[] = JSON.parse(JSON.stringify(this.selectedOptionsKeysList || []));

					this.events.publish("select-updated", {value: valueRef, formControlName: params.formControlName});

					this.selectedOptionsKeysList = [];
				});

			}

		});

	}

	/**
     * Inicia os eventos relacionados ao seletor
	 * @param params 
	 * 
     */
    public initSelectEvents(params:any) {

        let selectWrapper = document.getElementsByClassName("custom-select-wrapper")[0];

        if (selectWrapper) {

            let options = selectWrapper.getElementsByClassName("custom-select-option");
    
            if (options && options.length > 0) {
    
                for (let i = 0; i < options.length; i++) {
                    
                    let option = options[i];
    
                    option.addEventListener("click", () => {
                    
						option.classList.toggle("checked");

						//Verifica se a multipla seleção é permitida
						if (params?.multiple) {

							if (option.classList.contains("checked")) {
	
								if (this.selectedOptionsKeysList.indexOf(i) == -1) {
									this.selectedOptionsKeysList.push(i);
								}
								
							} else {
								
								this.selectedOptionsKeysList = this.selectedOptionsKeysList.filter((itemKey:number) => {
									return itemKey != i;
								});
	
							}

						} else {

							if (option.classList.contains("checked")) {

								if (this.selectedOptionsKeysList.indexOf(i) == -1) {
									this.selectedOptionsKeysList.push(i);
								}

								for (let j = 0; j < options.length; j++) {
									let option2 = options[j];

									if (j != i && option2.classList.contains("checked")) {
										option2.classList.remove("checked");

										this.selectedOptionsKeysList = this.selectedOptionsKeysList.filter((itemKey:number) => {
											return itemKey != j;
										});

									}
									
								}

							} else {
				                this.selectedOptionsKeysList = [];
                            }

						}

                    });
                    
                }
    
            }

        }

    }

}