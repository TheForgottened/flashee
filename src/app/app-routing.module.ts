import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

const routes: Routes = [
  {
    path: 'line-chart',
    component: LineChartComponent
  },
  {
    path: 'pie-chart',
    component: PieChartComponent
  }
  
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
