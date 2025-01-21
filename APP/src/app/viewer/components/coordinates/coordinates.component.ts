import { Component, Input, OnInit } from '@angular/core';
import {toStringHDMS} from 'ol/coordinate.js';
import { Feature, View } from 'ol';
import * as olProj from 'ol/proj';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from 'src/app/services/map.service';
import { Source } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { Point } from 'ol/geom';
import proj4 from 'proj4';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-coordinates',
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.scss']
})
export class CoordinatesComponent implements OnInit {
  @Input('coordinatesOverlay') coordinatesOverlay: any;
  coordinatesForm!:FormGroup;
  UTMForm!:FormGroup;
  coordinatesHDMSForm!:FormGroup;
  HDMS = false;
  UTM = false;
  GEOGRAPHIC = true;
  markers!: VectorLayer<any>;
  source: VectorSource = new VectorSource();
  utm = '+proj=utm +ellps=GRS80 +units=m +no_defs +zone=30N';
  latlon = '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs';
  constructor(private mapService: MapService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.coordinatesForm = this.formBuilder.group({
      lon: [null, [Validators.required]],
      lat: [null, [Validators.required]]
    });

    this.UTMForm = this.formBuilder.group({
      lon: [null, [Validators.required]],
      lat: [null, [Validators.required]]
    });

    this.coordinatesHDMSForm = this.formBuilder.group({
      lond: [null],
      lonm: [null],
      lons: [null],
      latd: [null],
      latm: [null],
      lats: [null]
    });
  }

  ngAfterViewInit() : void {
    // Remove measurement on close
    this.coordinatesOverlay.on("change:visible", (e: any) => { 
     if (e.visible) {
      this.markers = new VectorLayer({
        source: this.source,
        style: new Style({
          image: new Icon({
            scale: 0.1,
            src: 'assets/images/markerPink.png'
          })
        })
      });
      this.mapService.map.addLayer(this.markers);
     } else {
      this.markers.getSource().clear();
      this.mapService.map.removeLayer(this.markers);
     }
   });
   }

  goToCoordinate() {
    this.markers.getSource().clear();
    //const coord = [this.coordinatesForm.value.coordinateX, this.coordinatesForm.value.coordinateY];
    //const out = toStringHDMS(coord);
    let center;
    if(this.HDMS && this.coordinatesHDMSForm.value.lond && this.coordinatesHDMSForm.value.latd) {
      let lon = (this.coordinatesHDMSForm.value.lond < 0 ? -1 : 1) * Number(this.coordinatesHDMSForm.value.lond) + Number(this.coordinatesHDMSForm.value.lonm) / 60 + Number(this.coordinatesHDMSForm.value.lons) / 3600;
      lon = (this.coordinatesHDMSForm.value.lond < 0 ? -1 : 1) * Math.round(lon * 10000000) / 10000000;
      let lat = (this.coordinatesHDMSForm.value.latd < 0 ? -1 : 1) * Number(this.coordinatesHDMSForm.value.latd) + Number(this.coordinatesHDMSForm.value.latm) / 60 + Number(this.coordinatesHDMSForm.value.lats) / 3600;
      lat = (this.coordinatesHDMSForm.value.latd < 0 ? -1 : 1) * Math.round(lat * 10000000) / 10000000;
      center = olProj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
    } else if(this.UTM && this.UTMForm.value.lon && this.UTMForm.value.lat) {
      const b = proj4(
        this.utm,
        this.latlon,
        [this.UTMForm.value.lon, this.UTMForm.value.lat]);
        center = olProj.transform(b, 'EPSG:4326', 'EPSG:3857');
    } else if (this.coordinatesForm.value.lon && this.coordinatesForm.value.lat) {
      center = olProj.transform([this.coordinatesForm.value.lon, this.coordinatesForm.value.lat], 'EPSG:4326', 'EPSG:3857');    
    } else{
      center = null;
    }
    if (center) {
      this.mapService.map.setView(new View({
        center:center,
        zoom: 23
      }));
      var marker = new Feature(new Point(center));
      //this.markers.getSource().addFeature(marker);
      this.mapService.map.updateSize()
    } else {
      this.notificationService.openSnackBar(this.translate.instant('select-coordinates'),"snack-bar-error")
    }
    
  }
  
    changeToHDMS() {
      let coord: any;
      if (this.GEOGRAPHIC && this.coordinatesForm.value.lon && this.coordinatesForm.value.lat) {
        coord = [this.coordinatesForm.value.lon, this.coordinatesForm.value.lat];      
      } else if (this.UTM && this.UTMForm.value.lo && this.UTMForm.value.lat) {
          const a = proj4(
          this.utm,
          this.latlon,
          [this.UTMForm.value.lon, this.UTMForm.value.lat]);
          coord = [a[0], a[1]]
      }
      if (coord) {
        const s = toStringHDMS(coord);
        let seconds = s.indexOf('″');
        let minutes = s.indexOf('′');
        let grades = s.indexOf('°');
        let c: string[];
      if (seconds != -1) {
        c = s.replace(/(N|S|E|W)/g, '').split('″');
      } else if (minutes != -1) {
        c = s.replace(/(N|S|E|W)/g, '').split('′');
      } else {
        c = s.replace(/(N|S|E|W)/g, '').split('°');
      }

        c[1] = c[1].trim().split(' ') as any;
        this.coordinatesHDMSForm.controls['lond'].setValue((/W/.test(s) ? -1 : 1) * parseInt(c[1][0]));
        this.coordinatesHDMSForm.controls['lonm'].setValue(parseInt(c[1][1]) ? parseInt(c[1][1]) : 0);
        this.coordinatesHDMSForm.controls['lons'].setValue(parseInt(c[1][2]) ? parseInt(c[1][2]) : 0);
    
        c[0] = c[0].trim().split(' ') as any;
        this.coordinatesHDMSForm.controls['latd'].setValue((/S/.test(s) ? -1 : 1) * parseInt(c[0][0]));
        this.coordinatesHDMSForm.controls['latm'].setValue(parseInt(c[0][1]) ? parseInt(c[0][1]) : 0);
        this.coordinatesHDMSForm.controls['lats'].setValue(parseInt(c[0][2]) ? parseInt(c[0][2]) : 0);
    }
        this.HDMS = true;
        this.GEOGRAPHIC = false;
        this.UTM = false;
        //34° 54′ N 34° 46′ 48″ E
    }
  
    changeToGeographic() {
      if (this.HDMS && this.coordinatesHDMSForm.value.lond && this.coordinatesHDMSForm.value.latd) {
        let lon = (this.coordinatesHDMSForm.value.lond < 0 ? -1 : 1) * Number(this.coordinatesHDMSForm.value.lond) + Number(this.coordinatesHDMSForm.value.lonm) / 60 + Number(this.coordinatesHDMSForm.value.lons) / 3600;
        this.coordinatesForm.controls['lon'].setValue((this.coordinatesHDMSForm.value.lond < 0 ? -1 : 1) * Math.round(lon * 10000000) / 10000000);
        let lat = (this.coordinatesHDMSForm.value.latd < 0 ? -1 : 1) * Number(this.coordinatesHDMSForm.value.latd) + Number(this.coordinatesHDMSForm.value.latm) / 60 + Number(this.coordinatesHDMSForm.value.lats) / 3600;
        this.coordinatesForm.controls['lat'].setValue((this.coordinatesHDMSForm.value.latd < 0 ? -1 : 1) * Math.round(lat * 10000000) / 10000000);
      } else if (this.UTM && this.UTMForm.value.lo && this.UTMForm.value.lat){ 
        const a = proj4(
          this.utm,
          this.latlon,
          [this.UTMForm.value.lon, this.UTMForm.value.lat]);
          this.coordinatesForm.controls['lon'].setValue(a[0])
          this.coordinatesForm.controls['lat'].setValue(a[1])
      }

      this.HDMS = false;
      this.UTM = false;
      this.GEOGRAPHIC = true;

    }

    changeToUTM() {
      let coord: any;
      if (this.GEOGRAPHIC && this.coordinatesForm.value.lon && this.coordinatesForm.value.lat) {
        coord = [this.coordinatesForm.value.lon, this.coordinatesForm.value.lat];

      } else if (this.HDMS && this.coordinatesHDMSForm.value.lond && this.coordinatesHDMSForm.value.latd){
        let lon = (this.coordinatesHDMSForm.value.lond < 0 ? -1 : 1) * Number(this.coordinatesHDMSForm.value.lond) + Number(this.coordinatesHDMSForm.value.lonm) / 60 + Number(this.coordinatesHDMSForm.value.lons) / 3600;
        lon = (this.coordinatesHDMSForm.value.lond < 0 ? -1 : 1) * Math.round(lon * 10000000) / 10000000;
        let lat = (this.coordinatesHDMSForm.value.latd < 0 ? -1 : 1) * Number(this.coordinatesHDMSForm.value.latd) + Number(this.coordinatesHDMSForm.value.latm) / 60 + Number(this.coordinatesHDMSForm.value.lats) / 3600;
        lat = (this.coordinatesHDMSForm.value.latd < 0 ? -1 : 1) * Math.round(lat * 10000000) / 10000000;
        coord = [lon, lat];
      };
      this.UTM = true;
      this.HDMS = false;
      this.GEOGRAPHIC = false;
      const a = proj4(
        this.latlon,
        this.utm,
        coord
      )
      this.UTMForm.controls['lon'].setValue(a[0])
      this.UTMForm.controls['lat'].setValue(a[1])
      
    }

}
