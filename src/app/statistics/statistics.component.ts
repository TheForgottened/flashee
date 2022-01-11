import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalDataService } from '../global-data.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { liveQuery, Observable } from 'dexie';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { db } from '../clases/DbManager';
import { Quiz } from '../clases/quiz';
import { Flashcard } from '../clases/flashcard';


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

  // Pie chart

  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  
  
  faTimes = faTimes;

  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(private globalData:GlobalDataService) {

    // Line chart
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

    // Pie chart
    let ncards = 0;
    let cards = db.cards.toArray();
    let arrCards:Flashcard[];

    cards.then(cards => arrCards = cards);

    db.tags.each(t => {
      this.pieChartLabels.push(t.name);

        arrCards.forEach(c => {         
          if (c.tagIDs?.includes(this.nameBinary(t.name))) {
            ncards++;            
          }
        })
      
      this.pieChartData.push(ncards);
      ncards= 0;
    })

    console.log(this.pieChartLabels,this.pieChartData)

  }
  

  ngOnInit(): void {    
  }

  close(){
    this.closeEvent.emit(true);
  }

  nameBinary(name: string):string {
    let newID = '';
    for (let index = 0; index < name.length; index++) {
      newID += name[index].charCodeAt(0).toString(2);
      if (index != name.length-1) newID += " ";
    }
    

    return newID;
  }

  // events
  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }
}
