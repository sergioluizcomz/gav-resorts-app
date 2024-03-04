import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
	selector: "[customForm]"
})
export class CustomFormDirective {

	@Input("customForm") form: FormGroup;

	private formEl:any;
	private submitBtnEl:ElementRef;

	private globalInstance:any = null;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2

	) {
		
	}

	//Ao carregar a diretiva
	ngOnInit() {

		this.formEl = this.element.nativeElement;
		this.submitBtnEl = this.formEl.querySelector("button[type='submit']");

	}

	//Ao carregar a página
	ngAfterViewInit() {

		if (this.submitBtnEl) {
			
			this.globalInstance = this.renderer.listen(this.submitBtnEl, "click", (e) => {
				this.validateAllFormFields(this.form);
			});
			
		}

	}

	//Ao destruir o componente
	ngOnDestroy() {

		if (this.globalInstance) {
			this.globalInstance();
		}

	}

	/**
	 * Realiza a validação de todos os campos do formulário
	 * @param formGroup 
	 */
	public validateAllFormFields(formGroup:FormGroup) {

		Object.keys(formGroup.controls || []).forEach(field => {

			let control = formGroup.get(field);

			if (control instanceof FormControl) {
				control.markAsTouched({onlySelf: true});
				control.markAsDirty({onlySelf: true});

			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);

			} else if (control instanceof FormArray) {

				control.controls.forEach(field2 => {
					this.validateAllFormFields((field2 as FormGroup));
				});

			}

		});

	}

}
