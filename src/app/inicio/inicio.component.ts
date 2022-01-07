import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { liveQuery } from 'dexie';
import { DbManager, db } from '../clases/DbManager';
import { Deck } from '../clases/deck';
import { Flashcard } from '../clases/flashcard';
import { CARDS } from '../clases/prueba-tarjetas';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {

  selectedDeck?: Deck;
  selectedCard?: Flashcard;
  cards = liveQuery(() => db.cards.toArray());
  decks = liveQuery(() => db.decks.toArray());
  @Output() modCardEvent = new EventEmitter<Flashcard>(); 
  
  constructor(public globalData:GlobalDataService) { }

  onSelectCard(card: Flashcard): void {
    //this.selectedCard = card;
    this.globalData.setCard(card);
  }

  onSelectDeck(deck: Deck): void {
    this.globalData.setDeck(deck);
  }

  onModify(card: Flashcard) {
    this.modCardEvent.emit(card);
  }

  ngOnInit(): void {
    //! RESETS THE DATABASE
    // db.delete().then (()=>db.open());
  }

}
