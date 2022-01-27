import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { Tag } from '../clases/tag';

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
  public chartColors: any[] = [
    { 
      backgroundColor:["#FF7360", "#6FC8CE", "#FAFFF2", "#FFFCC4", "#B9E8E0"] 
    }];
  constructor() { }

  ngOnInit(): void {
   this.loadData();
  }

  public async loadData() {
    let ncards = 0;

    let tags:Tag[] = await db.tags.toArray();
    let cards:Flashcard[] = await db.cards.toArray();

    tags.forEach(t=>{
      this.pieChartLabels.push(t.id)
      cards.forEach(c=>{
        if (c.tagIDs?.includes(t.id)){
          ncards ++;
        }
      })

      this.pieChartData.push(ncards);
      ncards = 0;
    })

    console.log("Piechartdata",this.pieChartLabels,this.pieChartData)
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


