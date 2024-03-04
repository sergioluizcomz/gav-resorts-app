import { ActionSheetButton, ActionSheetController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable()
export class ActionSheetService {

	constructor(
		private actionSheetCtrl: ActionSheetController
	) {

	}

	/**
	 * Abre um alerta customizado
	 * @param params 
	 */
	public async create(params:any) {

		let title:string = params.title || "Selecione uma opção";
		let subtitle:string = params.subtitle || null;
		let cssClass:string = "custom-action-sheet";
		let buttons:ActionSheetButton[] = params.buttons || null;

		if (buttons && buttons.length > 0) {

			buttons.push({icon: "close-outline", text: "Cancelar", role: "cancel", handler: () => { return true; }});

			let alert = await this.actionSheetCtrl.create({
				cssClass: cssClass,
				backdropDismiss: params.backdropDismiss === undefined ? true : params.backdropDismiss,
				header: title,
				subHeader: subtitle,
				buttons: buttons
			});

			alert.present();

		} else {
			console.error("Não é possível abrir um action-sheet sem opções");
		}

	}

}