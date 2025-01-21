import { Injectable } from '@angular/core';
import { BrowserLayerGroup, BrowserLayer } from 'src/app/models/browser.model';

@Injectable()
export class BrowserService {
  private _browserLayerGroups: BrowserLayerGroup[] = [];
  private _browserLayers: BrowserLayer[] = [];
  private _firtsload = false;

  constructor() { }

  get browserLayerGroups() : BrowserLayerGroup[]{
    return this._browserLayerGroups;
  }

  set browserLayerGroups(browserLayerGroups: BrowserLayerGroup[]) {
    this._browserLayerGroups = browserLayerGroups;
  }

  get browserLayers() : BrowserLayer[]{
    return this._browserLayers;
  }

  set browserLayers(browserLayers: BrowserLayer[]) {
    this._browserLayers = browserLayers;
  }

  get firtsload() : boolean{
    return this._firtsload;
  }

  set firtsload(option: boolean) {
    this._firtsload = option;
  }
  
}
