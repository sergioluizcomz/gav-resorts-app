import { Injectable } from '@angular/core';
import { StatusBar, Style, SetOverlaysWebViewOptions, StyleOptions, BackgroundColorOptions } from '@capacitor/status-bar';

@Injectable()
export class StatusbarService {

	constructor(
	) {

	}

    /**
     * Atualiza as definições da statusbar
     * @param overlayOptions 
     * @param styleOptions 
     * @param backgroundOptions 
     */
    public updateOptions(overlayOptions:SetOverlaysWebViewOptions|null = null, styleOptions:StyleOptions|null = null, backgroundOptions:BackgroundColorOptions|null = null) {

        return new Promise(async (resolve, reject) => {
            
            setTimeout(async () => {

                try {
                    await StatusBar.setOverlaysWebView(overlayOptions || {overlay: true});
                    console.info("setOverlaysWebView", true);
    
                } catch (err) {
                    //console.error("setOverlaysWebView", false, err);
                };
    
                try {
                    await StatusBar.setBackgroundColor(backgroundOptions || {color: "#00000000"});
                    console.info("setBackgroundColor", true);
    
                } catch (err) {
                    //console.error("setBackgroundColor", false, err);
                };
    
                try {
                    await StatusBar.setStyle(styleOptions || {style: Style.Dark});
                    console.info("setStyle", true);
    
                } catch (err) {
                    //console.error("setStyle", false, err);
                };
    
                console.info("Status-bar atualizada.");
    
                resolve(true);
                
            }, 1000);

        });

    }

    /**
     * Texto claro para fundos escuros
     */
    public setLight() {

        return new Promise(async (resolve, reject) => {

            try {
                await StatusBar.setStyle({style: Style.Dark});
                resolve(true);
                
            } catch (err) {
                //
            }

        });
        
    }

    /**
     * Texto escuro para fundos claros
     */
    public setDark() {

        return new Promise(async (resolve, reject) => {

            try {
                await StatusBar.setStyle({style: Style.Light});
                resolve(true);
                
            } catch (err) {
                //
            }

        });
        
    }

    /**
     * Altera o overlay da statusbar
     * @param overlay 
     * @returns 
     */
    public updateOverlay(overlay:boolean = true):Promise<any> {

        return new Promise(async (resolve, reject) => {

            try {

                let overlayOptions:SetOverlaysWebViewOptions = {overlay: overlay};
                await StatusBar.setOverlaysWebView(overlayOptions);
                
                resolve(true);
                
            } catch (err) {
                //
            }

        });
        
    }

    /**
     * Altera o background da statusbar
     * @param backgroundColor
     * @returns 
     */
    public updateBackgroundColor(backgroundColor:string = "#00000000"):Promise<any> {

        return new Promise(async (resolve, reject) => {

            try {
                let backgroundOptions:BackgroundColorOptions = {color: backgroundColor};
                await StatusBar.setBackgroundColor(backgroundOptions);
                
                resolve(true);
                
            } catch (err) {
                //
            }

        });
        
    }

}
