import { NavigationService } from './../services/navigation/navigation.service';
import { AuthService } from 'src/services/auth/auth.service';
import { Injectable } from "@angular/core";
import { CanActivate } from '@angular/router';

@Injectable({
	providedIn: "root"
})
export class GuestGuard implements CanActivate {

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

        if (status !== false) {

			this.navigationService.sendUrl("home");

        }

        return !status;
	}

}
