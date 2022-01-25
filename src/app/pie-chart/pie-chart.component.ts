import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() { }

  ngOnInit(): void {
   this.loadData();
  }

  public loadData() {
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

  nameBinary(name: string):string {
    let newID = '';
    for (let index = 0; index < name.length; index++) {
      newID += name[index].charCodeAt(0).toString(2);
      if (index != name.length-1) newID += " ";
    }
    return newID;
  }

}


