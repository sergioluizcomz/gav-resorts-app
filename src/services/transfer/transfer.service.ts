import { FileUtilsService } from './../file-utils/file-utils.service';
import { HttpService } from 'src/services/http/http.service';
import { Injectable } from '@angular/core';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx/index';

@Injectable()
export class TransferService {

    constructor(
        private httpService: HttpService,
		private fileUtilsService: FileUtilsService,
        private file: File
    ) {

    }

    /**
     * Realiza o download de um arquivo
     * @param url 
     * @param dataDirectory 
     * @param filePath 
     * @return FileEntry
     */
    async download(url:string, dataDirectory:string = this.file.dataDirectory, filePath: string, params:any = {}, isExternalUrl:boolean = false):Promise<FileEntry> {
        
        console.info("Iniciando download de arquivo.", url, filePath, dataDirectory);

        try {

            let targetPart = filePath.split('/');
            let fileName:string|null = targetPart.pop() || null;

            if (fileName) {
                
                let dir = targetPart.join('/');
    
                // Criar diretório se não existir
                await this.fileUtilsService.createDirRecursively(dataDirectory, dir);
    
                let fileEntry = await this.httpService.download(url, (dataDirectory + dir), fileName, params, null, isExternalUrl);
    
                return fileEntry;
                
            } else {
                console.error("Não foi possível obter o nome do arquivo.", targetPart);
                return Promise.reject("Não foi possível obter o nome do arquivo.");
            }

        } catch (err) {
            console.error('Falha ao realizar download do arquivo:', err);
            throw err;
        }

    }

}
