import { DOCUMENT } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'geoviewer';
  constructor(
    public translate: TranslateService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(DOCUMENT) private document: Document,
    private _adapter: DateAdapter<any>
  ) {
    translate.addLangs(['es', 'eu']);
    //console.log(this.locale)
    if (this.locale === 'eu') {
      this.document.documentElement.lang = this.locale;
      translate.setDefaultLang(this.locale);
      translate.use(this.locale);
      this._adapter.setLocale(this.locale);
    } else {
      this.document.documentElement.lang = 'es';
      translate.setDefaultLang('es');
      translate.use('es');
      this._adapter.setLocale('es');
    }
  }
}
