import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Coordinate } from 'ol/coordinate';
import { getPointResolution } from 'ol/proj';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  printForm!:FormGroup;
  constructor(private formBuilder: FormBuilder,
    private mapService: MapService) { }

  ngOnInit(): void {
    this.printForm = this.formBuilder.group({
      size: [null],
      resolution: [null],
      scale: [null]
    })
//https://openlayers.org/en/latest/examples/print-to-scale.html
//http://viglino.github.io/ol-ext/examples/canvas/map.control.printdialog.html
//http://116.203.139.184:8787/geoserver/web/wicket/bookmarkable/org.geoserver.printing.PrintDemoPage;jsessionid=5F10E532AFB21DBDC0B8D63C0883418F
   //https://gis.stackexchange.com/questions/265180/geoserver-printing-module-mapfish-print-service-wont-print
this.printForm.controls['scale'].valueChanges.subscribe(scale => {
      const scaleResolution =
      scale /
      getPointResolution(
        this.mapService.map.getView().getProjection(),
        this.printForm.controls['resolution'].value / 25.4,
        this.mapService.map.getView().getCenter() as Coordinate
      );
      this.mapService.map.getView().setResolution(scaleResolution);
    });
  }


  

}
