import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[press]'
})
export class PressDirective {
    
    @Output() press = new EventEmitter();
    private timeout: any;

    constructor(
    ) {
    }

    @HostListener('touchstart', ['$event'])
    @HostListener('mousedown', ['$event'])
    onPressStart(event: Event) {

        let listBody:HTMLElement = document.getElementsByClassName("list-body")[0] as HTMLElement;
        let rectTop = listBody ? listBody.getBoundingClientRect().top : null;

        this.timeout = setTimeout(() => {

            if (!listBody || rectTop == listBody.getBoundingClientRect().top) {
                this.press.emit(event);
            }

        }, 400);

    }
    
    @HostListener('touchend')
    @HostListener('mouseup')
    onPressEnd() {
        clearTimeout(this.timeout);
    }
    
}
