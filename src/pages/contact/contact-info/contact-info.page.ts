import { httpErrMessage, mask, onlyNumbers } from 'src/utils/functions';
import { LoadingController, ModalController } from '@ionic/angular';
import { Component, Input } from '@angular/core';
import { ContactService } from 'src/services/contact/contact.service';
import { ToastService } from 'src/services/toast/toast.service';
import * as moment from 'moment';

@Component({
	selector: 'page-contact-info',
	templateUrl: 'contact-info.page.html',
})
export class ContactInfoPage {

	@Input() contactId:number;

    public contact:any = null;

	constructor(
		private modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
		private contactService: ContactService,
        private toastService: ToastService
	) {

		moment.locale("pt-br");
		
	}
	
	//Ao fechar o modal
	ngOnDestroy() {
		
	}

	//Ao carregar o modal
	ngOnInit() {
        this.loadContactInfo();
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
     * Obtém as informações do respectivo contato
     */
    public async loadContactInfo() {

        if (this.contactId) {

            let loading = await this.loadingCtrl.create({ message: "Obtendo informações..." });
            loading.present()
            .then(res => {
    
                this.contactService.getContactInfo({idContato: this.contactId})
                .then(res => {

                    this.contact = res;
                    loading.dismiss();
    
                }).catch(err => {
                    this.toastService.show("Não foi possível obter as informações deste contato no momento. " + httpErrMessage(err));
                    this.dismiss();
                    loading.dismiss();
                });
    
            });

        } else {
            this.toastService.show("Contato não encontrado, tente novamente mais tarde.");
            this.dismiss();
        }

    }
	
	/**
	 * Fecha o modal
	 * @param actionKey 
	 */
	public dismiss(actionKey?:"edit"|"remove") {
		return this.modalCtrl.dismiss(actionKey);
	}

}
