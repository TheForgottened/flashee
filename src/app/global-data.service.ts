import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { liveQuery, Observable } from 'dexie';
import { Subject } from 'rxjs';
import { db } from './clases/DbManager';
import { Flashcard } from './clases/flashcard';
import { Tag } from './clases/tag';

@Injectable({
  providedIn: 'root',
})
export class GlobalDataService implements OnChanges {
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
  public tagChanged: Subject<Tag[]> = new Subject<Tag[]>();

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
    this.tags = await db.tags.toArray()
    console.log("tags", this.tags)
  }

  searchCards(filter: string, searchString: string, match?: boolean) {
    //this.filterCards = [];
    this.filterCardsObs.next([]);
    let filtered:Flashcard[] = [];

    if (!searchString || !filter) {
      console.log("nocards")
      db.cards.toArray(arr => this.filterCards = arr);
    } else {
      switch (filter) {
        case 'Question':
          this.filterCards.forEach(c => {
            if (c.question.toLowerCase().includes(searchString.toLowerCase())) { 
              filtered.push(c) 
            };
          });
          this.filterCards = filtered;
          break;
        case 'Answer':
          this.cards.forEach(c => {
            if (c.answer.toLowerCase().includes(searchString.toLowerCase())) filtered.push(c) ;
          });
          this.filterCards = filtered;
          break;
        case 'Description':
          this.cards.forEach(c => {
            if (c.description!.toLowerCase().includes(searchString.toLowerCase())) filtered.push(c) ;
          });
          this.filterCards = filtered;
          break;
        case 'Tag':
          db.cards
            .where("tagIDs")
            .equals(searchString)
            .toArray(arr => {
              this.filterCards = arr;
              console.log("filter tag", arr)
            })
          break;
      }
    }
  }
}
