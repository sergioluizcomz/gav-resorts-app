import { environment } from 'src/environments/environment';
import { HttpService } from 'src/services/http/http.service';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class ContactService {

	//Evento de criação/edição de um novo contato
	public contactUpdated: EventEmitter<any> = new EventEmitter();

	constructor(
		private httpService: HttpService,
	) {

	}

	/**
	 * Obtém a lista de contatos cadastrados
	 * @param params 
	 * @param forceStorage 
	 * @returns 
	 */
    public getList(params:any = {}, forceStorage:boolean = false): Promise<any[]> {

		let url:string = environment.api.url + "contatos/getcontatos";
		let storageKey:string = "contact-list";

        return this.httpService.getServerOrStorage(forceStorage, url, storageKey, null, params);
    }

	/**
	 * Obtém as informações de um respectivo contato
	 * @param params 
	 * @returns 
	 */
    public getContactInfo(params:any = {}): Promise<any[]> {

		let url:string = environment.api.url + "contatos/getcontatobyid";

        return this.httpService.get(url, params);
    }

	/**
	 * Realiza a criação de um novo contato
	 * @param body 
	 * @returns 
	 */
    public createContact(body:any): Promise<any[]> {

		let url:string = environment.api.url + "contatos/createcontato";

        return this.httpService.post(url, body);
    }

	/**
	 * Realiza a edição de um respectivo contato
	 * @param data 
	 * @returns 
	 */
    public updateContact(data:any = {}): Promise<any[]> {

		let url:string = environment.api.url + "contatos/updatecontato";

        return this.httpService.put(url, data);
    }
	
	/**
	 * Realiza a edição de um respectivo contato
	 * @param data 
	 * @returns 
	 */
    public deleteContact(data:any = {}): Promise<any[]> {

		let url:string = environment.api.url + "contatos/deletecontato";

        return this.httpService.delete(url, data);
    }

}
