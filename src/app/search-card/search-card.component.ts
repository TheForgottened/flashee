import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { liveQuery } from 'dexie';
import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { Tag } from '../clases/tag';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.css']
})
export class SearchCardComponent implements OnInit {
  searchString = new FormControl('');
  foundCards = new Set<Flashcard>(); 
  found = false;

  options = [
    { name: "Question", value: "question" },
    { name: "Answer", value: "answer" },
    { name: "Tag", value: "tag" },
    { name: "Description", value: "description"}
  ]

  constructor (private globalData: GlobalDataService) {
  
  }

  selectedOption: string = "Question";

  searchCard() {
    //this.foundCards.clear();
    //if (this.searchString.value == "") return;
    this.globalData.searchCards(this.selectedOption, this.searchString.value);
    console.log("Searched",this.globalData.filterCards);
  }

  ngOnInit(): void {
    this.searchCard();
  }

}
