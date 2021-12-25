import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { CardComponent } from './card/card.component';
import { BrowserComponent } from './browser/browser.component';
import { CardFormComponent } from './card-form/card-form.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TagListComponent } from './tag-list/tag-list.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CardComponent,
    BrowserComponent,
    CardFormComponent,
    StatisticsComponent,
    TagListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
