import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import LayerGroup from 'ol/layer/Group';
import ImageLayer from 'ol/layer/Image';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import { EeAPI } from 'src/api/ee.api';
import { BrowserLayer } from 'src/app/models/browser.model';
import { BrowserService } from 'src/app/services/browser.service';
import { ConsultaService } from 'src/app/services/consulta.service';
import { MapService } from 'src/app/services/map.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-consultas-basicas',
  templateUrl: './consultas-basicas.component.html',
  styleUrls: ['./consultas-basicas.component.scss']
})
export class ConsultasBasicasComponent implements OnInit {
  @Output()
  close = new EventEmitter();
  partesLayers: {value: ImageLayer<any>, label: string}[] = [];
  dateRangeForm!: FormGroup;
  dateRangeStartFccreacion:any;
  dateRangeEndFccreacion:any;
  dateRangeStartFcaprob:any;
  dateRangeEndFcaprob:any;
  dateRangeStartFcfinprev:any;
  dateRangeEndFcfinprev:any;
  daterange:any;
  pipe = new DatePipe('es-ES');
  layerForm: FormGroup;
  optionsLayers: {value: ImageLayer<any>, label: string}[] = []
  optionsLayerGroups: {name: string, layers: any[]}[] = []
  browserLayers: BrowserLayer[] = [];
  
  constructor(private mapService: MapService,
    private consultaService: ConsultaService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private browserService: BrowserService) {
    this.dateRangeForm = this.formBuilder.group({
      fromDateFccreacion: new FormControl(this.dateRangeStartFccreacion),
      toDateFccreacion: new FormControl(this.dateRangeEndFccreacion),
    });
    this.layerForm = this.formBuilder.group({
      layer: [null]
    })
   }

  ngOnInit(): void {
    const layers = this.mapService.map.getLayerGroup().getLayers().getArray();
/*
    layers.forEach(async layer => {
      if(layer instanceof ImageLayer && 
        (layer.get('name') === 'partes_finalizados' || 
        layer.get('name') === 'partes_aprobados_sin_finalizar' ||
        layer.get('name') === 'partes_certificar_finalizacion' ||
        layer.get('name') === 'partes_nuevos' ||
        layer.get('name') === 'partes_pospuestos' ||
        layer.get('name') === 'partes_rechazados')) {      
      this.partesLayers.push({value: layer, label: layer.get('name')})
      }
    })
    */

    layers.forEach(async layer => {
      if(layer instanceof ImageLayer) {
        
      this.optionsLayers.push({value: layer, label: layer.get('name')})
      } else if(layer instanceof LayerGroup) {
        this.optionsLayerGroups.push({name: layer.get('name'), layers: layer.getLayersArray()})
      }
    })
    
  }

  get f(): { [key: string]: AbstractControl } {
    return this.dateRangeForm.controls
  }

  selectLayer(event: MatSelectChange) {
    
    this.setFilter(event.value)
    this.consultaService.updateConsultalayer(event.value)
  }

  setFilter(layer: string): void {
    this.dateRangeForm.reset();
    let layerJSON = JSON.parse(layer);
   
    let consultasNoGroup = this.consultaService.consultasBasicas.filter(consulta => !consulta?.group)
    let consulta = consultasNoGroup.slice().reverse().find(consulta => consulta.layer === layerJSON.layer);
    if(consulta) {
      this.dateRangeForm.controls['fromDateFccreacion'].setValue(consulta['fromDateFccreacion'] === undefined ? undefined: new Date(consulta['fromDateFccreacion']))
      this.dateRangeForm.controls['toDateFccreacion'].setValue(consulta['toDateFccreacion'] === undefined ? undefined: new Date(consulta['toDateFccreacion']))
    }
    /*
    if(consulta && consulta.formArray) {
      this.optionsField = cloneDeep(consulta.optionsField)
      this.optionsOperatorArr = cloneDeep(consulta.optionsOperatorArr)
      this.optionsValueArr =  cloneDeep(consulta.optionsValueArr)
      let formGroups = cloneDeep(consulta.formArray.controls);
        formGroups.forEach((fg: FormGroup) => {
          this.formArray.push(
            this.formBuilder.group({
              logic: fg.controls['logic'].value,
              field: [fg.controls['field'].value, [Validators.required]],
              type: fg.controls['type'].value,
              operator: [fg.controls['operator'].value, [Validators.required]],
              value: [fg.controls['value'].value, [Validators.required]],
            })
          )
      })
    }
    */
  
  }
 

onSearch() {
    const fromDateFccreacion = this.dateRangeForm.value.fromDateFccreacion != undefined ? this.pipe.transform(new Date(this.dateRangeForm.value.fromDateFccreacion), 'YYYY-MM-dd') as string: undefined; 
    const toDateFccreacion = this.dateRangeForm.value.toDateFccreacion != undefined ? this.pipe.transform(new Date(this.dateRangeForm.value.toDateFccreacion), 'YYYY-MM-dd') as string: undefined;
    console.log(fromDateFccreacion)
    console.log(toDateFccreacion)
    
    if(fromDateFccreacion && toDateFccreacion) {
      EeAPI.map(fromDateFccreacion, toDateFccreacion,this.consultaService.area).then(response => {
        console.log(response.url)
        let bl = []

        const DeforestationLayer = new TileLayer({     
          source: new XYZ({
            url: response.url,
          }),
        });
        DeforestationLayer.set('name','DeforestationLayer');
        bl.push({
          name: "Deforestacion_cacao",
          title: "Deforestación cacao",
          url: "",
          loaded: false,
          layer: DeforestationLayer,
        });
    
        this.browserLayers = bl;
      this.browserService.browserLayers = this.browserLayers;



      })
    }

  }

  getNameFromLayer(layer: any) {
    return JSON.stringify({'group': false, 'groupName': '', 'layer':  layer.get('name'), cql: layer.getSource().getParams()?.CQL_FILTER})
  }
  
  getNameFromGroup(layer: any, option: string, group?: any) {
    if (option === 'label') {
      return layer.get('name')
    } else {
      return JSON.stringify({'group': true, 'groupName': group.name, 'layer': layer.get('name'), cql: layer.getSource().getParams()?.CQL_FILTER})
    }
  }
  
  onClean() {

   //remove filter from form
   let layerJSON = JSON.parse(this.layerForm.value.layer);
   if (layerJSON){
   let layer: string;
   if(layerJSON.group) {
     layer = layerJSON.layer;
     this.consultaService.consultasBasicas = this.consultaService.consultasBasicas.filter(consulta => (consulta.group === true && consulta.layer != layer) || consulta.group === false)
   } else {
     layer = layerJSON.layer;
     this.consultaService.consultasBasicas = this.consultaService.consultasBasicas.filter(consulta => {
       if (consulta.group === false && consulta.layer === layer) {
         return false;
       } else if (consulta.group === true){
         return true
       } else {
         return true;
       }
   });  
   }
  
   //remove filter from WMS
   const layers = this.mapService.map.getLayerGroup().getLayers().getArray()
   layers.forEach(async layer => {
     if(!layerJSON.group && layerJSON.layer === layer.get('name') && layer instanceof ImageLayer) {
       let params = layer.getSource().getParams();
       delete params["CQL_FILTER"]
       layer.getSource().updateParams(params);
       //remove filter from attribute table
       this.consultaService.updateFilterlayer(null);
     } else if (layerJSON.group && layerJSON.groupName === layer.get('name') && layer instanceof LayerGroup) {
       let lyFromGroup = layer.getLayers().getArray().find(ly => ly.get('name') === layerJSON.layer);
       if (lyFromGroup && lyFromGroup instanceof ImageLayer) {
         let params = lyFromGroup.getSource().getParams();
         delete params["CQL_FILTER"]
         lyFromGroup.getSource().updateParams(params);
         //remove filter from attribute table
         this.consultaService.updateFilterlayer(null);
       }
     }
     });
    }
   //clean form
  this.dateRangeForm.reset()
  }

  onCloseClick() {
    this.close.emit();
  }

}

