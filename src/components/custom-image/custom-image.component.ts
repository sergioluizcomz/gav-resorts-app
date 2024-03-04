import { ModalController } from '@ionic/angular';
import { Component, Input } from '@angular/core';
import { GalleryPage } from 'src/pages/gallery/gallery.page';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'custom-image',
	templateUrl: 'custom-image.component.html'
})
export class CustomImageComponent {
	
	@Input() src:any;

	constructor(
		private modalCtrl: ModalController,
		private domSanitizer: DomSanitizer
	) {
		
	}

	//Ao fechar o componente
	ngOnDestroy() {

	}

	//Ao carregar o componente
	ngOnInit() {
		
		if (this.src && typeof this.src === "string") {
			this.domSanitizer.bypassSecurityTrustUrl(this.src);
		}

	}

	/**
	 * Abre o modal de visualização desta imagem
	 */
    public async openImageModal() {

		if (this.src) {

			let modal = await this.modalCtrl.create({
				component: GalleryPage,
				backdropDismiss: false,
				cssClass: "custom-gallery-modal",
				showBackdrop: true,
				componentProps: {
					imageList: [
						this.src
					]
				}
			});
	
			modal.present();

		}

    }

}
