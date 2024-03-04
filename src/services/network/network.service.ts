import { Network, NetworkPlugin } from '@capacitor/network';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class NetworkService {

    public networkChanged: EventEmitter<any> = new EventEmitter();

	private network:NetworkPlugin = Network;
	private type:string = "none"; //"wifi" | "cellular" | "none" | "unknown"

	constructor(
	) {

		this.init();
	}

	/**
	 * Obtém o tipo de conexão com a internet
	 * @returns 
	 */
	public getType() {
		return this.type;
	}

	/**
	 * Verifica se o dispositivo tem conexão com internet
	 * @returns 
	 */
	public isConnected() {
		return this.type !== "none";
	}

	/**
	 * Inicializa o service relacionado à conexão com a internet do dispositivo
	 */
	private init() {

		this.network.getStatus()
		.then((res:any) => {
			this.type = res.connectionType;
		});

		this.network.addListener("networkStatusChange", (res:any) => {
			this.type = res.connectionType;
			this.networkChanged.emit(this.isConnected());
		});

	}

}
