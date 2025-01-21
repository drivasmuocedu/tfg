import {ThemePalette} from '@angular/material/core';

export interface iBrowserProduct {
    name?: string;
    title?: string;
    completed?: boolean;
    color?: ThemePalette;
    pk?: string;
    id?: string;
    extent?: any;
    webmapTitle?: string
    open?: boolean;
    visible?: boolean;
    layers?: iBrowserProductLayer[];
    children?: iBrowserProductLayer[];
    }
  
    export class BrowserProduct implements iBrowserProduct {
      name?: string;
      title?: string;
      completed?: boolean;
      color?: ThemePalette;
      pk?: string;
      id?: string;
      extent?: any;
      webmapTitle?: string;
      open?: boolean;
      visible?: boolean;
      layers?: iBrowserProductLayer[] = []
      children?: iBrowserProductLayer[] = [];
   
      constructor(browserProduct?: iBrowserProduct) {
        if (browserProduct) {
          this.name = browserProduct.name;
          this.title = browserProduct.title;
          this.completed = browserProduct.completed;
          this.color = browserProduct.color;
          this.pk = browserProduct.pk;
          this.id = browserProduct.id;
          this.extent = browserProduct.extent;
          this.webmapTitle = browserProduct.webmapTitle;
          this.open = browserProduct.open;
          this.visible = browserProduct.visible;
          this.layers = browserProduct.layers;
          this.children = browserProduct.children;
        }
      }
    }
  
  
  
    export interface iBrowserProductLayer extends iBrowserProduct {
      url?: string;
      subid?: string;
      type?: string;
    }
  
    export class BrowserProductLayer implements iBrowserProductLayer {
      name?: string;
      title?: string;
      url?: string;
      completed?: boolean;
      color?: ThemePalette;
      pk?: string;
      id?: string;
      subid?: string;
      type?: string;
      extent?: any;
      webmapTitle?: string;
      open?: boolean;
      visible?: boolean;
      layers?: iBrowserProductLayer[] | undefined = [];
      children?: iBrowserProductLayer[] = [];
   
      constructor(browserProductLayer?: iBrowserProductLayer) {
        if (browserProductLayer) {
          this.name = browserProductLayer.name;
          this.title = browserProductLayer.title;
          this.url = browserProductLayer.url;
          this.completed = browserProductLayer.completed;
          this.color = browserProductLayer.color;
          this.pk = browserProductLayer.pk;
          this.id = browserProductLayer.id;
          this.subid = browserProductLayer.subid;
          this.type = browserProductLayer.type;
          this.extent = browserProductLayer.extent;
          this.webmapTitle = browserProductLayer.webmapTitle;
          this.open = browserProductLayer.open;
          this.visible = browserProductLayer.visible;
          this.layers = browserProductLayer.layers;
          this.children = browserProductLayer.children;
        }
      }
    }

    


  