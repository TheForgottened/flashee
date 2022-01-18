import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
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
export class GlobalDataService implements OnChanges{
  public tags: Tag[] = [];
  public selectedCard?: Flashcard = undefined;
  public cardChanged: Subject<Flashcard> = new Subject<Flashcard>();
  public cardTags: Tag[] = [];
  public cardsObs: Observable<Flashcard[]> = this.getCardsObs();
  public cards: Flashcard[] = [];
  public filterCards: Flashcard[] = [];
  public filterCardsObs: Subject<Flashcard[]> = new Subject<Flashcard[]>();
  public createQuiz: boolean = false;
  public tagsQuiz: Tag[] = [];
  public createCard: boolean = false;

  constructor() {
    this.cardChanged.subscribe((card) => {
      this.selectedCard = card;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getCards();
    this.getTags();
  }

  setCard(card?: Flashcard) {
    //console.log('Card cambiada', card);
    //this.selectedCard = card;
    this.cardChanged.next(card!);
  }

  getCardQuestion(): string | undefined {
    console.log('card solicitada', this.selectedCard);
    return this.selectedCard?.question;
  }

  getCardsObs(): Observable<Flashcard[]> {
    return liveQuery(() => db.cards.toArray());
  }

  async getCards() {
    this.cards = [];
    await db.cards.each(card => {
      this.cards.push(card);
    })
  }

  async getTags() {
    this.tags = [];
    await db.tags.each((tag) => {
      this.tags.push(tag);
    });
  }

  searchCards(filter: string, searchString: string, match?: boolean) {
    this.filterCards = [];
    this.filterCardsObs.next([]);

    if (searchString.length == 0 && filter.length == 0) {
      db.cards.toArray().then((arr) => {
        arr.forEach((card) => {
          this.filterCards.push(card);
        });
        return;
      });
    }

    db.cards.each((card) => {
      switch (filter) {
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
          card.tagIDs?.forEach((tag) => {
            let tagName = tag
              .split(' ')
              .map((bin) => String.fromCharCode(parseInt(bin, 2)))
              .join('');

            if (match) {
              if (tagName.toLowerCase() === searchString.toLowerCase())
                this.filterCards.push(card);
            } else {
              if (tagName.toLowerCase().includes(searchString.toLowerCase()))
                this.filterCards.push(card);
            }
          });
          break;
      }
    });

    //console.log("Filter cards",this.filterCards);
    this.filterCardsObs.next(this.filterCards);
  }
}
