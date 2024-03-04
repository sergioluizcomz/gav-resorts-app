import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastService {

	constructor(
		private toastCtrl: ToastController
	) {
		
	}

	/**
	 * Apresenta uma mensagem estilo toast de acordo com os parâmetros especificados
	 * @param message 
	 * @param position 
	 * @param duration 
	 */
	public async show(message:string, position: "top" | "middle" | "bottom" = "bottom", duration:number = 6000) {

		let cssClass:string = "custom-toast " + position;

		let toast = await this.toastCtrl.create({
			message: message,
			position: position,
			duration: duration,
			cssClass: cssClass,
			mode: "ios",
			buttons: [
				{text: "OK", role: "cancel"}
			]
		});

		this.toastCtrl.getTop()
		.then(async (res:any) => {

			if (res) {
				await this.toastCtrl.dismiss();
			}

			toast.present();

		});

	}

}
