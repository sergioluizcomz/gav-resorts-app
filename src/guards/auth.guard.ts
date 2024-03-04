import { NavigationService } from './../services/navigation/navigation.service';
import { AuthService } from 'src/services/auth/auth.service';
import { Injectable } from "@angular/core";
import { CanActivate } from '@angular/router';

@Injectable({
	providedIn: "root"
})
export class AuthGuard implements CanActivate {

	constructor(
		private navigationService: NavigationService,
		private authService: AuthService,
	) {
	}

	/**
	 * Continuar com a requisição caso o usuário esteja logado
	 * @param next
	 * @param state
	 */
	async canActivate(): Promise<boolean> {

        let status:boolean = await this.authService.isAuthenticated();

        if (status === false) {
			console.info("Você precisa estar logado para acessar essa página!");
			
			/* this.alertService.create({
				type: "error",
				message: "Você precisa estar logado para acessar essa página!",
			}); */

			this.navigationService.sendUrl("auth/login");

        }
		
        return status;

	}

}
