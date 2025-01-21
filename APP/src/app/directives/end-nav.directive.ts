import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[endNavHost]',
})
export class EndNavDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
