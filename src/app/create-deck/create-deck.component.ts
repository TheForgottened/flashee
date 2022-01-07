import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { db } from '../clases/DbManager';
import { Deck } from '../clases/deck';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'create-deck',
  templateUrl: './create-deck.component.html',
  styleUrls: ['./create-deck.component.css']
})
export class CreateDeckComponent implements OnInit {
  name = new FormControl('');

  constructor(public globalData: GlobalDataService) { }

  @Input() deck?: Deck;

  async newDeck() {
    let deck : Deck = new Deck(this.name.value);
    await db.decks.add(deck);
  }

  ngOnInit(): void {
  }

}
