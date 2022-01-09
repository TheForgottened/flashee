import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
export class CardComponent implements OnInit {
  faTrash = faTrash;
  faEdit = faEdit;
  cardTags: Tag[] = [];
  @Input() flashcard!: Flashcard;

  @Output() modifyEvent = new EventEmitter<Flashcard>();
  @Output() deleteEvent = new EventEmitter<Flashcard>();
  @Output() getTagsEvent = new EventEmitter<Flashcard>();

  constructor(public globalData: GlobalDataService) {}

  ngOnInit(): void {
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

    db.cards
      .each((card) => {
        card.tagIDs!.forEach((cardTagID) => {
          let cardTagName = cardTagID
            .split(' ')
            .map((bin) => String.fromCharCode(parseInt(bin, 2)))
            .join('');
          tags!.forEach((tagIDString) => {
            tag = tagIDString;
            let tagName = tagIDString
              .split(' ')
              .map((bin) => String.fromCharCode(parseInt(bin, 2)))
              .join('');

            if (tagName === cardTagName) {
              found = true;
            }
          });

          if (!found) {
            let tagID = +tag.replace(/\s/g, '');
            tagsToDelete.push(tagID);
          } else {
            found = false;
          }
        });
      })
      .then(() => {
        tagsToDelete.forEach((tag) => {
          db.tags.delete(tag);
        });

        this.globalData.searchCards('', '');
        this.globalData.getTags();
      });
  }

  sleep(ms: number) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }
}
