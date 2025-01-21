import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayerlistService {
  _lastItemId = ''
  private _firtsload = false;
  constructor() { }

  get lastItemId() : string{
    return this._lastItemId;
  }

  set lastItemId(id: string) {
    this._lastItemId = id;
  }

  get firtsload() : boolean{
    return this._firtsload;
  }

  set firtsload(option: boolean) {
    this._firtsload = option;
  }
}
