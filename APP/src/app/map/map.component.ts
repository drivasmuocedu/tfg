import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { ImageWMS, OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import {ScaleLine, defaults as defaultControls} from 'ol/control.js';
import ImageLayer from 'ol/layer/Image';
import { MapService } from '../services/map.service';
import { Subscription } from 'rxjs';
import axios from 'axios';
import { MatDialog } from '@angular/material/dialog';
import { LayerlistService } from '../services/layerlist.service';
import { set } from 'ol/transform';
import Control from 'ol/control/Control';
import { BrowserService } from '../services/browser.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public map!: Map
  WMSInfoUrlSubscription!:Subscription;
  WMSInfoHTML!: string;
  body = false;
  WMSInfoFeatures: any[] = [];
  currentPage = 0;
  cardsPerPage = 1;


  constructor(private mapService: MapService,
    private layerListService: LayerlistService,
    private elementRef:ElementRef,
    public dialog: MatDialog,
    private renderer: Renderer2) { }

  ngOnInit(): void {

 }

 ngAfterViewInit() : void {
  setTimeout(() => {
    this.mapService.map.setTarget('map');
    this.mapService.divoverlay = this.elementRef.nativeElement.querySelector('#popup-content');
    this.mapService.interactionInfo=this.mapService.map.on('click', this.mapService.clickInfo.bind(this.mapService));


  }, 100);
}

ngOnDestroy(){
 
}

}
