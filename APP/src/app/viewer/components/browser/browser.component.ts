import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { Collection } from 'ol';
import LayerGroup from 'ol/layer/Group';
import ImageLayer from 'ol/layer/Image';
import { ImageWMS, XYZ } from 'ol/source';
import { BrowserLayerGroup, BrowserLayer } from 'src/app/models/browser.model';
import { BrowserProduct } from 'src/app/models/browserProduct.model';
import { getHeight, getWidth } from 'ol/extent';
import * as olProj from 'ol/proj';
import { MapService } from 'src/app/services/map.service';
import { ProjectService } from 'src/app/services/project.service';

// @ts-ignore
import Overlay from 'ol-ext/control/Overlay'
// @ts-ignore
import Toggle from 'ol-ext/control/Toggle'
import TileLayer from 'ol/layer/Tile';

import { BrowserService } from 'src/app/services/browser.service';


@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit {
  @Output()
  close = new EventEmitter();
  layers = true;
  layerGroups = false;
  browserProduct!: BrowserProduct;
  browserLayerGroups: BrowserLayerGroup[] = [];
  browserLayers: BrowserLayer[] = [];
  project!: string;
  messageFilterActive:string = 'Capas';
  filterActivechecked = true;
  selectedLayer?: any;
  selectedLayers?: any[] = [];
  selectedGoupLayers?: any[] = [];

  loading = false;

  
  constructor(
    private mapService: MapService,
    private projectService: ProjectService,
    private browserService: BrowserService,
    public dialog: MatDialog) { }

  ngOnInit(): void {   
    this.browserLayers = this.browserService.browserLayers
  }

  ngOnDestroy() {
  }

  async addLayer(layer: BrowserLayer) {
    layer.loaded = true;
    layer.loading = true;   
    this.mapService.map.addLayer(layer.layer);
    layer.loading = false;
    let selectedItemsList: any = this.browserLayers.filter(value =>  layer.name === value.name)
    this.projectService.selectedlayers = this.projectService.selectedlayers.map(obj => selectedItemsList.find((o: any) => o.name === obj.name) || obj);
    let layerLoadedInTree = this.projectService.selectedlayers.find((o: any) => o.name === selectedItemsList[0].name);

    if (selectedItemsList.length > 0 && !layerLoadedInTree) {
      this.projectService.selectedlayers.push(selectedItemsList[0]);
    }
  
  }

  removeLayer(layer: BrowserLayer) {
    layer.loaded = false;
    const layers = this.mapService.map.getLayerGroup().getLayers().getArray()
    layers.forEach(layerr => {
        this.mapService.map.removeLayer(layerr)

    })
    //this.mapService.map.removeLayer(layer.layer)
    this.projectService.selectedlayers = this.projectService.selectedlayers.filter((ly: BrowserLayer) => ly.name !== layer.layer.get('name'));
  }

  setMessageFilterActive(event:any){
    if(event.checked){
      this.messageFilterActive = 'Capas'
      this.filterActivechecked = true
     
  }else{
      this.messageFilterActive = 'Grupos de capas'
      this.filterActivechecked = false
  }
}

  onCloseClick() {
    this.close.emit();
  }
}
