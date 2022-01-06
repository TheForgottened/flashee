import { Injectable } from '@angular/core';
import { liveQuery, Observable } from 'dexie';
import { BehaviorSubject, Subject } from 'rxjs';
import { EventEmitter } from 'stream';
import { db } from './clases/DbManager';
import { Flashcard } from './clases/flashcard';


@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {

  public selectedCard?: Flashcard = undefined;
  public cardChanged:Subject<Flashcard> = new Subject<Flashcard>();

  public cards: Observable<Flashcard[]> = this.getCards();
  public filterCards: Observable<Flashcard[]> = this.cards;
  

  constructor() { 
    this.cardChanged.subscribe((card) => {
      this.selectedCard = card
    });
  }

  setCard(card?: Flashcard) {
    console.log("Card cambiada",card);
    //this.selectedCard = card;
    this.cardChanged.next(card!);
  }

  getCardQuestion(): string|undefined {
    console.log("card solicitada",this.selectedCard)
    return this.selectedCard?.question;
  }

  getCards(): Observable<Flashcard[]>{
    return liveQuery(() => db.cards.toArray());
  }
}
