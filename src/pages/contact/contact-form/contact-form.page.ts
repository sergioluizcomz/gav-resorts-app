import { EventsService } from './../../../services/events/events.service';
import { formValidator, httpErrMessage, onlyNumbers } from 'src/utils/functions';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ToastService } from 'src/services/toast/toast.service';
import { ContactService } from 'src/services/contact/contact.service';
import * as moment from 'moment';

@Component({
	selector: 'page-contact-form',
	templateUrl: 'contact-form.page.html',
})
export class ContactFormPage {

	@Input() contact:any = null;

	public form:FormGroup;
	public refuseTypes:any[] = [];

	public errorMessage:string|null = null;

	public modalImages:any[] = [];
	public maxImages:number = 1;
	
	constructor(
		private formBuilder: FormBuilder,
		private modalCtrl: ModalController,
		private eventsService: EventsService,
		private loadingCtrl: LoadingController,
		private contactService: ContactService,
		private toastService: ToastService,
	) {

		moment.locale("pt-br");
		
	}
	
	//Ao fechar o modal
	ngOnDestroy() {
		
	}

	//Ao carregar o modal
	async ngOnInit() {

		this.buildForm();

	}

	/**
	 * Constrói o formulário
	 */
	public buildForm() {

		this.form = this.formBuilder.group({
			name: new FormControl({value: null, disabled: false}, [formValidator("required")]),
			phone: new FormControl({value: null, disabled: false}, [formValidator("required"), formValidator("phone")]),
			email: new FormControl({value: null, disabled: false}, [formValidator("required"), formValidator("email")]),
		});

		if (this.contact) {
			this.form.get("name")?.setValue(this.contact?.nome || null);
			this.form.get("phone")?.setValue(this.contact?.telefone ? onlyNumbers(this.contact.telefone) : null);
			this.form.get("email")?.setValue(this.contact?.email || null);

			if (this.contact.foto) {
				this.modalImages = [this.contact.foto]
			}

		}

	}

	/**
	 * Salva as informações
	 */
	public async submit() {

		//Lança o evento de submit
		this.eventsService.publish("form-submit", this.form.valid);

		//Verifica se o formulário é válido
		if (this.form.valid) {

			/* if (!this.modalImages || this.modalImages.length == 0) {
				this.toastService.show("Adicione ao menos uma foto antes de prosseguir.");
				return;
			} */

			let loading = await this.loadingCtrl.create({
				message: "Verificando informações..."
			});
			
            loading.present()
			.then(() => {

				let formData:any = this.form.value;

				let body:any = {
					nome: formData?.name || "",
					email: formData?.email || "",
					telefone: formData?.phone ? onlyNumbers(formData?.phone) : "",
					foto: null,
					dataCadastro: null
				}

				if (this.contact) {
					body.id = this.contact.id;
				}

				//Correção por conta de fuso horário
				let fixedDate:number = moment().toDate().getTime() - ((3 * 60 * 60) * 1000);
				body.dataCadastro = new Date(fixedDate).toISOString();

				if (this.modalImages && this.modalImages[0]) {
					body.foto = this.modalImages[0];
				}

				(this.contact ? this.contactService.updateContact(body) : this.contactService.createContact(body))
				.then(async (res:any) => {

					await this.dismiss();
					this.toastService.show("Contato "+ (this.contact ? 'atualizado' : 'cadastrado') +" com sucesso!");
					this.contactService.contactUpdated.emit(loading);

				}).catch(err => {
					this.errorMessage = httpErrMessage(err);
					loading.dismiss();
				});
				
            });

		}

	}

	/**
	 * Fecha o modal
	 * @param data 
	 */
	public dismiss(data:any = null) {
		return this.modalCtrl.dismiss(data);
	}

}
