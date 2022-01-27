import { Compiler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { CardComponent } from './card/card.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { CreateCardComponent } from './create-card/create-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JitCompiler } from '@angular/compiler';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchCardComponent } from './search-card/search-card.component';
import { GlobalDataService } from './global-data.service';
import { QuizComponent } from './quiz/quiz.component';

import { ChartsModule } from 'ng2-charts';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CardComponent,
    StatisticsComponent,
    TagListComponent,
    CreateCardComponent,
    SearchCardComponent,
    QuizComponent,
    LineChartComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ChartsModule
  ],
  providers: [GlobalDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
