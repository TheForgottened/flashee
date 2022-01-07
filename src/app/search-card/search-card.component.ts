import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { liveQuery } from 'dexie';
import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { CARDS } from '../clases/prueba-tarjetas';
import { Tag } from '../clases/tag';

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
  selectedOption!: string;

  searchCard() {
    this.foundCards.clear();

    if (this.searchString.value == "") return;

    db.cards.each(card => {
        switch (this.selectedOption) {
          case "Question":
              if (card.question.toLowerCase().includes(this.searchString.value.toLowerCase())) {
                this.foundCards.add(card);
                this.found = true;
              }
            break;

          case "Answer":
              if (card.answer.toLowerCase().includes(this.searchString.value.toLowerCase())) {
                this.foundCards.add(card);
                this.found = true;
              }
            break;

          case "Description":
              if (card.description?.toLowerCase().includes(this.searchString.value.toLowerCase())) {
                this.foundCards.add(card);
                this.found = true;
              }
            break;

          case "Tag":
              for (const tag of card.tags!) {
                if (tag.name.toLowerCase().includes(this.searchString.value.toLowerCase())) {
                  this.foundCards.add(card);
                  this.found = true;
                }
              }
            break;
        }
    });
    if (this.foundCards.size)
      this.found = false;
  }

  ngOnInit(): void {
  }

}
