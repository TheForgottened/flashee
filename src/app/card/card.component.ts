import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { GlobalDataService } from '../global-data.service';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Tag } from '../clases/tag';
import Dexie from 'dexie';

@Component({
  selector: 'flashcard',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit, OnChanges {
  faTrash = faTrash;
  faEdit = faEdit;
  cardTags: Tag[] = [];

  showAnswer:boolean = false;

  @Input() flashcard!: Flashcard;

  @Output() modifyEvent = new EventEmitter<Flashcard>();
  @Output() deleteEvent = new EventEmitter<Flashcard>();
  @Output() getTagsEvent = new EventEmitter<Flashcard>();

  constructor(public globalData: GlobalDataService) {}

  ngOnInit(): void {
    
  }

  ngOnChanges() {
    this.getTagsByID(this.flashcard.tagIDs);
  }

  modificationEvent() {
    //console.log("Emitting card");
    this.globalData.setCard(this.flashcard);
    this.globalData.searchCards('', '');
    //this.modifyEvent.emit(this.flashcard);
  }

  getTagsByID(id?: string[]) {
    this.cardTags = [];
    db.tags.each((tag) => {
      id!.forEach((tagID) => {
        if (tag.idString === tagID) {
          this.cardTags.push(tag);
        }
      });
    });
  }

  async deletionEvent() {
    //TODO: add confirmation

    let tags = this.flashcard.tagIDs;
    let found = false;
    var tagsToDelete: number[] = [];
    let index = 0;
    let tag = '';

    db.cards.delete(this.flashcard.id);
    //this.deleteEvent.emit(this.flashcard);
    if ((await db.cards.toArray()).length == 0) {
      db.tags.clear();
    }

    let cards = await db.cards.toArray();

    for (let tagIDString of tags!) {
      tag = tagIDString;
      for (let card of cards) {
        for (let cardTagID of card.tagIDs!) {
      
          if (tagIDString === cardTagID) {
            found = true;
          }
        }
      }

        if (!found) {
          let tagID = +tag.replace(/\s/g, '');
          tagsToDelete.push(tagID);
        } else {
          found = false;
        }
      
    }
    tagsToDelete.forEach((tag) => {
      db.tags.delete(tag);
    });

    this.globalData.searchCards('', '');
    this.globalData.getTags();
  }

  sleep(ms: number) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  onAnswer(mouse:boolean) {    
    this.showAnswer = mouse;
    console.log("Mouse",this.showAnswer);
  }
}
