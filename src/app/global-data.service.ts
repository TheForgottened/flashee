import { Injectable } from '@angular/core';
import { liveQuery, Observable } from 'dexie';
import { stringify } from 'querystring';
import { BehaviorSubject, Subject } from 'rxjs';
import { EventEmitter } from 'stream';
import { brotliDecompress } from 'zlib';
import { db } from './clases/DbManager';
import { Flashcard } from './clases/flashcard';


@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {

  public selectedCard?: Flashcard = undefined;
  public cardChanged: Subject<Flashcard> = new Subject<Flashcard>();

  public cards: Observable<Flashcard[]> = this.getCards();
  public filterCards: Flashcard[] = [];
  public filterCardsObs: Subject<Flashcard[]> = new Subject<Flashcard[]>();


  constructor() {
    this.cardChanged.subscribe((card) => {
      this.selectedCard = card
    });
  }

  setCard(card?: Flashcard) {
    console.log("Card cambiada", card);
    //this.selectedCard = card;
    this.cardChanged.next(card!);
  }

  getCardQuestion(): string | undefined {
    console.log("card solicitada", this.selectedCard)
    return this.selectedCard?.question;
  }

  getCards(): Observable<Flashcard[]> {
    return liveQuery(() => db.cards.toArray());
  }

  searchCards(filter: string) {

    this.filterCards = [];
    this.filterCardsObs.next([]);

    db.cards.each(card => {
      console.log(card.question.toLowerCase(), filter, card.question.toLowerCase().includes(filter.toLowerCase()));
      if (
        card.question.toLowerCase().includes(filter.toLowerCase()) //||
        //card.answer.toLowerCase().includes(filter.toLowerCase()) ||
        //card.description!.toLowerCase().includes(filter.toLowerCase())          
      ) {
        //console.log("pushing: ",card)
        this.filterCards.push(card);
      }
    })

    //console.log("Filter cards",this.filterCards);
    this.filterCardsObs.next(this.filterCards);
  }



}
