import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { db } from '../clases/DbManager';
import { Deck } from '../clases/deck';
import { Flashcard } from '../clases/flashcard';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {

  @Input() deck!: Deck;

  @Output() modifyEvent = new EventEmitter<Deck>();
  @Output() deleteEvent = new EventEmitter<Deck>();
  @Output() addEvent = new EventEmitter<Deck>();

  constructor(public globalData: GlobalDataService) { }

  ngOnInit(): void {
  }

  addCard() {
    if (this.globalData.selectedCard == undefined) return;

    this.deck.cards.add(this.globalData.selectedCard);
    db.decks.put(this.deck);

    this.addEvent.emit(this.deck);
  }

  viewCards() {
    this.globalData.setViewDeckCards(true);
  }

  onSelect() {
    if (this.globalData.selectedDeck! == this.deck) {
      this.globalData.setViewDeckCards(false);
      this.globalData.setDeck(undefined);
    } else {
      this.globalData.setViewDeckCards(true);
      this.globalData.setDeck(this.deck);
    }
  }
}
