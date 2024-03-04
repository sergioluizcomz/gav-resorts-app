import { EventsService } from './../../../services/events/events.service';
import { formValidator, invertDate } from 'src/utils/functions';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
	selector: 'page-contact-filters',
	templateUrl: 'contact-filters.page.html',
})
export class ContactFiltersPage {

	@Input() params:any = null;

	public form:FormGroup;

	public ordinationOptions:any[] = [];

	public minStartDate:string;
    public maxStartDate:string;
    public minEndDate:string;
    public maxEndDate:string;

	public minDateAtGeral:string = moment().subtract(10, "years").format("YYYY-MM-DD");
    public maxDateAtGeral:string = moment().add(10, "years").format("YYYY-MM-DD");

	constructor(
		private formBuilder: FormBuilder,
		private modalCtrl: ModalController,
		private eventsService: EventsService,
	) {

		moment.locale("pt-br");
		
	}
	
	//Ao fechar o modal
	ngOnDestroy() {
		
	}

	//Ao carregar o modal
	ngOnInit() {

		let navParams:any = this.params || {};
		let filters:any = navParams?.filters || {};

		this.form = this.formBuilder.group({
			ordination: new FormControl(filters.ordination, []),
			start_date: new FormControl(filters.start_date, [formValidator("date")]),
			end_date: new FormControl(filters.end_date, [formValidator("date")]),
		});

		this.ordinationOptions = [
			{label: 'Contato mais<br/>antigo', value: 'oldest_contact', icon_label: null},
			{label: 'Contato mais<br/>novo', value: 'newest_contact', icon_label: null},
		];

		//Ao alterar a data inicial de entrega
		this.form.get("start_date")?.valueChanges.subscribe((value:string) => {

			let minEndDateAux:string = this.minDateAtGeral;
			let maxEndDateAux:string = this.maxDateAtGeral;

			//Verifica se é uma data válida
			if (value && value.length == 8) {
				let dateAux:string = invertDate(value, "br", null, "-");

				if (moment(dateAux).isValid()) {
					minEndDateAux = dateAux;
				}

			}

			this.minEndDate = minEndDateAux;
			this.maxEndDate = maxEndDateAux;

			this.updateEndDateValidators();

		});

		//Ao alterar a data final de entrega
		this.form.get("end_date")?.valueChanges.subscribe((value:string) => {

			let minStartDateAux:string = this.minDateAtGeral;
			let maxStartDateAux:string = this.maxDateAtGeral;

			//Verifica se é uma data válida
			if (value && value.length == 8) {
				let dateAux:string = invertDate(value, "br", null, "-");

				if (moment(dateAux).isValid()) {
					maxStartDateAux = dateAux;
				}

			}

			this.minStartDate = minStartDateAux;
			this.maxStartDate = maxStartDateAux;

			this.updateStartDateValidators();

		});

	}

	/**
	 * Atualiza a validação do campo "Data mínima de criação"
	 * @param verifyValidity 
	 */
	public updateStartDateValidators(verifyValidity:boolean = false) {

		this.form.get("start_date")?.setValidators([formValidator("date", this.minStartDate, this.maxStartDate)]);

		if (verifyValidity) {
			this.form.get("start_date")?.updateValueAndValidity();
		}

	}

    /**
	 * Atualiza a validação do campo "Data máxima de criação"
	 * @param verifyValidity 
	 */
	public updateEndDateValidators(verifyValidity:boolean = false) {

		this.form.get("end_date")?.setValidators([formValidator("date", this.minEndDate, this.maxEndDate)]);

		if (verifyValidity) {
			this.form.get("end_date")?.updateValueAndValidity();
		}

	}

	/**
	 * Limpa os filtros
	 */
	public clear() {
		this.form.reset();
	}

	/**
	 * Aplica o filtro
	 */
	public submit() {

		//Lança o evento de submit
		this.eventsService.publish("form-submit", this.form.valid);

		//Verifica se o formulário é válido
		if (this.form.valid) {

			//Valida as datas selecionadas
			let filters = this.form.value;
			
			if (filters.start_date) {
				filters.start_date = invertDate(filters.start_date, "br", null, "-");
			}

			if (filters.end_date) {
				filters.end_date = invertDate(filters.end_date, "br", null, "-");
			}

			if (filters.start_date && filters.end_date) {

				if (filters.end_date < filters.start_date) {

					this.form.get("end_date")?.setErrors({
						message: ("Essa data deve ser após " + invertDate(filters.start_date, "us", "-", "/"))
					});

					return true;

				} else if (filters.start_date > filters.end_date) {

					this.form.get("start_date")?.setErrors({
						message: ("Essa data deve ser antes de " + invertDate(filters.end_date, "us", "-", "/"))
					});

					return true;

				}

			}
	
			for (let key in filters) {
	
				if (filters && filters[key] && filters[key].code && filters[key].code == "all") {
					filters[key] = null;
				}
	
			}
	
			this.dismiss({filters: filters});

		}

	}

	/**
	 * Fecha o modal
	 * @param data 
	 */
	public dismiss(data?: any) {
		this.modalCtrl.dismiss(data);
	}

}
