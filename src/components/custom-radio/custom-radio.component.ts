import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, Input } from "@angular/core";
import { EventsService } from 'src/services/events/events.service';

@Component({
	selector: "custom-radio",
	templateUrl: "custom-radio.component.html"
})
export class CustomRadioComponent {

	@Input() form:FormGroup;
	@Input() fcName:string;
	@Input() inline:boolean = true;
	@Input() grid:boolean = false;
	@Input() label:string;
	@Input() iconLabel:string;
	@Input() info:string;
	@Input() options:any[];
    
	public fc:AbstractControl<any> | null;
    
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

        if (this.form) {

            this.fc = this.form.get(this.fcName);

            if (this.fc) {

                if (this.fc?.value) {
                    this.everHadAValue = true;
                }
        
                this.fc?.valueChanges.subscribe(value => {
        
                    if (value) {
                        this.everHadAValue = true;
                    }
        
                });
        
                if (this.fc?.value) {
                    this.onChange();
                }

            }

        }

	}

    /**
     * Callback do evento change: atualizar o valor na referência do FormControl
     */
    public onChange(fromModelChange:boolean = false) {

        if (!fromModelChange || this.fc?.dirty) {
            this.fc?.markAsDirty();
            this.fc?.markAsTouched();
        }

    }

}
