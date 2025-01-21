import { Type } from "@angular/core";
import { NavWidget } from "src/app/components/nav-widget.component";

import { BrowserComponent } from "../components/browser/browser.component";

import { LayerListComponent } from "../components/layer-list/layer-list.component";

import { ConsultasBasicasComponent } from "src/app/projects/alcon/consultas-basicas/consultas-basicas.component";




export const WIDGET_COMPONENT_MAP: {[key:string]: Type<NavWidget>} = {
    toc: LayerListComponent,
    browse: BrowserComponent,
    queryAlcon: ConsultasBasicasComponent,

}