import { Injectable } from '@angular/core';
import { liveQuery, Observable } from 'dexie';
import { BehaviorSubject, Subject } from 'rxjs';
import { db } from './clases/DbManager';
import { Flashcard } from './clases/flashcard';


@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {

  public selectedCard?: Flashcard = undefined;

  public cards: Observable<Flashcard[]> = this.getCards();
  public filterCards: Observable<Flashcard[]> = this.cards;
  

  constructor() { }

  setCard(card?: Flashcard) {
    console.log("Card cambiada",card);
    this.selectedCard = card;
  }

  getCardQuestion(): string|undefined {
    console.log("card solicitada",this.selectedCard)
    return this.selectedCard?.question;
  }

  getCards(): Observable<Flashcard[]>{
    return liveQuery(() => db.cards.toArray());
  }
}
