import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { ImageWMS, OSM, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import {ScaleLine, defaults as defaultControls} from 'ol/control.js';
import Over from 'ol/Overlay';
import ImageLayer from 'ol/layer/Image';
import * as olProj from 'ol/proj';
import { BehaviorSubject, Observable } from 'rxjs';
import LayerGroup from 'ol/layer/Group';
// @ts-ignore
import SearchNominatim from 'ol-ext/control/SearchNominatim'
import {
  Circle,
  Fill,
  Stroke,
  Style,
  Text,
} from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import Icon from 'ol/style/Icon';
import { Vector as VectorSource }from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import * as Extent from 'ol/extent';
import { environment } from 'src/environments/environment';
import StreetView from 'ol-street-view';

@Injectable()
export class MapService {
  private _map!: Map;
  interactionInfo:any;
  overlay: any;
  divoverlay: any;
  private WMSInfoUrlSubject = new BehaviorSubject({url:'', evt:''});
  WMSInfoUrlSubject$: Observable<{url:string, evt:any}> = this.WMSInfoUrlSubject.asObservable();
  private _baselayer: any | null = null;
  private BaselayerSubject  = new BehaviorSubject(this._baselayer);
  BaselayerSubject$: Observable<any | null> = this.BaselayerSubject.asObservable();

  constructor() { 
    this.createMap();
  }


  get map() :Map {
    return this._map;
  }

  updateBaselayer(bs: any | null){
    this.BaselayerSubject.next(bs);
  }

  updateWMSInfoUrl(value: string, evt: any){
    this.WMSInfoUrlSubject.next({url: value, evt: evt});
  }

  createMap() {
    let control = new ScaleLine({
      units: 'metric',
    });

    var search = new SearchNominatim({
      //target: $(".options").get(0),
     // polygon: $("#polygon").prop("checked"),
      reverse: true,
      position: true	// Search, with priority to geo position
    });


    //const basemapURL = "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/" + basemapId + "?type=style&token=" + esriKey;


    this._map = new Map({
    controls: defaultControls().extend([control,search]),
    layers: [

      /*
      new ImageLayer({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new ImageWMS({
          url: 'https://ahocevar.com/geoserver/wms',
          params: {'LAYERS': 'topp:states'},
          ratio: 1,
          serverType: 'geoserver',
        }),
      }),
      */
     /*
      new ImageLayer({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new ImageWMS({
          url: 'http://localhost:8080/geoserver/tiger/wms',
          params: {'LAYERS': 'tiger-ny'},
          ratio: 1,
          serverType: 'geoserver',
          crossOrigin: null
        }),
      }),
      */
    ],
    view: new View({ 
      center: [-612593.7934515108, 834484.7454565684],
      zoom: 7,
      //maxZoom: 21,
      //minZoom:10 
    }),
  });
  
  //this._map.addLayer(esriStreets)

        // Current selection
        var sLayer = new VectorLayer({
          source: new VectorSource(),
          style: new Style({
            image: new Circle({
              radius: 5,
              stroke: new Stroke ({
                color: 'rgb(255,165,0)',
                width: 3
              }),
              fill: new Fill({
                color: 'rgba(255,165,0,.3)'
              })
            }),
            stroke: new Stroke ({
              color: 'rgb(255,165,0)',
              width: 3
            }),
            fill: new Fill({
              color: 'rgba(255,165,0,.3)'
            })
          })
        });
        this._map.addLayer(sLayer);
           // Select feature when click on the reference index
        search.on('select', (e: any) => {
          sLayer.getSource()?.clear();
          // Check if we get a geojson to describe the search
          if (e.search.geojson) {
            var format = new GeoJSON();
            var f = format.readFeature(e.search.geojson, { dataProjection: "EPSG:4326", featureProjection: this._map.getView().getProjection() }) as any;
            sLayer.getSource()?.addFeature(f);
            var view = this._map.getView();
            var resolution = view.getResolutionForExtent(f.getGeometry().getExtent(), this._map.getSize());
            var zoom = view.getZoomForResolution(resolution) as number;
            if(f.getGeometry())
            var center = Extent.getCenter(f.getGeometry().getExtent());
            // redraw before zoom
            setTimeout(function(){
              view.animate({
              center: center,
              zoom: Math.min (zoom, 16)
            });
            }, 100);
          } else {
            this._map.getView().animate({
              center:e.coordinate,
              zoom: Math.max (this._map.getView().getZoom() as number,16)
            });
          }
        });
  }

  map_info(){
    this.interactionInfo = this.map.on('click', this.clickInfo.bind(this));
 }

 clickInfo(evt: any){
  var pixel = evt.pixel;
  var coord = evt.coordinate;

   
 }


}
