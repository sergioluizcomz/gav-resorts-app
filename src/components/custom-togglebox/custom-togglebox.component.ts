import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Component, Input } from "@angular/core";
import { EventsService } from 'src/services/events/events.service';

@Component({
	selector: "custom-togglebox",
	templateUrl: "custom-togglebox.component.html"
})
export class CustomToggleboxComponent {

	@Input() fc: AbstractControl<any> | null;
	@Input() inline:string|null = null;
	@Input() label:string;
	@Input() iconLabel:string;
	@Input() info:string;
	@Input() isChecked:boolean = false;

    public inputValue:any;
    public formControlName:string|null;

    public everHadAValue:boolean = false;
    public isFormSubmitted:boolean = false;
    public isFormValid:boolean = false;

    public formSubmitSubscription:any;

	constructor(
        private events: EventsService
	) {

        this.formSubmitSubscription = this.events.formSubmitSource.subscribe((data:any) => {
            this.isFormSubmitted = true;
            this.isFormValid = data;
        });

	}

    ngOnDestroy() {
        this.formSubmitSubscription.unsubscribe();
    }

	/**
	 * Ao carregar o componente
	 */
	ngOnInit() {

        if (this.fc) {

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
