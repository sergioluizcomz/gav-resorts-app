import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { GalleryPage } from 'src/pages/gallery/gallery.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertService } from 'src/services/alert/alert.service';
import { ActionSheetService } from 'src/services/action-sheet/action-sheet.service';
import { FileUtilsService } from 'src/services/file-utils/file-utils.service';
import { ToastService } from 'src/services/toast/toast.service';

@Component({
	selector: 'custom-media-select',
	templateUrl: 'custom-media-select.component.html'
})
export class CustomMediaSelectComponent {
	
	@Input("modalImages") modalImages:any[] = [];
	@Input("minImages") minImages:number = 0;
	@Input("maxImages") maxImages:number = 10;
    @Input("onlyView") onlyView:boolean = false;
    @Input("onlyCamera") onlyCamera:boolean = false;

	constructor(
		private modalCtrl: ModalController,
		private alertService: AlertService,
		private changeRef: ChangeDetectorRef,
		private actionSheetService: ActionSheetService,
		private loadingCtrl: LoadingController,
		private fileUtilsService: FileUtilsService,
        private toastService: ToastService
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
     * Abre o action-sheet para a seleção do modo de inserção da(s) imagem(ns)
     * @param index 
     */
	public async openImageModeSelect(index:number|null = null) {

        //Precaução para caso o componente esteja no modo de apenas visualização
        if (this.onlyView) {

            if (index) {
                this.openImageModal(index);
            }

            return;
        }

        if (index === null && this.modalImages.length >= this.maxImages) {
            this.toastService.show("Você já excedeu o limite de fotos que podem ser anexadas.");
            return;
        }

        let title:string = "Adicionar imagem";
        let subtitle:string = "Selecione uma das opções abaixo para adicionar sua imagem.";

		let buttons:any = [
			{text: "Câmera", icon: "camera-outline", role: "selected", handler: () => { this.openImageSelection(CameraSource.Camera); }},
		];

        if (!this.onlyCamera) {
            buttons.push({text: "Galeria", icon: "image-outline", handler: () => { this.openImageSelection(CameraSource.Photos); }});
        }

		if (index !== null && this.modalImages[index]) {

            title = "Gerenciar imagem";
            subtitle = "Selecione uma das opções abaixo para visualizar ou remover sua imagem.";
            buttons = [];

			buttons.push(
				{text: "Visualizar", icon: "eye-outline", handler: () => { this.openImageModal(index); }}
			);

			buttons.push(
				{text: "Remover imagem", icon: "trash-outline", handler: () => { 
                    this.modalImages.splice(index, 1);
					this.changeRef.detectChanges();
				}}
			);

		}

		this.actionSheetService.create({
			title: title,
			subtitle: subtitle,
			buttons: buttons
		});

	}

    /**
	 * Inicia o processo de seleção de imagem via câmera ou biblioteca de fotos
	 * @param source 
	 */
	public async openImageSelection(source:CameraSource) {

        //Precaução para caso o componente esteja no modo de apenas visualização
        if (this.onlyView) {
            return;
        }

        if (this.modalImages.length >= this.maxImages) {
            this.alertService.create({type: "error", message: "Você já excedeu o limite de fotos que podem ser anexadas."});
            return;
        }

        if (source == CameraSource.Camera) {

            Camera.getPhoto({
                width: 1280,
                height: 1280,
                quality: 100,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: source
            }).then((image:any) => {
    
                if (image && image.base64String && image.format && ["png", "jpeg", "jpg"].includes(image.format)) {
        
                    // Adiciona base65 da imagem ao array
                    if (this.modalImages.length < this.maxImages) {

                        let base64Image = "data:image/" + image.format + ";base64," + image?.base64String;
                        this.modalImages.push(base64Image);
                    }
        
                    //Necessário para atualizar a view com a nova imagem
                    this.changeRef.detectChanges();
        
                } else {
        
                    this.alertService.create({
                        type: "error",
                        message: "Não foi possível carregar a imagem selecionada, tente selecionar uma diferente desta vez."
                    });
                    
                }
    
            }).catch(err => {
                //
            });

        } else {

            // Obtém lista de imagens da galeria
            Camera.pickImages({
                width: 1280,
                height: 1280,
                quality: 100,
                limit: this.maxImages, // Somente iOS
                presentationStyle: "fullscreen",
            }).then(async (res:any) => {
                
                let loading = await this.loadingCtrl.create({ message: "Obtendo imagens..." });
                loading.present().then(async() => {

                    let photos:any[] = res?.photos || [];

                    if (photos && photos.length > 0) {

                        let hasError:boolean = false;

                        for (let i = 0; i < photos.length; i++) {
                            let image:any = photos[i];
                            
                            if (image.webPath) {
                    
                                await fetch(image.webPath)
                                .then(response => response.blob() )
                                .then(blob => this.fileUtilsService.blobToBase64(blob))
                                .then(base64String => {
                                    
                                    if (base64String && typeof base64String === "string" &&
                                    (base64String.startsWith("data:image/png") || base64String.startsWith("data:image/jpeg") || base64String.startsWith("data:image/jpg"))) {

                                        // Adiciona base65 da imagem ao array
                                        if (this.modalImages.length < this.maxImages) {
                                            this.modalImages.push(base64String);
                                        }
                                        
                                        // Necessário para atualizar a view com a nova imagem
                                        this.changeRef.detectChanges();
                                        
                                    }
                                
                                }).catch(error => {
                                    hasError = true;
                                });
        
                            } else {
                                hasError = true;
                            }
                            
                        }

                        if (hasError) {

                            this.alertService.create({
                                type: "error",
                                message: "Não foi possível carregar as uma ou mais imagens selecionadas, tente selecionar uma diferente desta vez."
                            });

                        }
                        
                    }
                    
                    loading.dismiss();

                });

            }).catch(err => {
                //
            });

        }

	}

    /**
     * Abre o modal para visualização da(s) imagem(ns)
     * @param index 
     */
    public async openImageModal(index:number) {

        let modal = await this.modalCtrl.create({
            component: GalleryPage,
            backdropDismiss: false,
            cssClass: "custom-gallery-modal",
            showBackdrop: true,
            componentProps: {
                imageList: this.modalImages,
                imageIndex: index
            }
        });

        modal.present();
    }

}
