import { Component, Input, OnInit } from '@angular/core';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { MapService } from 'src/app/services/map.service';
import {getArea, getLength} from 'ol/sphere';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import Draw from 'ol/interaction/Draw';
import {unByKey} from 'ol/Observable';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import GeoJSON from 'ol/format/GeoJSON';
import { ConsultaService } from 'src/app/services/consulta.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  @Input('areaOverlay') areaOverlay: any;
  listener: any;
  sketch: any;
  helpTooltipElement!: HTMLElement;
  helpTooltip!: Overlay;
  measureTooltipElement!: any;
  measureTooltip!: Overlay;
  continuePolygonMsg = 'Click para continuar dibujando el polígono';
  continueLineMsg = 'Click para continuar dibujando la línea';
  helpMsg = 'Click para empezar a dibujar';
  draw: any; // global so we can remove it later
  source = new VectorSource();
  measurement:string = 'length';
  vector = new VectorLayer({
    source: this.source,
    style: {
      'fill-color': 'rgba(255, 255, 255, 0.2)',
      'stroke-color': '#ffcc33',
      'stroke-width': 2,
      'circle-radius': 7,
      'circle-fill-color': '#ffcc33',
    },
  });

  constructor(private mapService: MapService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  private consultaService: ConsultaService) {
    this.matIconRegistry.addSvgIcon(
      'line',
    this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/line.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'polygon',
    this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/polygon.svg")
    );
   }

  ngOnInit(): void {
    const pointerMoveHandler = (evt: any) => {
      if (evt.dragging) {
        return;
      }

      if (this.sketch) {
        const geom = this.sketch.getGeometry();
        if (geom instanceof Polygon) {
          this.helpMsg = this.continuePolygonMsg;
        } else if (geom instanceof LineString) {
          this.helpMsg = this.continueLineMsg;
        }
      }
      
      if (this.helpTooltipElement) {
        this.helpTooltipElement.innerHTML = this.helpMsg;
        this.helpTooltip.setPosition(evt.coordinate);
        this.helpTooltipElement.classList.remove('hidden');
      }
    };


    this.mapService.map.on('pointermove', pointerMoveHandler);

    this.mapService.map.getViewport().addEventListener('mouseout', () => {
      if (this.helpTooltipElement) {
      this.helpTooltipElement.classList.add('hidden');
      }
    });

    /**
     * Let user change the geometry type.
     */
    //this.typeSelect.onchange = () => {
      //this.mapService.map.removeInteraction(this.draw);
      //this.addInteraction();
    //};
}


ngAfterViewInit() : void {
 // Remove measurement on close
 this.areaOverlay.on("change:visible", (e: any) => { 
  if (e.visible) {
    this.mapService.map.addLayer(this.vector);
    unByKey(this.mapService.interactionInfo)
  } else {
    if (this.source) this.source.clear();
    if (this.draw){
      this.mapService.map.removeInteraction(this.draw);
    }
    //if (this.helpTooltipElement) {
      //this.helpTooltipElement.parentNode?.removeChild(this.helpTooltipElement);
    //}
   this.mapService.map.getOverlays().clear();
   this.mapService.interactionInfo=this.mapService.map.on('click', this.mapService.clickInfo.bind(this.mapService));
   this.mapService.map.removeLayer(this.vector);
   // if (this.measureTooltipElement) {
     // this.measureTooltipElement.parentNode?.removeChild(this.measureTooltipElement);
      //this.measureTooltipElement = null;
   // }
  }
});
}

createMeasurement(type: string) {
  this.measurement = type;
  if (this.draw) {
    this.mapService.map.removeInteraction(this.draw);
  }
  this.addInteraction();
}

deleteMeasurement() {
  if (this.source) this.source.clear();
  this.mapService.map.getOverlays().clear();
  if (this.draw) {
    this.mapService.map.removeInteraction(this.draw);
  }
  this.addInteraction();
}

measurementChange (event: any) {
   this.mapService.map.removeInteraction(this.draw);
    this.addInteraction();
}

formatLength = (line: any) => {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm';
  }
  return output;
};

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
formatArea = (polygon: any) => {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
  } else {
    output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
  }
  return output;
};


addInteraction() {
  const type = this.measurement == 'area' ? 'Polygon' : 'LineString';
  this.draw = new Draw({
    source: this.source,
    type: type,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
      }),
    }),
  });
  this.mapService.map.addInteraction(this.draw);

  this.createMeasureTooltip();
  this.createHelpTooltip();

  this.draw.on('drawstart', (evt: any) => {
    // set sketch
    this.sketch = evt.feature;

    /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
    let tooltipCoord = evt.coordinate;

    this.listener = this.sketch.getGeometry().on('change', (evt: any) => {
      const geom = evt.target;
      let output;
      if (geom instanceof Polygon) {
        output = this.formatArea(geom);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof LineString) {
        output = this.formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
      }
      this.measureTooltipElement.innerHTML = output as any;
      this.measureTooltip.setPosition(tooltipCoord);
    });
  });

  this.draw.on('drawend', (evt: any) => {

    const drawnFeature = evt.feature;

  const geometry3857 = drawnFeature.getGeometry(); // Geometría en EPSG:3857

  // Reproyectar la geometría a EPSG:4326
  const geometry = geometry3857.clone().transform('EPSG:3857', 'EPSG:4326');

  // Convertir la geometría a GeoJSON
  const geojsonFormat = new GeoJSON();
  const geojsonObject = geojsonFormat.writeGeometryObject(geometry);
    this.consultaService.area = geojsonObject
  console.log('Geometría dibujada en GeoJSON:', geojsonObject);

    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
    this.measureTooltip.setOffset([0, -7]);
    // unset sketch
    this.sketch = null;
    // unset tooltip so that a new one can be created
    this.measureTooltipElement = null;
    this.createMeasureTooltip();
    unByKey(this.listener);
  });
}

/**
 * Creates a new help tooltip
 */
createHelpTooltip() {
  if (this.helpTooltipElement) {
    this.helpTooltipElement.parentNode?.removeChild(this.helpTooltipElement);
  }
  this.helpTooltipElement = document.createElement('div');
  this.helpTooltipElement.className = 'ol-tooltip hidden';
  
  this.helpTooltip = new Overlay({
    element: this.helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left',
  });
  this.mapService.map.addOverlay(this.helpTooltip);
}

/**
 * Creates a new measure tooltip
 */
createMeasureTooltip() {
  if (this.measureTooltipElement) {
    this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
  }
  this.measureTooltipElement = document.createElement('div');
  this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  this.measureTooltip = new Overlay({
    element: this.measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center',
    stopEvent: false,
    insertFirst: false,
  });
 // this.mapService.map.addOverlay(this.measureTooltip);
}

}
