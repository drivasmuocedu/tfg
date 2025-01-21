import {ThemePalette} from '@angular/material/core';


    export class BrowserLayer {
      name?: string;
      title?: string;
      completed?: boolean;
      color?: ThemePalette;
      pk?: string;
      id?: string;
      extent?: any;
      url?: string;
      loaded?: boolean;
      loading?: boolean;
      layer?: any;

   
      constructor(browserLayers?: BrowserLayer) {
        if (browserLayers) {
          this.name = browserLayers.name;
          this.title = browserLayers.title;
          this.completed = browserLayers.completed;
          this.color = browserLayers.color;
          this.pk = browserLayers.pk;
          this.id = browserLayers.id;
          this.extent = browserLayers.extent;
          this.url = browserLayers.url;
          this.loaded = browserLayers.loaded;
          this.loading = browserLayers.loading;
          this.layer = browserLayers.layer;
        }
      }
    }


    export class BrowserLayerGroup {
      name!: string;
      title?: string;
      completed?: boolean;
      color?: ThemePalette;
      pk?: string;
      id?: string;
      extent?: any;
      url?: string;
      layers?: BrowserLayer[] | undefined = [];
      layer?:any;
      loaded?: boolean;
      loading?: boolean;

   
      constructor(browserGroupLayers?: BrowserLayerGroup) {
        if (browserGroupLayers) {
          this.name = browserGroupLayers.name;
          this.title = browserGroupLayers.title;
          this.completed = browserGroupLayers.completed;
          this.color = browserGroupLayers.color;
          this.pk = browserGroupLayers.pk;
          this.id = browserGroupLayers.id;
          this.extent = browserGroupLayers.extent;
          this.url = browserGroupLayers.url;
          this.layers = browserGroupLayers.layers;
          this.layer = browserGroupLayers.layer;
          this.loaded = browserGroupLayers.loaded;
          this.loading = browserGroupLayers.loading;
        }
      }
    }