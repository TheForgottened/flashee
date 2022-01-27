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

  public time:number =0 ;
  public numCards:number =0 ;

  faTimes = faTimes;

  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(private globalData:GlobalDataService) {

  }
  

  ngOnInit(): void { 
    this.getPracticeTime();
    this.getNumberCards()
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

  async getNumberCards() {
    this.numCards = await db.cards.count()
  }

  async getPracticeTime(): Promise<number> {   
    let time = 0;
    await db.quizzes.each(q=>{
      time += q.time
    })
    this.time = time;
    return time;
  }

  // events
  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }
}
