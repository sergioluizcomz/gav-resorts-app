import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: "custom-list-filter",
	templateUrl: "./custom-list-filter.component.html",
})
export class CustomListFilterComponent implements OnInit {

	@Input() searchPlaceholder:string = "Encontre o que procura...";
	@Input() filters:any = null;
	@Input() searchText:string|null = null;
	@Input() onlyText:boolean = false;
	@Input() iconOutside:string|null = null;
	@Input() iconOutsideColor:string = "dark";

	public form:FormGroup;
	public isFilterActive:boolean = false;

	constructor(
		private formBuilder: FormBuilder,
	) {

		this.buildForm();

	}

	//Ao iniciar o componente
	ngOnInit() {
		
	}

	/**
	 * Ao modificar alguma informação do componente
	 */
	ngOnChanges() {
		
		this.isFilterActive = false;

		if (this.searchText) {
			this.isFilterActive = true;

		} else if (this.filters) {
			
			let filterKeys:any = Object.keys(this.filters);

			if (filterKeys && filterKeys.length > 0) {
	
				filterKeys.forEach((key:string) => {
					
					if (this.filters[key] && this.filters[key] != "all") {
						this.isFilterActive = true;
						return false;
					}
		
				});

			}

		}

		if (this.iconOutside == "filter" || this.iconOutside == "filter-solid") {
			this.iconOutside = this.isFilterActive ? "filter-solid" : "filter";
		}

	}

	/**
	 * Constrói o formulário
	 */
	public buildForm() {

		this.form = this.formBuilder.group({
			search: new FormControl({value: null, disabled: false}, []),
		});

	}

}
