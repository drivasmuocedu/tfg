import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF, PlatformLocation, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import { MatSliderModule } from '@angular/material/slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { ViewerComponent } from './viewer/viewer.component';
import { LayerListComponent } from './viewer/components/layer-list/layer-list.component';
import { StartNavDirective } from './directives/start-nav.directive';

import { ThumbnailPlanPipe } from './pipes/thumbnail-project.pipe';
import { FilterProjectsPipe } from './pipes/filter-projects.pipe';
import { BrowserComponent } from './viewer/components/browser/browser.component';
import { SafePipe } from './pipes/safePipe.pipe';

import { MeasureComponent } from './viewer/components/measure/measure.component';
import { PrintComponent } from './viewer/components/print/print.component';
import { BaselayersComponent } from './viewer/components/baselayers/baselayers.component';
import { CoordinatesComponent } from './viewer/components/coordinates/coordinates.component';
import { AuthInterceptor } from './helpers/interceptor';
import { SecurePipe } from './pipes/secure.pipe';
import { ConsultasBasicasComponent } from './projects/alcon/consultas-basicas/consultas-basicas.component';
import { LayerTitlePipe } from './pipes/layer-title.pipe';
import { AreaComponent } from './viewer/components/area/area.component';

registerLocaleData(es)
export function getBaseHref(platformLocation: PlatformLocation): string {
  return platformLocation.getBaseHrefFromDOM();
}

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ViewerComponent,
    LayerListComponent,
    StartNavDirective,
    ThumbnailPlanPipe,
    FilterProjectsPipe,
    SafePipe,
    SecurePipe,
    BrowserComponent,
    MeasureComponent,
    PrintComponent,
    BaselayersComponent,
    CoordinatesComponent,
    ConsultasBasicasComponent,
    LayerTitlePipe,
    AreaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatListModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatTreeModule,
    DragDropModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSliderModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatButtonToggleModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })

  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
