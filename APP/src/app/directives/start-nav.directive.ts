import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[startNavHost]',
})
export class StartNavDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
