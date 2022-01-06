import { Compiler, NgModule } from '@angular/core';
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
import { CreateCardComponent } from './create-card/create-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HorizontalMenuComponent } from './horizontal-menu/horizontal-menu.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JitCompiler } from '@angular/compiler';
import { GlobalDataService } from './global-data.service';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CardComponent,
    BrowserComponent,
    CardFormComponent,
    StatisticsComponent,
    TagListComponent,
    CreateCardComponent,
    HorizontalMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [GlobalDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
