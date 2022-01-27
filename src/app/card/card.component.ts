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

  showAnswer: boolean = false;

  @Input() flashcard!: Flashcard;

  @Output() modifyEvent = new EventEmitter<Flashcard>();
  @Output() deleteEvent = new EventEmitter<Flashcard>();
  @Output() getTagsEvent = new EventEmitter<Flashcard>();

  constructor(public globalData: GlobalDataService) {
  }

  ngOnInit(): void {

  }

  ngOnChanges() {
    if (this.flashcard.tagIDs) this.getTagsByID(this.flashcard.tagIDs);
  }

  modificationEvent() {
    //console.log("Emitting card");
    this.globalData.setCard(this.flashcard);
    this.globalData.searchCards('', '');
    //this.modifyEvent.emit(this.flashcard);
  }

  /*
  * Get all the tags from a card
  */
  async getTagsByID(id: string[]) {
    this.cardTags = [];
    this.cardTags = await db.tags
      .where("id").anyOf(id)
      .toArray()
  }

  async deletionEvent() {
    //TODO: add confirmation

    let tags = this.flashcard.tagIDs;
    let found = false;
    var tagsToDelete: string[] = [];
    let index = 0;
    let tag = '';

    // Delete from display not database
    this.globalData.filterCards.splice(this.globalData.filterCards.indexOf(this.flashcard), 1);

    // Actual deletion of the card
    db.cards.delete(this.flashcard.id);

    // Delete the old ids
    this.deleteTags(this.flashcard.tagIDs,undefined)
  }

  sleep(ms: number) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  onAnswer(mouse: boolean) {
    this.showAnswer = mouse;
  }

  /*
  * Turns a list of tags into a string to display
  */
  public getTagsString(tags: string[] | undefined): string {
    let result: string = '';

    for (let tag of tags!) {
      let tagName = tag
        .split(' ')
        .map((bin) => String.fromCharCode(parseInt(bin, 2)))
        .join('');
      result += tagName;
      result += ',';
    }

    result = result.slice(0, result.length - 1);

    return result;
  }

  /*
  * Delete tags no longer in use
  */
  async deleteTags(oldTags:string[]|undefined, newTags:string[] | undefined): Promise<number>{
    if (oldTags == undefined || oldTags?.length == 0) return 0;

    // tags being deleted from the db 
    let delTags: string[] = [];

    // Difference between arrays
    if (newTags ==  undefined){
      delTags = oldTags;
    }else {
      oldTags.forEach(tag => {
        if(!newTags.includes(tag)) delTags.push(tag);
      })
    }    

    // chech if any other card contains the tag
    delTags.forEach(tag=>{
      let exists =  false;
      db.cards.each(card => {        
        if (card.tagIDs?.includes(tag)) exists = true;
        console.log("Actual card",card,tag,!exists);
        return;
      }).finally(() => {
        // If there are no instances of the card
        if(!exists) {
          console.log("Deleting",tag,!exists);
          db.tags.where("id").equals(tag).delete();
          this.globalData.getTags()
        }
      })      
    })

    return 1;
  }
}
