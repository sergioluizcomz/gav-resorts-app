import { EventsService } from './../events/events.service';
import { StorageService } from './../storage/storage.service';
import { HttpService } from 'src/services/http/http.service';
import { environment } from 'src/environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import * as bcrypt from "bcryptjs";
import * as moment from 'moment';

@Injectable()
export class AuthService {

	//Status de autenticação
    public authInitialized:boolean = false;
    public authCurrentState:boolean = false;

	public userChanged: EventEmitter<any> = new EventEmitter();
	public loginEvent: EventEmitter<any> = new EventEmitter();
	public logoutEvent: EventEmitter<any> = new EventEmitter();

	public user:any = null;
	public isFirstAccess:boolean = false;

	private isRefreshingToken: boolean = false;

	public accessTokenExpired:boolean = false;
	public accessTokenRefreshed:boolean = false;

	constructor(
        private httpService: HttpService,
        private storageService: StorageService,
		private eventsService: EventsService,
	) {

		//Ouve o evento de expiração do token
		this.eventsService.subscribe("unauthenticated", () => {

			if (!this.isRefreshingToken) {
				this.isRefreshingToken = true;

				this.refreshToken()
				.then(res => {

					this.isRefreshingToken = false;

				}).catch(err => {

					if (this.user) {
						this.logout();
					}

					this.isRefreshingToken = false;
				});

			}

		});

	}

	/**
	 * Autenticação inicial
	 * @return User
	 */
	public init() {

		return new Promise((resolve, reject) => {

			this.storageService.get("token")
			.then((token) => {

				if (token) {

					this.httpService.setToken(token);

					this.storageService.get("user")
					.then(async (user) => {

						if (user) {

							this.user = user;
							user.already_logged = true;

							this.loginEvent.emit(user);

							resolve(user);

						} else {
							resolve(null);
						}

					}).catch(err => {
						resolve(null);
					});

				} else {
					resolve(null);
				}

			});

		});

	}

	/**
	 *  Tenta obter um novo token pelo refresh token
	 */
	public refreshToken(): Promise<any> {

		return new Promise((resolve, reject) => {

			this.storageService.get("user")
			.then((user:any) => {

				if (user && user.login && user.password) {
					
					var body:any = {
						login: user.login,
						senha: user.password
					};

					return this.onlineLogin(body);
			
				} else {
					reject(null);
				}

			}).catch(err => {
				reject(null);
			});

		});

	}

	/**
	 * Retorna usuário atual
	 * @return User
	 */
	public getUser() {
		return this.user;
	}

    /**
	 * Login
	 * @param email
	 * @param password
	 */
	public async login(data:any = {}): Promise<any> {

		return this.onlineLogin(data)
		.then((user:any) => {

			this.user = user;
			user.already_logged = false;

			this.loginEvent.emit(user);
			this.storageService.set("user", user);

			if (data.is_remember_me) {
				this.storageService.set("last-user-logged", data.login);

			} else {
				this.storageService.set("last-user-logged", null);
			}

			// Emitir evento de autenticação
			this.authCurrentState = true;

		});

	}

	/**
	 * Realiza logout da aplicação
	 * @param remoteRequests 
	 */
	public async logout() {

		this.user = null;
		this.userChanged.emit();
		this.storageService.remove("user");
		this.storageService.remove("token");

		this.httpService.setToken(null);
		
		this.authCurrentState = false;
		
		this.logoutEvent.emit();

	}

	/**
     * Verifica a autenticação no app realizando se necessário as consultas no storage
     * @returns Promise
     */
	public async isAuthenticated() {

        if (this.authInitialized == false) {

            let status: boolean = false;

            // Buscar informações no storage
            var token = await this.storageService.get("token");
            var user = await this.storageService.get("user");

            if (token && user) {

                status = true;

                // Setar token de autenticação
                this.httpService.setToken(token);

            }

            //Atualizar status atual
            this.authCurrentState = status;

            //Salvar referência do status atual
            this.authInitialized = true;

            return status;

        } else {
            return this.authCurrentState;
        }

    }

    /**
	 * Realiza o login de maneira online
	 * @param email
	 * @param password
	 */
	private async onlineLogin(data:any = {}): Promise<any>{

		let url = environment.api.url + "auth/login";

		var body = {
			//grant_type: "password",
			//client_secret: environment.api.secret,
			//client_id: environment.api.id,
			//scope: "*",
			login: data.login,
			senha: data.senha || data.password
		};

		return this.httpService.get(url, body)
		.then(async (res:any) => {

			if (res && res.token) {

				let token:string = res.token;
				let expirationDate:string = res?.expirationDate ? moment(res?.expirationDate).format("YYYY-MM-DD HH:mm:ss") : moment().add(1, "day").format("YYYY-MM-DD HH:mm:ss");
	
				this.httpService.setToken(token);
				this.storageService.set("token", token);
	
				let user:any = data;
	
				return this.passwordHash(data.password)
				.then(async (passwordHash) => {
	
					user.password_hash = passwordHash;
					user.access_token = token;
					user.token_expires_in = expirationDate;
					user.is_remember_me = data.is_remember_me || false;
	
					return user;
				});

			} else {
				return Promise.reject("Credenciais inválidas, tente novamente.");
			}

		}).catch((err:any) => {

			if (typeof err === "string") {
				return Promise.reject(err);
			}

			let message:string;

			if (err.status == 401) {

				if (err.error && err.error.error && err.error.error == "invalid_credentials") {
					message = "Dados inválidos";

				} else if (err.error && err.error.error && err.error.error == "access_denied" && err.error.hint) {
					message = err.error.hint;

				} else {
					message = "Acesso não autorizado.";
				}

			} else {
				message = "O servidor não respondeu.";
			}

			return Promise.reject(message);

		});

	}

    /**
	 * Cria um hash de uma senha
	 * @param password
	 * @param salt
	 */
	private passwordHash(password:string = "", salt:number = 10): Promise<string|null> {

		return new Promise((resolve, reject) => {

			if (password) {

				bcrypt.hash(password.toString(), salt, function (err:any, hash:string) {
	
					if (err) {
						reject(err);

					} else {
						resolve(hash);
					}
	
				});

			} else {
				resolve(null);
			}

		});

	}

}
