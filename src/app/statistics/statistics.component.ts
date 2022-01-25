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
  faTimes = faTimes;

  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(private globalData:GlobalDataService) {

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

  getPracticeTime(time: number): string {   
    //Get hours from milliseconds
    var hours = time / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

    return h + ':' + m + ':' + s;
  }

  // events
  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }
}
