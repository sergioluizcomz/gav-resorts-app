import { invertDate } from 'src/utils/functions';
import { SelectModalPage } from './../../pages/select-modal/select-modal.page';
import { AlertService } from './../../services/alert/alert.service';
import { Platform, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EventsService } from 'src/services/events/events.service';
import * as moment from 'moment';

@Component({
	selector: "custom-input",
	templateUrl: "custom-input.component.html"
})
export class CustomInputComponent {

    /**
     * Exemplos de mask:
     * 9999-99-99 -> 2017-04-15
     * 0*.00 -> 2017.22
     * 000.000.000-99 -> 048.457.987-98
     * AAAA -> 0F6g
     * SSSS -> asDF
     * UUUU -> ASDF
     * LLLL -> asdf
     * 
     * 0 -> digits (like 0 to 9 numbers)
     * 9 -> digits (like 0 to 9 numbers), but optional
     * A -> letters (uppercase or lowercase) and digits
     * S -> only letters (uppercase or lowercase)
     * U -> only letters uppercase
     * L -> only letters lowercase
    */
    @Input() mask:string;

	@Input() fc: AbstractControl<any> | null; //referência do formControl daquele campo
	@Input() uniqueIndex:number|null; //referência do formControl caso tenha vários com o mesmo nome
	@Input() label:string|null; //label do campo
	@Input() labelClass:string = ""; //classe adicional para label
	@Input() title:string|null; //Título do campo no seletor
	@Input() type:string; //tipo do campo (select, textarea ou text)
	@Input() placeholder:string = ""; //placeholder apresentado no campo
	@Input() pattern:string = ""; //pattern do campo
	@Input() info:string|null; //informação opcional abaixo do campo
	@Input() infoIcon:string|null; //ícone da informação opcional abaixo do campo
	@Input() iconInside:string|null = null; //nome do svg sem a extensão do arquivo para ser o ícone dentro do campo
	@Input() iconInsideColor:string = "dark"; //cor variável (variables.scss) do ícone de dentro do campo
    @Input() iconInsideLeftSide:boolean = false; //se o ícone de dentro deve se situar a esquerda, pois o padrão é a direita
	@Input() iconOutside:string|null; //nome do svg sem a extensão do arquivo para ser o ícone de fora do campo
	@Input() iconOutsideColor:string = "dark"; //cor variável (variables.scss) do ícone de fora do campo
	@Input() iconOutsideAbsolute:boolean = false; //Se o ícone (botão) que fica de fora deve ficar de dentro ?!?! Sim.
	@Input() inputMode:string = "text"; //tipo do campo (manter text e não alterar)
	@Input() decimalCasesQty:number = 0;
	@Input() rowsQty:number = 4; //quantidade de linhas no textarea
	@Input() resize:boolean = true; //se o textarea pode ter altura redimensionada
	@Input() multiple:boolean = false; //se o seletor é de múltipla escolha
	@Input() disabled:boolean = false; //se o campo está desabilitado
	@Input() items:any[] = []; //lista de opções para o seletor (caso seja ajax, não enviar nada)
	@Input() searchPlaceholder:string = ""; //placeholder apresentado no campo de busca no modal
	@Input() keyName:string; //irá apresentar o valor (texto) como sendo o dessa chave do objeto. Podemos personalizar o texto como fiz com "citySelect"
	@Input() returnValue:string; //irá retornar o valor da opção
	@Input() modal:boolean = false; //se o seletor deve ser aberto em forma de modal (precisa ter: type="select")
	@Input() ajaxRoute:string|null = null; //se o seletor deve carregar opções via ajax (precisa ter: type="select", modal="true")
	@Input() ajaxParams:any = {}; //parâmetros que devem ser considerado na requisição ajax caso o seletor seja desse tipo
    @Input() citySelect:boolean = false; // se é um seletor de cidades (apresentará o valor do campo como sendo o nome da cidade com a abreviação de seu estado)
    @Input() boldOptionLabel:boolean = false; // se a label de cada option deve ser negrito
    @Input() searchSelect:boolean = false; // se é um campo do tipo search do seletor modal (não precisa se preocupar com esse)
    @Input() forceEmptyValue:boolean = false; // se apenas o placeholder deve ser apresentado, sem valor
    @Input() minDate:string|null = null;
    @Input() maxDate:string|null = null;
    @Input() vehicleSelect:boolean = false; // para apresentar opções de uma forma personalizada

    @Input() minDateAux:Date|null = null;
    @Input() maxDateAux:Date|null = null;

    @Output("onClick") click: EventEmitter<any> = new EventEmitter<any>();

    public selectValueName:string|null;
    public selectValueKeys:number[] = [];

    public inputValue:any;
    public formControlName:string|null;

    public everHadAValue:boolean = false;
    public isFormSubmitted:boolean = false;
    public isFormValid:boolean = false;

    public formSubmitSubscription:any;

    public owlDate:Date|null;

    public masks:any = {
        cpj: "000.000.000-00",
        cnpj: "00.000.000/0000-00",
        cpfcnpj: "000.000.000-00||00.000.000/0000-00",
        phone: "(00) 00000-0000",
        cep: "00000-000",
        date: "00/00/0000",
        money: "separator.2", // limitando a 2 casas após a virgula.
        time: "00:00"
    }

	constructor(
        private platform: Platform,
        private alertService: AlertService,
        private modalCtrl: ModalController,
        private eventsService: EventsService
	) {

		moment.locale("pt-br");

	}

    /**
     * Ao destruir o componente
     */
    ngOnDestroy() {

        if (this.formControlName != "search") {
            this.eventsService.unsubscribe("form-submit");
        }

    }

    /**
     * Ao alterar algo no componente
     */
    ngOnChanges() {

        this.customChangeCallback();

        //O plugin necessita dessa configuração envolvendo o horário zerado para que os limites da data funcionem corretamente
        if (this.minDate) {
            this.minDateAux = new Date(this.minDate + " 00:00:00");
        }

        if (this.maxDate) {
            this.maxDateAux = new Date(this.maxDate + " 00:00:00");
        }

    }

	/**
	 * Ao carregar o componente
	 */
	ngOnInit() {

        if (this.label && !this.title) {
            this.title = this.label;
        }

        if (!this.infoIcon) {
            this.infoIcon = "fal fa-circle-question";
        }

        if (this.mask == "date" || this.type == "date") {
            this.placeholder = "Ex: " + moment().format("DD/MM/YYYY");
            this.iconInside = "calendar";
        }

        if (this.type == "select") {

            //this.events.unsubscribe("select-updated");

            this.eventsService.subscribe("select-updated", (data:any) => {
                this.selectUpdated(data);
            });

            if (!this.iconInside) {
                this.iconInside = "nav-arrow-down";
            }
            
            if (this.iconInsideColor != "white") {
                this.iconInsideColor = "light-gray";
            }

        }

        if (this.fc) {

            this.disabled = this.fc?.disabled;

            let formGroup:FormGroup<any> | FormArray<any> | null = this.fc.parent;
            
            if (formGroup) {

                let formControls:any = formGroup.controls;

                this.formControlName = Object.keys(formControls).find(name => this.fc === formControls[name]) || null;
                this.inputValue = this.fc?.value;
        
                this.fc?.valueChanges.subscribe(value => {
                    this.inputValue = value;
                    this.customChangeCallback();
                });

                //Ao alterar o status do campo
                this.fc?.statusChanges.subscribe(value => {
                    this.disabled = !!this.fc?.disabled;
                });

                if (this.inputValue) {
                    this.onChange();
                }

            }

        }

        if (this.formControlName != "search") {

            this.eventsService.subscribe("form-submit", (data:any) => {
                this.isFormSubmitted = true;
                this.isFormValid = data;
            });
            
        }

	}

    /**
     * Ao alterar a data pelo componente Owl
     */
    public onOwlDateChange() {

        if (this.type == "date") {

            let selectedDate:any = moment(this.owlDate);
            let selectedDateStr:string = selectedDate.format("YYYY-MM-DD");

            let isAfterMinDate:boolean = !this.minDate || selectedDateStr >= moment(this.minDate).format("YYYY-MM-DD");
            let isBeforeMaxDate:boolean = !this.maxDate || selectedDateStr <= moment(this.maxDate).format("YYYY-MM-DD");

            if (isAfterMinDate && isBeforeMaxDate) {
                
                this.inputValue = selectedDate.format("DDMMYYYY");

            } else {
                this.owlDate = null;
                this.inputValue = null;
            }

            this.fc?.setValue(this.inputValue);
            
        }

    }

    /**
     * Obtém o nome que deve ser apresentado no campo "Veículo"
     * @param element 
     * @returns 
     */
    public getVehicleInputValueName(element:any) {
        return element.brand + " " + element.model + " (" + element.plate + ")";
    }

    /**
     * 
     */
    public customChangeCallback() {

        if (this.type == "select") {

            if (this.inputValue && this.keyName && this.inputValue[this.keyName]) {
                this.selectValueName = this.inputValue[this.keyName];

                if (this.citySelect && this.inputValue.state_abbrev) {
                    this.selectValueName += " (" + this.inputValue.state_abbrev + ")";

                } else if (this.vehicleSelect) {
                    this.selectValueName = this.getVehicleInputValueName(this.inputValue);
                }

            }

            if (this.multiple) {

                //No momento esse cara apenas fica adicionando no selectValueKeys os que ainda não estão lá

                //O que deve acontecer, é que ele deve sincronizar o selectValueKeys com o inputValue
                for (let i = 0; i < this.items?.length; i++) {
                    let elementList:any = this.items[i];
                    let inputValueIds:Array<any> = [];
    
                    for (let j = 0; j < (this.inputValue || []).length; j++) {
                        let elementValue:any = this.inputValue[j];

                        if (JSON.stringify(elementValue) == JSON.stringify(elementList) && this.selectValueKeys.indexOf(i) == -1) {
                            this.selectValueKeys.push(i);
                        }

                        inputValueIds.push(this.inputValue[j].id);
                        
                    }

                    if (this.selectValueKeys.indexOf(i) != -1 && !inputValueIds.includes(elementList.id)) {

                        for (let vIndex = 0; vIndex < this.selectValueKeys.length; vIndex++) {

                            if (this.selectValueKeys[vIndex] == i) {
                                this.selectValueKeys.splice(vIndex, 1);
                                break;
                            }
                            
                        }

                    }
    
                }

                if (this.selectValueKeys && this.selectValueKeys.length > 0) {
    
                    let selectValue:any = "";
    
                    for (let i = 0; i < this.selectValueKeys.length; i++) {
                        let itemKey:number = this.selectValueKeys[i];
                        
                        selectValue += this.items[itemKey][this.keyName];
    
                        if (this.citySelect && this.items[itemKey].state_abbrev) {
                            selectValue += " (" + this.items[itemKey].state_abbrev + ")";
                        }
        
                        if (this.vehicleSelect) {
                            selectValue = this.getVehicleInputValueName(this.items[itemKey]);
                        }

                        if (this.selectValueKeys.length > 1 && i < (this.selectValueKeys.length - 1)) {
                            selectValue += ", ";
                        }
        
                    }
        
                    this.selectValueName = selectValue;
                    
                } else {
                    this.selectValueName = null;
                    this.selectValueKeys = [];
                }

            } else {
    
                for (let i = 0; i < this.items?.length; i++) {
                    let element:any = this.items[i];
                    
                    if (JSON.stringify(element) == JSON.stringify(this.inputValue) || (this.returnValue && (element?.[this.returnValue] == this.inputValue))) {

                        if (this.returnValue) {
                            this.selectValueName = element?.[this.keyName];
                        }

                        this.selectValueKeys = [i];
                    }
                }
    
            }

        }

        if (this.inputValue) {
            this.everHadAValue = true;

            this.fc?.markAsDirty();
            this.fc?.markAsTouched();

        } else {
            //TODO melhorar isso
            this.selectValueName = null;
            this.selectValueKeys = [];
        }

        this.updateDateInputValue();
        
    }

    /**
     * Ao alterar a opção do seletor
     * @param activeKeysList 
     */
    public selectUpdated(data:any) {

        let activeKeysList:number[] = data.value;
        let formControlName:string = data.formControlName;

        if (data.items !== undefined && formControlName == this.formControlName) {
            this.items = data.items;
        }

        if (formControlName == this.formControlName) {

            if (activeKeysList && activeKeysList.length > 0) {
    
                let selectValue:any = "";

                for (let i = 0; i < activeKeysList.length; i++) {
                    let itemKey:number = activeKeysList[i];
                    
                    selectValue += this.items[itemKey][this.keyName];

                    if (this.citySelect && this.items[itemKey].state_abbrev) {
                        selectValue += " (" + this.items[itemKey].state_abbrev + ")";
                    }

                    if (this.vehicleSelect) {
                        selectValue = this.getVehicleInputValueName(this.items[itemKey]);
                    }
    
                    if (activeKeysList.length > 1 && i < (activeKeysList.length - 1)) {
                        selectValue += ", ";
                    }
    
                }
    
                this.selectValueName = selectValue;
                this.selectValueKeys = activeKeysList;
    
            } else {
                this.selectValueName = null;
                this.selectValueKeys = [];
            }
    
            if (this.selectValueKeys.length > 0) {
    
                let itemsAux:any[] = [];
    
                for (let i = 0; i < this.items?.length; i++) {
                    let element:any = this.items[i];
    
                    if (this.selectValueKeys.indexOf(i) != -1) {
                        itemsAux.push(element);
                    }
                    
                }
    
                this.fc?.setValue(this.multiple ? itemsAux : itemsAux[0]);
    
            } else {
                this.fc?.setValue(null);
            }

        }

    }

    /**
     * Para não abrir o teclado na web
     * @param event 
     */
    public onFocusIn(event?:any) {

        if (environment.debug && this.platform.is("mobileweb")) {
            event.stopPropagation();
        }

    }

    /**
     * Corrige o campo se necessário. Exemplo: "12." -> "12"
     */
    public onFocusOut() {

        let isValueUpdated:boolean = false;

        if (!this.inputValue || this.inputValue == "") {
            this.inputValue = null;
            isValueUpdated = true;
        }
        
        if (!isValueUpdated && this.type == "number") {

            if (this.inputValue && (String(this.inputValue).endsWith(".") || String(this.inputValue).endsWith(","))) {
                this.inputValue = this.inputValue.slice(0, -1);
                isValueUpdated = true;
            }
            
        }

        if (isValueUpdated) {
            this.onChange();
        }

    }

    /**
     * Callback do evento change: atualizar o valor na referência do FormControl
     */
    public onChange(fromModelChange:boolean = false) {
        
        //Permite apenas números inteiros

        //Permite apenas números inteiros ou com ponto flutuante 

        //Limita as casas decimais

        if (!fromModelChange || this.fc?.dirty) {

            if (this.type == "number" && typeof this.inputValue === "number") {
                this.inputValue = String(this.inputValue);
            }

            this.fc?.setValue(this.inputValue);
            this.fc?.markAsDirty();
            this.fc?.markAsTouched();
            this.customChangeCallback();
        }

        if (fromModelChange) {
            this.eventsService.publish("input-value-changed", {value: this.inputValue, formControlName: this.formControlName, uniqueIndex: this.uniqueIndex});
        }

        this.updateDateInputValue();

    }

    private updateDateInputValue() {

        //Atualiza a data do calendário Owl
        if (this.type == "date") {
            
            if (this.inputValue) {

                let words:string[] = this.inputValue.split("-");
                let currentFormat:"us"|"br" = words[0].length == 4 ? "us" : "br";
    
                if (currentFormat == "us") {
                    this.inputValue = invertDate(this.inputValue, "us", "-", null);
                    this.fc?.setValue(this.inputValue, {emitEvent: false});
                    this.fc?.markAsDirty();
                    this.fc?.markAsTouched();
                    this.customChangeCallback();

                }

                this.owlDate = moment(invertDate(this.inputValue, "br", null, "-")).toDate();

            }
            
        }

    }

    /**
     * Ao interagir com o campo
     * @param event 
     */
    public eventHandler(event?:any) {

        if (event) {

            //Ao apertar enter
            if (this.ajaxRoute == "app-functions" && event?.keyCode == 13) {
    
                this.eventsService.publish("input-value-changed", {value: this.inputValue, formControlName: this.formControlName, uniqueIndex: this.uniqueIndex});
            }

        }

    }

  	/**
	 * Observa clique em algum elemento da lista
	 */
    public onClickPasswordEye() {

        this.type = this.type === 'password' ?  'text' : 'password';

        if (this.iconInside == "eye-open") {
            this.iconInside = "eye-closed";

        } else if (this.iconInside == "eye-closed") {
            this.iconInside = "eye-open";
        }

	}

    /**
     * Ao clicar no botão de fora do campo
     */
    public onClickOutsideButton() {
		this.eventsService.publish("input-outside-callback", {formControlName: this.formControlName, uniqueIndex: this.uniqueIndex});
    }

    /**
     * Ao clicar no campo que é um seletor
     */
    public async onClickSelect() {

        if (this.type == "select" && !this.disabled) {

            if (this.modal) {

                let modal = await this.modalCtrl.create({
                    component: SelectModalPage,
                    backdropDismiss: false,
                    cssClass: "custom-select-modal",
                    showBackdrop: true,
                    componentProps: {
                        formControlValue: this.fc?.value,
                        formControlName: this.formControlName,
                        multiple: this.multiple,
                        items: this.items,
                        ajaxRoute: this.ajaxRoute,
                        ajaxParams: this.ajaxParams,
                        citySelect: this.citySelect,
                        vehicleSelect: this.vehicleSelect,
                        boldOptionLabel: this.boldOptionLabel,
                        searchPlaceholder: this.searchPlaceholder,
                        selectedOptionsKeysList: this.selectValueKeys,
                        title: this.title,
                        subtitle: this.placeholder,
                        keyName: this.keyName,
                        returnValue: this.returnValue
                    }
                });
        
                modal.present();

            } else {

                this.alertService.create({
                    formControlName: this.formControlName,
                    type: "select",
                    multiple: this.multiple,
                    items: this.items,
                    citySelect: this.citySelect,
                    vehicleSelect: this.vehicleSelect,
                    activeKeys: this.selectValueKeys,
                    keyName: this.keyName,
                    returnValue: this.returnValue,
                });

            }

        }

    }

}
