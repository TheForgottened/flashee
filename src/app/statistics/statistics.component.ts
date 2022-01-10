import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalDataService } from '../global-data.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';


@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit {

  lineChartData: ChartDataSets[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Crude oil prices' },
  ];
 
  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];
 
  lineChartOptions = {
    responsive: true,
  };
 
  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];
 
  public lineChartLegend = true;
  public lineChartPlugins = [];
  public lineChartType: ChartType = 'line';
  
  
  faTimes = faTimes;

  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(private globalData:GlobalDataService) { }
  

  ngOnInit(): void {
  }

  close(){
    this.closeEvent.emit(true);
  }

}
