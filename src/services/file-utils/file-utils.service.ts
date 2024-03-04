import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx/index';
import { File, Entry, FileEntry, DirectoryEntry } from '@awesome-cordova-plugins/file/ngx/index';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';


@Injectable()
export class FileUtilsService {

    private win: any = window;

    constructor(
        private file: File,
        private fileOpener: FileOpener,
        private domSanitizer: DomSanitizer,
        private platform: Platform
    ) {

    }

    /**
     * Obtem o nome do arquivo
     * @param path 
     */
    public fileName(path:string) {
        return path.split('/').pop()?.split('?')[0] || null;
    }

    /**
     * Obtem o diretório do caminho
     * @param path 
     */
    public dir(path:string) {
        let aPath = path.split('/');
        aPath.pop();
        return aPath.join('/');
    }

    /**
     * Remove o diretório recursivamente caso exista
     * @param baseFileSystem
     * @param dirName 
     */
    public removeDirRecursively(baseFileSystem:string, dirName:string):Promise<boolean> {

        return this.file.checkDir(baseFileSystem, dirName)
        .then(() => {
        
            return this.file.removeRecursively(baseFileSystem, dirName)
            .then(() => {
                return true;
            })
            .catch((err) => {
                return false;
            });

        })
        .catch(() => {
            return true;
        });
    }

    /**
     * Remover diretório, caso exista
     * @param path 
     * @param name 
     */
    public removeDir(path:string, name:string) {

        return new Promise((resolve, reject) => {

            this.file.removeDir(path, name)
            .then(() => {
                resolve(true);

            }).catch((err: any) => {

                if (err && err.code == 1) {
                    resolve(true);

                } else {
                    reject(err);
                }

            });

        });
    }

    /**
     * Normaliza o caminho de uma mídia
     * @param path 
     */
    public normalizeUrl(path:string, trustUrl:boolean = true):string {
        
        let url = this.win.Ionic.WebView.convertFileSrc(path);

        if (trustUrl) {
            url = this.domSanitizer.bypassSecurityTrustUrl(url);
        }
        
        return url;
    }

    /**
     * Criar diretórios de forma recursiva
     * @param path 
     * @param fulldir 
     */
    public createDirRecursively(path: string, fulldir: string) {

        return new Promise((resolve, reject) => {

            let index = 0;
            let parts = fulldir.split("/");

            let check = () => {

                let dir = parts.slice(0, index + 1).join("/");

                this.file.checkDir(path, dir)
                .then(() => {
                    postCheck();

                }).catch((err: any) => {

                    if (err.code == 1) {

                        this.file.createDir(path, dir, true)
                        .then(() => {
                            postCheck();

                        }, reject);

                    } else {
                        reject(err);
                    }

                });

            };

            let postCheck = () => {

                index++;
                
                if (parts[index]) {
                    check();
                
                } else {

                    this.file.checkDir(path, fulldir)
                    .then(() => {
                        resolve(true);

                    }, reject);
                }

            };

            check();

        });
    }

    /**
     * Verificar se arquivos existem
     * @param files 
     * @param path 
     */
    public checkFiles(files: any, path: string = this.file.dataDirectory) {
        
        return new Promise((resolve, reject) => {
            
            files = Array.isArray(files) ? files : [files];

            let check = (index: number) => {

                this.file.checkFile(path, files[index])
                .then(() => {

                    index++;

                    if (files[index]) {
                        check(index);
                    
                    } else {
                        resolve(true);
                    }

                }, reject);
            }

            check(0);

        });
    }

    /**
     * Converte um base64 para Blob
     * @param base64 
     * @param contentType 
     * @param sliceSize 
     * @return Blob
     */
    public base64toBlob(base64: string, contentType: string = "", sliceSize = 512) {

        var byteCharacters = atob(base64);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
    
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
    
            var byteArray = new Uint8Array(byteNumbers);
    
            byteArrays.push(byteArray);
        }
    
        var blob = new Blob(byteArrays, { type : contentType });
        return blob;
    }

    /**
     * Convert image bytes to an actual image url
     * 
     * @param blob 
     */
    public blobToDataUrl(blob: any) {
        var urlCreator = this.win.URL || this.win.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);

        return imageUrl;
    }

    /**
     * Converte um blob em imagem codificada em base64
     * @param blob
     */
    public blobToBase64(blob: any) {

        return new Promise((resolve, reject) => {

            let reader = new FileReader();

            const realFileReader = (reader as any)._realReader;

            if (realFileReader) {
                reader = realFileReader;
            }

            reader.onloadend = () => {
                resolve(reader.result);
            }

            reader.onerror = (err) => {
                reject(err);
            }

            reader.readAsDataURL(blob);

        });
    }


    /**
     * Realiza download de um determinado arquivo
     * 
     * @param data 
     * @param mimmeType 
     */
    public downloadBlobFile(blob: any, dir: string, filename: string, mimeType: string) {

        return new Promise((resolve, reject) => {

            let baseDir = null;

            if (this.platform.is('ios')) {
                baseDir = this.file.tempDirectory;
            } else {
                baseDir = this.file.cacheDirectory;
            }

            this.createDir(baseDir, dir)
            .then((dirEntry:Entry) => {

                this.file.writeFile(dirEntry.toURL(), filename, blob, { replace: true })
                .then((fileEntry: FileEntry) => {
    
                    this.openFile(fileEntry, mimeType)
                    .then(() => {
                        resolve(true);
                    }).catch(e => {
                        reject('Não foi possível abrir o arquivo. Tente novamente mais tarde.');
                    });
        
                }).catch(reject);

            }).catch((err) => {
                reject('Não foi possível criar o diretório para download do arquivo.');
            });
        });


    }

    /**
     * Abre o arquivo
     * @param fileEntry 
     */
    public openFile(fileEntry: any, mimetype: string) {

        return this.fileOpener.open(fileEntry.nativeURL, mimetype);
    }

    /**
     * Salva um base64 no armazenamento local
     * @param base64 
     * @param contentType 
     * @param fileName 
     * @param path 
     */
    public storeBase64(base64: string, contentType: string, fileName: string) {

        return new Promise((resolve, reject) => {

            const path = this.file.dataDirectory;

            var data: any = base64.split(",");
            data = data.length > 1 ? data[1] : data[0];

            let blob = this.base64toBlob(data, contentType);

            this.createDirRecursively(path, this.dir(fileName))
            .then(() => {

                this.file.writeFile(path, fileName, blob, { replace: true })
                .then(entry => {
                    resolve(entry);
    
                }, reject)

            }, reject);

        });
    }

    /**
     * Cria um diretório, caso não exista
     * @param path 
     * @param dirName 
     */
    public createDir(path:string, dirName:string):Promise<DirectoryEntry> {
    
        return new Promise((resolve, reject) => {
            
            this.file.checkDir(path, dirName)
            .then(() => {
                
                this.file.resolveDirectoryUrl(path + '/' + dirName)
                .then(dirEntry => {
                    resolve(dirEntry);
                }).catch(reject);
    
            }).catch((err) => {
    
                this.file.createDir(path, dirName, true)
                .then(dirEntry => {
                    resolve(dirEntry);
                }).catch(reject);
    
            });

        });

    }

    /**
     * Remove um arquivo
     * @param path 
     * @param fileName 
     */
    public removeFile(path:string, fileName:string) {
        return this.file.removeFile(path, fileName);
    }

}
