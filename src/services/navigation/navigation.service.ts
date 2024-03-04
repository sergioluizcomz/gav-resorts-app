import { EventsService } from 'src/services/events/events.service';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Injectable()
export class NavigationService {

    @Output('onParamsChange') paramsChangeEvent = new EventEmitter<any>(); 

	public navParams:any = null;
	public previousUrlStr: string = "/";
	public currentUrlStr: string = "";

	private history: string[] = [];

	constructor(
		private router: Router,
		private location: Location,
		private eventsService: EventsService
	) {

		this.currentUrlStr = this.router.url;

		this.router.events.subscribe((event: any) => {

			if (event instanceof NavigationStart) {
				
				//Atualiza os parâmetros da rota atual
				this.navParams = this.router.getCurrentNavigation()?.extras?.state || {};

			} else if (event instanceof NavigationEnd) {

				this.history.push(event.urlAfterRedirects);
				this.previousUrlStr = this.currentUrlStr;
				this.currentUrlStr = event.url;

				this.eventsService.publish("page-dismissed", this.previousUrlStr);
			};

		});

	}

	/**
	 * Retorna os parâmetros passados para a rota
	 * @returns 
	 */
	public getParams() {
		return this.navParams;
	}

	/**
	 * Retorna o histórico de rotas
	 * @returns 
	 */
	public getHistory() {
		return this.history;
	}

	/**
	 * Retorna a rota atual
	 * @returns 
	 */
	public getCurrentUrl() {
		return this.currentUrlStr;
	}

	/**
	 * Retorna a rota anterior
	 * @returns 
	 */
	public getPreviousUrl() {
		return this.previousUrlStr;
	}

	/**
	 * Redireciona o usuário até a nova rota
	 * @param url 
	 * @param params 
	 */
	public async sendUrl(url:string, params?:any, clearHistory:boolean = false, replaceUrl:boolean = false) {

        // Caso esteja redirecionando para a mesma url da página atual emite o evento de mudança de parametroa
        if (("/"+url) == this.currentUrlStr) {
            this.paramsChangeEvent.emit(params);
            return true;

        } else {

            return this.router.navigate([url], {state: params, replaceUrl: replaceUrl})
            .then(res => {
    
                if (clearHistory) {
                    this.history = [];
                }
    
            });

        }

	}

	/**
	 * Redireciona o usuário para a rota anterior
	 */
	public previousUrl(params?:any) {

		this.history.pop();

		if (this.history.length > 0) {

			this.location.back();

		} else {
			this.sendUrl("/", params)
		}

	}

}