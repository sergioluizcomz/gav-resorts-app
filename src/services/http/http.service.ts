// @ts-ignore
import { Md5 } from 'ts-md5/dist/md5';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkService } from '../network/network.service';
import { Storage } from '@ionic/storage';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx/index';
import { Platform } from '@ionic/angular';
import { timeout } from 'rxjs/operators';

@Injectable()
export class HttpService {

	public version:string|null = null;
	private token?:string|null = null;
	private timeoutAux:number = 60000;

	public memCache:any = {};

	constructor(
		private http: HttpClient,
		private networkService: NetworkService,
		private storageService: Storage,
		private file: File,
		private platform: Platform,
	) {
		
	}

	/**
	 * Atualiza o token
	 * @param token 
	 */
	public setToken(token?:string|null) {
		this.token = token;
	}

	/**
	 * Obtém o token
	 * @returns 
	 */
	public getToken():string|any|undefined {
		return this.token;
	}

	/**
	 * Gets HttpParam from object
	 * @param body
	 */
	private getParams(body = null): HttpParams {

		let params: any = null;

		if (body) {

			params = new HttpParams();

			Object.keys(body).forEach(key => {
				params = params.append(key, body[key]);
			});

		}

		return params;
	}

	/**
	 * Get request options
	 * @param body 
	 * @param urlencoded 
	 * @param responseType 
	 * @param headersAux 
	 * @param isExternalUrl 
	 * @returns 
	 */
	public getOptions(body = null, urlencoded: boolean = false, responseType = 'json', headersAux: any = null, isExternalUrl:boolean = false) {

		let options: any = {};

		options.responseType = responseType;

		if (body) {
			options.params = this.getParams(body);
		}

		let headers: any = {
			"Accept": "application/json, text/plain, */*",
			"Content-Type": "application/json",
		};

		if (urlencoded) {
			headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		if (!isExternalUrl) {

			//Envia a versão do App
			if (this.version) {
				headers['App-Version'] = this.version;
			}
	
			//Envia a plataforma usada ("mobile" ou "web")
			let platform:string = this.platform.is("ios") ? "ios" : (this.platform.is("android") ? "android" : "desktop");
			
			if(platform) {
				headers['App-Platform'] = platform;
			}
			
			if (this.token) {
				headers.Authorization = 'Bearer ' + this.token;
			}

		}

		options.headers = new HttpHeaders(headers);

		return options;

	}

	/**
	 * Get http request
	 * @param url 
	 * @param params 
	 * @param responseType 
	 * @param headersAux 
	 * @param timeoutReq 
	 * @returns 
	 */
	public get(url: string, params: any = {}, responseType: any = null, headersAux: any = null, timeoutReq: any = null): Promise<any> {

		let requestConfig:any = this.getOptions(params, false, responseType, headersAux);

		let r = this.http.get(url, requestConfig)
		.pipe(timeout(timeoutReq || this.timeoutAux));

        return r.toPromise();
	}

	/**
	 * Realiza uma requisição get com o retorno em blob
	 * @param url 
	 * @param params 
	 * @param optionsAux 
	 * @param timeoutReq 
	 * @param isExternalUrl 
	 * @returns 
	 */
	public getBlob(url: string, params: any = {}, optionsAux: any = {}, timeoutReq: any = null, isExternalUrl:boolean = false): Promise<any> {

		let requestConfig = this.getOptions(params, false, "blob", null, isExternalUrl);

		if (optionsAux.observe) {
			requestConfig.observe = optionsAux.observe;
		}

		let r = this.http.get(url, requestConfig)
		.pipe(timeout(timeoutReq || this.timeoutAux));

        return r.toPromise();

	}

	/**
	 * Post http request
	 * @param url 
	 * @param body 
	 * @param headers 
	 * @param responseType 
	 * @param timeoutReq 
	 * @returns 
	 */
	public post(url: string, body: any = null, headers: any = null, responseType: any = null, timeoutReq: any = null): Promise<any> {

        let requestConfig = this.getOptions(null, false, responseType);

		let r = this.http.post(url, body, requestConfig)
		.pipe(timeout(timeoutReq || this.timeoutAux));

        return r.toPromise();

	}

	/**
	 * Put http request
	 * @param url 
	 * @param body 
	 * @param headers 
	 * @param timeoutReq 
	 * @returns 
	 */
	public put(url: string, body:any = null, headers = null, timeoutReq: any = null): Promise<any> {

        let requestConfig = this.getOptions();

		let r = this.http.put(url, body, requestConfig)
		.pipe(timeout(timeoutReq || this.timeoutAux));

        return r.toPromise();

	}

	/**
	 * Delete http request
	 * @param url 
	 * @param params 
	 * @param headers 
	 * @param timeoutReq 
	 * @returns 
	 */
	public delete(url: string, params: any = {}, headers = null, timeoutReq: any = null): Promise<any> {

        let requestConfig = this.getOptions(params, true);

		let r = this.http.delete(url, requestConfig)
		.pipe(timeout(timeoutReq || this.timeoutAux));

        return r.toPromise();

	}

	/**
	 * Realiza o download de um arquivo
	 * @param url 
	 * @param dirPath 
	 * @param filePath 
	 * @param isExternalUrl 
	 */
	download(url:string, dirPath:string, filePath:string, params:any = {}, timeoutReq:number|null = 30000, isExternalUrl:boolean = false):Promise<any> {

		return new Promise((resolve, reject) => {
			
			this.getBlob(url, params, {}, timeoutReq, isExternalUrl)
			.then((blob) => {
				
				this.file.writeFile(dirPath, filePath, blob, { replace: true })
				.then((fileEntry: FileEntry) => {
					resolve(fileEntry);
					
				}).catch(reject);

			}).catch(reject);

		});

	}
	
	/**
	 * Obtém os dados do servidor quando houver conectividade, senão do storage
	 * @param forceStorage 
	 * @param url 
	 * @param storageKey 
	 * @param timeoutReq 
	 * @param params 
	 * @returns 
	 */
	public async getServerOrStorage(forceStorage: boolean, url: string, storageKey: string, timeoutReq: any = null, params:any = {}) {

		if (!forceStorage && this.networkService.isConnected()) {

			//Obtem as informações do servidor
			let data = await this.get(url, params, null, null, timeoutReq);

			//Atualiza as informações no storage
			this.storageService.set(storageKey, data);

			return data;

		} else {
			return await this.storageService.get(storageKey);
		}
		
	}

}