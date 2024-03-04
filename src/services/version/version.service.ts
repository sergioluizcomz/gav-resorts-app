import { HttpService } from 'src/services/http/http.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx/index';

@Injectable()
export class VersionService {

	public version:string;

	constructor(
		private appVersion: AppVersion,
		private httpService: HttpService,
	) {

	}

	/**
	 * Obtém versão atual do app
	 */
	public get() {
		return this.version || null;
	}

	/**
	 * Inicializa a obtenção da versão atual do APP
	 * @returns 
	 */
	public init() {

		return new Promise((resolve, reject) => {

			this.appVersion.getVersionNumber()
			.then(version => {

				this.version = version;
				this.httpService.version = version;
				
				resolve(version);

			}).catch(err => {

				let versionAux:string = environment.debug ? "1.0.0" : "";

				this.version = versionAux;
				this.httpService.version = versionAux;
				
				resolve(versionAux);
			});

		});

	}

}