import { EventsService } from './../../services/events/events.service';
import { ModalController } from '@ionic/angular';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationService } from './../../services/navigation/navigation.service';

@Component({
	selector: 'custom-header',
	templateUrl: 'custom-header.component.html'
})
export class CustomHeaderComponent {
	
	@Input() title:string|null = null;
	@Input() listLength:number = 0;
	@Input() modal:boolean = false;
	@Input() marginBottom:number|null = null;
	
	@Input() hasCards:boolean = false;
	@Input() hasInput:boolean = false;
	@Input() subtitle:string|null = null;
	
	@Input() rightButtonIcon:string|null = null;
	@Input() rightButtonIsRotating:boolean = false;
	
	@Input() fixedHeaderEffect:boolean = true;
	@Input() footer:string|null = null;
	@Input() preventDismiss:boolean = false;

	@Output('onRightClick') righChangeEvent = new EventEmitter<any>(); 

	constructor(
		private navigationService: NavigationService,
		private modalCtrl: ModalController,
		private eventsService: EventsService,
		private changeRef: ChangeDetectorRef,
	) {
		
	}

	//Ao abrir o componente
	ngOnInit() {

		setTimeout(() => {
			this.initHeaderEvents();
		}, 100);

	}

	//Ao fechar o componente
	ngOnDestroy() {
		
	}

	/**
	 * Callback do botão esquerdo
	 */
	public leftButtonAction() {

		if (this.modal) {
			this.modalCtrl.dismiss();

		} else {
			this.navigationService.previousUrl();
		}

	}

	/**
	 * Callback do botão direito
	 */
	public rightButtonAction() {
		this.eventsService.publish("header-right-callback", true);
		this.righChangeEvent.emit(true);		
	}

	/**
	 * Inicia os eventos relacionados ao scroll das páginas para alterar o comportamento do header
	 */
	private initHeaderEvents() {

		let pages:HTMLCollection = document.getElementsByTagName("ion-content") || [];

		if (pages && pages.length > 0) {

			for (let i = 0; i < pages.length; i++) {

				let ionContent:HTMLElement = pages[i] as HTMLElement;
				let shadowRootElements:HTMLCollection | never [] = ionContent.shadowRoot?.children || [];
				let pageMain:HTMLElement = shadowRootElements[1] as HTMLElement;
				let lastScrollTop:number = 0;

				if (pageMain) {

					function onScrollUpdateHeader() {
	
						let scrollTop:number = pageMain.scrollTop;

						let scrollHeight:number = pageMain.scrollHeight;
						let offsetHeight:number = pageMain.offsetHeight;

						let headerWrapper:HTMLElement = ionContent.getElementsByClassName("custom-header-page")[0] as HTMLElement;

						if (headerWrapper && headerWrapper.classList.contains("fixed-header-effect")) {

							if (scrollHeight - offsetHeight > 200) {
	
								//Caso esteja arrastando para cima
								if (scrollTop > lastScrollTop) {
			
									if (scrollTop >= 25) {
										headerWrapper.classList.add("fixed-header");
									}
			
								} else {
									//Caso esteja arrastando para cima
			
									if (scrollTop < 25) {
										headerWrapper.classList.remove("fixed-header");
									}
			
								}
	
							}

						}
	
						lastScrollTop = scrollTop;
	
					}
	
					pageMain.removeEventListener("scroll", onScrollUpdateHeader);
					pageMain.addEventListener("scroll", onScrollUpdateHeader);

				}

			}

		}

		this.changeRef.detectChanges();

	}

}
