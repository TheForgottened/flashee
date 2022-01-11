import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalDataService } from '../global-data.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { liveQuery, Observable } from 'dexie';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { db } from '../clases/DbManager';
import { Quiz } from '../clases/quiz';


@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})

export class StatisticsComponent implements OnInit {

  lineChartData: ChartDataSets[] = [];
 
  lineChartLabels: Label[] = [];
 
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

  constructor(private globalData:GlobalDataService) {

    let dates: Label[] = [];
    let data:number[] = [];

    db.quizzes.each(q => {
      dates.push(q.date.toISOString().split('T')[0])
      data.push((q.correctAnswers/q.nQuestions)*10);
      console.log(q)
    });


    this.lineChartLabels= dates;
    this.lineChartData.push(
      { data: data, label: 'Score' }
    )

    

  }

  fetchData() {
    
  }
  

  ngOnInit(): void {
    

    
  }

  close(){
    this.closeEvent.emit(true);
  }

}
