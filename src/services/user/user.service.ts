import { StorageService } from './../storage/storage.service';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/services/http/http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

	constructor(
		private httpService: HttpService,
		private storageService: StorageService
	) {

	}

	/**
	 * Atualiza os dados do usuário
	 * @param body 
	 * @returns 
	 */
	public update(body:any = {}) {

		let url:string = environment.api.url + "auth/update";
		return this.httpService.put(url, body);
	}

}
