import { Device } from '@awesome-cordova-plugins/device/ngx/index';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx/index';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx/index';
import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent, checkStorageAuthentication } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/components/components.module';
import { PipesModule } from 'src/pipes/pipes.module';
import { DirectivesModule } from 'src/directives/directives.module';
import { RequestInterceptor } from 'src/interceptors/request-interceptor';
import { StatusbarService } from 'src/services/statusbar/statusbar.service';
import { StorageService } from 'src/services/storage/storage.service';
import { HttpService } from 'src/services/http/http.service';
import { EventsService } from 'src/services/events/events.service';
import { NavigationService } from 'src/services/navigation/navigation.service';
import { NetworkService } from 'src/services/network/network.service';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';
import { AlertService } from 'src/services/alert/alert.service';
import { ActionSheetService } from 'src/services/action-sheet/action-sheet.service';
import { ToastService } from 'src/services/toast/toast.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx/index';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx/index';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SelectModalPageModule } from 'src/pages/select-modal/select-modal.module';
import { GalleryPageModule } from 'src/pages/gallery/gallery.module';
import { HomePageModule } from 'src/pages/home/home.module';
import { NgxMaskModule } from 'ngx-mask';
import { TransferService } from 'src/services/transfer/transfer.service';
import { FileUtilsService } from 'src/services/file-utils/file-utils.service';
import { File } from '@awesome-cordova-plugins/file/ngx/index';
import { VersionService } from 'src/services/version/version.service';
import { ContactService } from 'src/services/contact/contact.service';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
	override overrides = <any>{
		"press": { time: 500 } // tempo de pressionamento em milissegundos
	}
}

@NgModule({
	declarations: [
		AppComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		HammerModule,
		IonicModule.forRoot({
			innerHTMLTemplatesEnabled: true,
		}),
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        HomePageModule,
		GalleryPageModule,
		SelectModalPageModule,
        CommonModule,
        ComponentsModule,
        PipesModule,
		RouterModule,
		DirectivesModule,
		AngularSvgIconModule.forRoot(),
	],
	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{
            provide: APP_INITIALIZER,
            useFactory: checkStorageAuthentication,
            deps: [StorageService, StatusbarService, AuthService],
            multi: true
        },
		{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
		{ provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },

		//Plugins
		AppVersion,
		Device,
		InAppBrowser,
		Geolocation,
		Storage,
		FileOpener,
		File,
		SocialSharing,

		//Services
		HttpService,
		StatusbarService,
		AuthService,
		AlertService,
		ActionSheetService,
		StorageService,
		UserService,
		NetworkService,
		NavigationService,
		TransferService,
		ToastService,
		FileUtilsService,
		TransferService,
		EventsService,
		VersionService,
		ContactService

	],
	bootstrap: [
		AppComponent
	],
})
export class AppModule { }
