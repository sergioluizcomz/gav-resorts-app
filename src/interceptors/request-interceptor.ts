import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EventsService } from 'src/services/events/events.service';
import { ToastService } from 'src/services/toast/toast.service';
import { AuthService } from 'src/services/auth/auth.service';
import { NavigationService } from 'src/services/navigation/navigation.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

	constructor(
		private eventsService: EventsService,
		private toastService: ToastService,
		private authService: AuthService,
		private navigationService: NavigationService
	) {

	}

	/**
	 * Realiza uma interceptação no momento da requisição com o servidor para verificar a autenticação do usuário
	 * @param request 
	 * @param next 
	 * @returns 
	*/
	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

		let handleSuccess = (event: HttpEvent<any>) => {

			//Caso não ocorra nenhum erro com a requisição
			if (event instanceof HttpResponse) {
				//
			}

			return event;
		};

		let handleError = (err: HttpErrorResponse) => {

			if (err.status == 401) {

				console.error("Falha na requisição. Autenticação expirada!", err);

				if (!this.authService.accessTokenRefreshed) {

					this.authService.refreshToken()
					.then(res => {

						this.authService.accessTokenRefreshed = true;

						this.navigationService.sendUrl("home");
						
						this.toastService.show("Seu token de autenticação precisou ser atualizado, tente acessar a página novamente.");

					}).catch(err => {

						if (!this.authService.accessTokenExpired) {

							this.authService.accessTokenExpired = true;
							this.eventsService.publish("unauthenticated");

							this.toastService.show("Não foi possível acessar a página. Seu token de autenticação expirou, tente realizar o login novamente para continuar.");

						}

					});

				}

			}

			return throwError(err);
		};

		return next.handle(request).pipe(
			map(handleSuccess), catchError(handleError)
		);

	}

}
