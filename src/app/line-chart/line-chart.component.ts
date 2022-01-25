import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { db } from '../clases/DbManager';

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[] = [];
  time: number = 0;

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  lineChartLegend = true;
  lineChartType: string = 'line';
  lineChartPlugins = [];
  chart: any;

  constructor() { }

  ngOnInit(): void {
    // Line chart
    let dates: Label[] = [];
    let data: number[] = [];

    db.quizzes.each(q => {
      dates.push(q.date.toISOString().split('T')[0])
      data.push((q.correctAnswers/q.nQuestions)*10);
      this.time += q.time
      console.log(q)
    })

    this.lineChartLabels= dates;
    this.lineChartData.push(
      { data: data, label: 'Score' }
    ) 
  
  }

}
