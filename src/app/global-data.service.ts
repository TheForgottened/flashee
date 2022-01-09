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
  providedIn: 'root',
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
      this.selectedCard = card;
    });
  }

  setCard(card?: Flashcard) {
    console.log('Card cambiada', card);
    //this.selectedCard = card;
    this.cardChanged.next(card!);
  }

  getCardQuestion(): string | undefined {
    console.log('card solicitada', this.selectedCard);
    return this.selectedCard?.question;
  }

  getCards(): Observable<Flashcard[]> {
    return liveQuery(() => db.cards.toArray());
  }

  getTags() {
    this.tags = [];
    db.tags.each((tag) => {
      this.tags.push(tag);
    });
  }

  searchCards(filter: string, searchString: string, match?: boolean) {
    this.filterCards = [];
    this.filterCardsObs.next([]);

    db.cards.each((card) => {
      switch (filter) {
        case '':
          this.filterCards.push(card);
          break;
        case 'Question':
          if (card.question.toLowerCase().includes(searchString.toLowerCase()))
            this.filterCards.push(card);
          break;
        case 'Answer':
          if (card.answer.toLowerCase().includes(searchString.toLowerCase()))
            this.filterCards.push(card);
          break;
        case 'Description':
          if (
            card.description!.toLowerCase().includes(searchString.toLowerCase())
          )
            this.filterCards.push(card);
          break;
        case 'Tag':
          for (const tag of card.tags!) {
            if (match) {
              if (tag.name.toLowerCase() === searchString.toLowerCase())
                this.filterCards.push(card);
            } else {
              if (tag.name.toLowerCase().includes(searchString.toLowerCase()))
                this.filterCards.push(card);
            }
          }
          break;
      }
    });

    //console.log("Filter cards",this.filterCards);
    this.filterCardsObs.next(this.filterCards);
  }
}
