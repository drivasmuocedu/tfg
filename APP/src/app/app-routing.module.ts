import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewerComponent } from './viewer/viewer.component';

const routes: Routes = [

  { path: 'gis/:id', component: ViewerComponent },
  //{ path: 'projects', component: ProjectGridComponent },

  { path: '**', redirectTo: 'gis/cacao' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
