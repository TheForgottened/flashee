import { Injectable } from '@angular/core';
import { liveQuery, Observable } from 'dexie';
import { stringify } from 'querystring';
import { BehaviorSubject, Subject } from 'rxjs';
import { EventEmitter } from 'stream';
import { brotliDecompress } from 'zlib';
import { db } from './clases/DbManager';
import { Flashcard } from './clases/flashcard';
import { Tag } from './clases/tag';


@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {

  public tags: Tag[] = [];
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

  getTags() { 
    this.tags = [];
    db.tags.each(tag => { this.tags.push(tag); }) 
  }

  searchCards(filter: string, searchString: string) {

    this.filterCards = [];
    this.filterCardsObs.next([]);

    db.cards.each(card => {
      
      if (searchString.length == 0) { this.filterCards.push(card) }

      else if (filter.match("Question")) {
        if (card.question.toLowerCase().includes(searchString.toLowerCase())) 
          this.filterCards.push(card);
      } 
      // else if (filter.match("Tag")) {
      //   if (card.tags.toLowerCase().includes(searchString.toLowerCase())) 
      //     this.filterCards.push(card);
      // }
    })

    //console.log("Filter cards",this.filterCards);
    this.filterCardsObs.next(this.filterCards);
  }



}
