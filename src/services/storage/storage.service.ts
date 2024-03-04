import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageService {

    private _storage:Storage;

	constructor(
		private storage: Storage
	) {

		this.init();
	}

	/**
	 * Inicializa o Storage
	 */
	async init() {
		this._storage = await this.storage.create();
	}

	/**
	 * Retorna um dado do storage
	 * @param key 
	 */
	get(key: string) {
        return this._storage.get(key);
	}

	/**
	 * Grava um dado no storage
	 * @param key 
	 * @param data 
	 */
	set(key:string, data:any = null) {
		return this._storage.set(key, data);
	}

	/**
	 * Remove um item do storage
	 * @param key 
	 */
	remove(key:string) {
		return this._storage.remove(key);
	}

	/**
	 * Procura um item na lista
	 * @param list 
	 * @param searchKey 
	 * @param searchVlue 
	 */
	findIndexList(list:any[], searchKey:string, searchValue:any) {

		let idx = -1;

		if (list && list.length) {

			list.forEach((item, i) => {
				if (item[searchKey] == searchValue) {
					idx = i;
					return;
				}
			});

		}

		return idx;

	}

	/**
	 * Verifica se a chave existe no storage e possui valor
	 * @param key 
	 */
	exists(key:string) {

		if (key) {

			this._storage.get(key)
			.then(result => {
				return !!result;

			}).catch(err => {
				return false;
			});

		} else {
			return false;
		}

	}

	/**
	 * Obtém todas as chaves de posições no storage
	 * @returns 
	 */
	keys() {
		return this._storage.keys();
	}

	/**
	 * Limpa os dados de armazenamento offline e memória
	 * @returns 
	 */
	clearData() {

		return new Promise((resolve, reject) => {

			this.keys()
			.then((storageKeys:string[]) => {

				let storagePromises:any[] = [];

				//Informações que devem ser mantidas no storage
				let protectedKeys:any[] = ["token", "user", "activity"];

				for (let i = 0; i < storageKeys.length; i++) {
					let key:string = storageKeys[i];

					if (!protectedKeys.includes(key)) {
						storagePromises.push(this.storage.remove(key));
					}

				}

				Promise.all(storagePromises)
				.then(res => {
					resolve(true);

				}).catch(err => {
					reject("Não foi possível limpar seus dados de armazenamento neste momento, tente novamente mais tarde.");
				});

			}).catch(err => {
				reject("Não foi possível acessar seus dados de armazenamento neste momento, tente novamente mais tarde.");
			});

		});

	}

}
