import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  template: '',
})
export abstract class NavWidget {
  @Output()
  close = new EventEmitter();
}
