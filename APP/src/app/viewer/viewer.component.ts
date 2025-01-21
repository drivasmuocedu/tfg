import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EndNavDirective } from '../directives/end-nav.directive';
import { StartNavDirective } from '../directives/start-nav.directive';
import { ViewerWidget } from '../models/viewer.model';
import { WIDGET_COMPONENT_MAP } from './models/widget.model';
// @ts-ignore
import Overlay from 'ol-ext/control/Overlay'
// @ts-ignore
import Toggle from 'ol-ext/control/Toggle'
import { MapService } from '../services/map.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { BrowserService } from '../services/browser.service';
import { ConsultaService } from '../services/consulta.service';
// @ts-ignore

import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';


import axios from 'axios';
import proj4 from 'proj4';
import * as olProj from 'ol/proj';
import { Point } from 'ol/geom';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  providers: [MapService, ProjectService, BrowserService, ConsultaService],
  animations: [
    trigger('toolbarSlide', [
      state('*', style({ marginLeft: 'calc(-100% - 320px)', opacity: 0 })),
      state('expanded', style({ marginLeft: '0', opacity: 1 })),
      transition('* => *', [animate('240ms cubic-bezier(0.25, 0.8, 0.25, 1)')]),
    ]),
    trigger('sidenavSlide', [
      state('*', style({ width: '48px' })),
      state('expanded', style({ width: '128px' })),
      transition('* => *', [animate('160ms cubic-bezier(0.25, 0.8, 0.25, 1)')]),
    ]),
    trigger('tabState', [
      state('default', style({transform: 'translateY(0)'})),
      state('open', style({
        bottom: 'initial',
        top: '44%',
        height: '100%'
      })),
      transition('default <=> open', animate(150))
    ]),
    trigger('mapState', [
      state('default', style({height: '100%'})),
      state('open', style({height: 'calc(100% - 53%)'})),
      transition('default <=> open', animate(150))
    ])
  ],
})



export class ViewerComponent implements OnInit {
  @ViewChild(StartNavDirective, { static: true }) startNavHost!: StartNavDirective;
  @ViewChild(EndNavDirective, { static: true }) endNavHost!: EndNavDirective;
  @ViewChild('divCoordinates', {static: true}) divCoordinatesRef!: ElementRef;
  @ViewChild('divBaseLayers', {static: true}) divBaseLayersRef!: ElementRef;
  @ViewChild('divMeasure', {static: true}) divMeasureRef!: ElementRef;
  @ViewChild('divArea', {static: true}) divAreaRef!: ElementRef;

  measureOverlay!:Overlay;
  areaOverlay!:Overlay;
  coordinatesOverlay!:Overlay;
  isExpanded: boolean = false;

  selStartWidget?: string;
  selEndWidget?: string;
  startNavWidgets: ViewerWidget[] = [];
  endNavWidgets: ViewerWidget[] = [];

  state = 'default';
  mapState = 'default';
  tablehide = true;
  project!: string;

  userDetailSubscription!: Subscription;
  utm = '+proj=utm +ellps=GRS80 +units=m +no_defs +zone=30N';
  latlon = '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs';

  constructor(
    private mapService: MapService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private browserService: BrowserService) { }

  ngOnInit(): void {
    const coordsDiv = document.getElementById('coordinates');

    // Evento para actualizar las coordenadas al mover el puntero
    this.mapService.map.on('click',  (evt) => {
      const coords = olProj.toLonLat(evt.coordinate); // Convertir coordenadas a [long, lat]
      const lon = coords[0].toFixed(14);
      const lat = coords[1].toFixed(14);
      console.log(`ee.Feature(ee.Geometry.Point([${lon}, ${lat}]), {'Class': 0}),`)
      if(coordsDiv)
      coordsDiv.innerHTML = `Longitud: ${lon}, Latitud: ${lat}`;
    });

    //const widgets = await ConfigAPI.loadWidgets(scenario.id);
    const widgets: ViewerWidget[] = [
      {id: 1, name:'toc', title: 'Capas', icon:'layers', position: 'start', default: true, order: 1},
      {id: 2, name:'browse', title: 'Navegador', icon:'search', position: 'start', default: true, order: 2},
      {id: 6, name:'queryAlcon', title: 'Consultas básicas', icon:'date_range', position: 'start', default: true, order: 5},
      //{id: 7, name:'edition', title: 'Edición', icon:'edit', position: 'start', default: true, order: 7}
    ]
    this.startNavWidgets = widgets.filter((widget) => widget.position === 'start').sort((widget1, widget2) => widget1.order - widget2.order);
    this.endNavWidgets = widgets.filter((widget) => widget.position === 'end').sort((widget1, widget2) => widget1.order - widget2.order);
    this.toggleStartDrawer('browse', true);
    this.coordinatesWidget();
    this.measureWidget();
    this.areaWidget();
    this.baselayersWidget();

  }

  ngOnDestroy() {

  }

  toggleEndDrawer(name: string, keepOpen?: boolean) {
    if (this.selEndWidget === name && !keepOpen) {
      this.selEndWidget = undefined;
    } else {
      this.selEndWidget = name;
      const widget = this.endNavWidgets.find((widget) => widget.name === name);
      const viewContainerRef = this.endNavHost.viewContainerRef;
      viewContainerRef.clear();
      if (widget) {
        const component = viewContainerRef.createComponent(WIDGET_COMPONENT_MAP[widget.name]!);
        component.instance.close.subscribe(() => {
          this.selEndWidget = undefined;
        });
      }
    }
  }

  toggleStartDrawer(name: string, keepOpen?: boolean) {
    if (this.selStartWidget === name && !keepOpen) {
      this.selStartWidget = undefined;
    } else {
      this.selStartWidget = name;
      const widget = this.startNavWidgets.find((widget) => widget.name === name);
      const viewContainerRef = this.startNavHost.viewContainerRef;
      
      viewContainerRef.clear();
      if (widget) {
        const component = viewContainerRef.createComponent(WIDGET_COMPONENT_MAP[widget.name]!);
        component.instance.close.subscribe(() => {
          this.selStartWidget = undefined;
        });
      }
    }
  }

  onDrawerClosed(side: 'start' | 'end') {
    if (side === 'start') {
      this.startNavHost.viewContainerRef.clear();
    } else if (side === 'end') {
      this.endNavHost.viewContainerRef.clear();
    }
  }

  onLogoClick() {
    //this.sessionService.saveSession();
    const allLayers = this.mapService.map.getLayerGroup().getLayers().getArray()
    const noInitialLayert = allLayers.slice(6, allLayers.length);
    //tenemos la capa de geocoder + las capas base (5)
    noInitialLayert.forEach(layer => {
      this.mapService.map.removeLayer(layer);
    })
    this.router.navigate(['/main']);
  }

  onLogoutClick() {
    this.router.navigate(['/main']);
  }

  onComeIn() {
    if (this.state === 'open') {
      this.tablehide = true;
    } else {
      this.tablehide = false;
    }
    this.state === 'default' ? this.state = 'open' : this.state = 'default';
    this.mapState === 'default' ? this.mapState = 'open' : this.mapState = 'default';
  }

  baselayersWidget() {
   // Overlay baselayers
   let bsmOverlay = new Overlay ({
    closeBox : true,
    className: "slide-right bsm",
    content: this.divBaseLayersRef.nativeElement
  });
  this.mapService.map.addControl(bsmOverlay);
   // A toggle control to show/hide the baselayers
   var bsm = new Toggle(
    {	html: '<i class="fas fa-layer-group"></i>',
      className: "bsm",
      title: "Capas base",
      onToggle: function() { bsmOverlay.toggle(); }
    });
  this.
  mapService.map.addControl(bsm);
  }

  areaWidget() { 
// Overlay baselayers
this.areaOverlay = new Overlay ({
  closeBox : true,
  className: "slide-right area",
  content: this.divAreaRef.nativeElement
});
this.mapService.map.addControl(this.areaOverlay);
 // A toggle control to show/hide the baselayers
 let area = new Toggle(
  {	html: '<i class="fa-solid fa-chart-area"></i>',
    className: "area",
    title: "Area",
    onToggle: () => { 
      this.areaOverlay.toggle(); 
    }
  });
  this.mapService.map.addControl(area);
  }

  measureWidget() { 
 // Overlay baselayers
 this.measureOverlay = new Overlay ({
  closeBox : true,
  className: "slide-right measure",
  content: this.divMeasureRef.nativeElement
});
this.mapService.map.addControl(this.measureOverlay);
 // A toggle control to show/hide the baselayers
 let measure = new Toggle(
  {	html: '<i class="fa-solid fa-ruler"></i>',
    className: "measure",
    title: "Medición",
    onToggle: () => { 
      this.measureOverlay.toggle(); 
    }
  });
  this.mapService.map.addControl(measure);
  }

  coordinatesWidget() {
    // Overlay baselayers
   this.coordinatesOverlay = new Overlay ({
      closeBox : true,
      className: "slide-right coordinates",
      content: this.divCoordinatesRef.nativeElement
    });
    this.mapService.map.addControl(this.coordinatesOverlay);
     // A toggle control to show/hide the baselayers
     let coordinates = new Toggle(
      {	html: '<i class="fa-solid fa-location-dot"></i>',
        className: "coordinates",
        title: "Ir a coordenada",
        onToggle: () => { this.coordinatesOverlay.toggle(); }
      });
  this.mapService.map.addControl(coordinates);
  }

}
