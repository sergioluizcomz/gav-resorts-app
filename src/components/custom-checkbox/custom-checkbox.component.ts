import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Component, Input } from "@angular/core";
import { EventsService } from 'src/services/events/events.service';

@Component({
	selector: "custom-checkbox",
	templateUrl: "custom-checkbox.component.html"
})
export class CustomCheckboxComponent {

	@Input() fc: AbstractControl<any> | null;
    @Input() inline:string|null = null;
	@Input() label:string;
	@Input() iconLabel:string;
	@Input() iconColor:string|null = null;
	@Input() info:string;
	@Input() disabled:boolean = false; //se o campo está desabilitado
	@Input() isChecked:boolean = false;

    public inputValue:any;
    public formControlName:string|null;

    public everHadAValue:boolean = false;
    public isFormSubmitted:boolean = false;
    public isFormValid:boolean = false;

	constructor(
        private eventsService: EventsService
	) {

	}

    ngOnDestroy() {
        this.eventsService.unsubscribe("form-submit");
    }

	/**
	 * Ao carregar o componente
	 */
	ngOnInit() {

        this.eventsService.subscribe("form-submit", (data:any) => {
            this.isFormSubmitted = true;
            this.isFormValid = data;
        });

        if (this.fc) {

            this.disabled = this.fc?.disabled;

            let formGroup:FormGroup<any> | FormArray<any> | null = this.fc.parent;
            
            if (formGroup) {

                let formControls:any = formGroup.controls;

                this.formControlName = Object.keys(formControls).find(name => this.fc === formControls[name]) || null;
                this.inputValue = this.fc?.value;

                if (this.inputValue) {
                    this.everHadAValue = true;
                }
        
                this.fc?.valueChanges.subscribe(value => {

                    if (value) {
                        this.everHadAValue = true;
                    }

                    this.isChecked = !!value;

                });

                //Ao alterar o status do campo
                this.fc?.statusChanges.subscribe(value => {
                    this.disabled = !!this.fc?.disabled;
                });

                if (this.inputValue) {
                    this.onChange();
                }

                this.isChecked = !!this.fc.value;

            }

        }

	}

    /**
     * Para não abrir o teclado
     * @param event 
     */
    public onFocusIn(event?:any) {
        event.stopPropagation();
    }
    
    /**
     * Callback do evento change: atualizar o valor na referência do FormControl
     */
    public onChange(fromModelChange:boolean = false) {

        if (!fromModelChange || this.fc?.dirty) {
            this.fc?.setValue(this.inputValue);
            this.fc?.markAsDirty();
            this.fc?.markAsTouched();
        }

    }

}
