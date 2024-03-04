import { ModalController } from '@ionic/angular';
import { ChangeDetectorRef, Component, Input } from '@angular/core';

/**
 * Esta página deve ser aberta como um modal
 */
@Component({
	selector: 'gallery-page',
	templateUrl: 'gallery.page.html',
})
export class GalleryPage {

	@Input() imageList:string[]|any[];
	@Input() imageIndex:number = 0;

	constructor(
		private modalCtrl: ModalController,
		private changeRef: ChangeDetectorRef
	) {

	}

	//Ao carregar o componente
	ngOnInit() {
		this.changeRef.detectChanges();
	}

	//Ao fechar o componente
	ngOnDestroy() {
		this.changeRef.detectChanges();
	}

	/**
	 * Fecha a página atual
	 */
	public dismiss() {
		this.modalCtrl.dismiss();
	}

}
